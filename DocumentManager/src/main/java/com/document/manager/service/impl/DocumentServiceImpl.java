package com.document.manager.service.impl;

import com.document.manager.algorithm.Algorithm;
import com.document.manager.domain.DocumentApp;
import com.document.manager.domain.RateApp;
import com.document.manager.domain.Sentences;
import com.document.manager.domain.UserApp;
import com.document.manager.dto.*;
import com.document.manager.dto.constants.Constants;
import com.document.manager.dto.enums.PlagiarismStatus;
import com.document.manager.dto.enums.RateType;
import com.document.manager.dto.mapper.DTOMapper;
import com.document.manager.repository.DocumentRepo;
import com.document.manager.service.*;
import javassist.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.BreakIterator;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private FileService fileService;

    @Autowired
    private DocumentRepo documentRepo;

    @Autowired
    private SentencesService sentencesService;

    @Autowired
    private UserService userService;

    @Autowired
    private DTOMapper dtoMapper;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private SFTPService sftpService;

    @Autowired
    private RateService rateService;

    private static final String REGEX_DIVISION = "[?!.;]";
    private static final Integer LIMIT_CHARACTER = 30;
    private static final String DIVISION = "\\~~";
    private static final String PUNCTUATION = "[?!.;,!@#$%^&*()_+=-`:<>/|]";

    @Override
    public DocumentDTO getDetailDocument(Long documentId) throws NotFoundException, IOException {
        if (documentId == null) {
            throw new IllegalArgumentException("Document id can't null");
        }
        Optional<DocumentApp> documentOptional = documentRepo.findById(documentId);
        if (!documentOptional.isPresent()) {
            throw new NotFoundException("Document of user not found");
        }
        DocumentDTO documentDTO = dtoMapper.toDocumentDTO(documentOptional.get());
        if (!StringUtils.isEmpty(documentDTO.getLink())) {
            log.info("Start get content of details document with id: {} and link {}",
                    documentDTO.getDocumentId(), documentDTO.getLink());
            documentDTO.setContents(dtoMapper.toBytesArray(sftpService.getFileFromSFTP(documentDTO.getLink())));
        }
        return documentDTO;
    }

    @Override
    public List<DocumentDTO> getDocumentOfCurrentUser() {
        try {
            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                log.error("Can't get info of user current!");
                throw new IllegalArgumentException("Can't get info of user current!");
            }
            String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
            UserApp userApp = userService.findByEmail(email);
            if (userApp == null) {
                log.error("User with email {} not found", email);
                throw new NotFoundException("Current user not found");
            }
            List<DocumentDTO> documentDTOS = new ArrayList<>();
            List<DocumentApp> documentApps = this.findByUserId(userApp.getId());
            if (!CollectionUtils.isEmpty(documentApps)) {
                Map<Long, byte[]> mapContent = sftpService.getDocumentsFromSFTP(documentApps);
                documentDTOS = dtoMapper.toDocumentDTO(documentApps);
                if (mapContent.size() > 0) {
                    for (DocumentDTO documentDTO : documentDTOS) {
                        if (mapContent.containsKey(documentDTO.getDocumentId())) {
                            documentDTO.setContents(dtoMapper.toBytesArray(mapContent.get(documentDTO.getDocumentId())));
                        }
                    }
                }
            }
            return documentDTOS;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public DocumentApp save(DocumentApp documentApp) {
        if (documentApp == null) {
            throw new IllegalArgumentException("Document app invalid");
        }
        return documentRepo.save(documentApp);
    }

    @Override
    public long count() {
        return documentRepo.count();
    }

    @Transactional
    @Override
    public PlagiarismDocumentDTO uploadDocument(UploadDocumentDTO uploadDTO) throws IOException {
        log.info("Start upload document");
        if (uploadDTO == null) {
            throw new FileNotFoundException("Data upload document invalid!");
        }
        MultipartFile file = uploadDTO.getMultipartFile();
        if (file == null) {
            throw new FileNotFoundException("File document not found!");
        }
        try {
            // File documentFile = new File(file.getOriginalFilename());
            log.info("Create temp file");
            File documentFile = File.createTempFile("prefix-", "-suffix");
            FileUtils.writeByteArrayToFile(documentFile, file.getBytes());
            documentFile.deleteOnExit();
            log.info("Create temp file successful");

            // TODO: Read content of file
            log.info("Start read file...");
            String[] targets = this.divisionToSentences(fileService.readContentDocument(documentFile));
            log.info("Read file successful");

            // TODO: Get tokenizer of targets
            //Map<Integer, List<String>> tokenizerOfTarget = getTokenizer(targets);
            Map<Integer, List<String>> tokenizerOfTarget = getTokenizerBySpace(targets);

            // TODO: Admin should be upload which don't check plagiarism
            if (userService.isAdmin()) {
                List<Sentences> sentences = new ArrayList<>();
                for (int i = 0; i < targets.length; i = i + 3) {
                    Sentences sentence = Sentences.builder()
                            .rawText(getRawTextOfPart(i, targets))
                            .tokenizer(getTokenizerOfPart(i, tokenizerOfTarget))
                            .build();
                    sentences.add(sentence);
                }

                //String link = fileService.saveFile(Constants.DIR_UPLOADED_REPORT, file.getOriginalFilename(), file.getBytes());
                String link = sftpService.uploadFileToSFTP(Constants.LOCATION_DOCUMENT, uploadDTO.getMultipartFile());

                DocumentApp documentApp = DocumentApp.builder()
                        .title(uploadDTO.getTitle())
                        .fileName(file.getOriginalFilename())
                        .link(link)
                        .note(uploadDTO.getNote())
                        .createdStamp(new Date())
                        .userApp(userService.getCurrentUser())
                        .sentences(sentences)
                        .build();
                this.save(documentApp);
                return null;
            }

            // TODO: Check plagiarism
            PlagiarismDocumentDTO plagiarismDocumentDTO = this.getPlagiarism(targets, tokenizerOfTarget);

            if (plagiarismDocumentDTO.getDocumentId() != null) {
                Optional<DocumentApp> optionalDocumentApp = documentRepo.findById(plagiarismDocumentDTO.getDocumentId());
                if (optionalDocumentApp.isPresent()) {
                    plagiarismDocumentDTO.setTitle(optionalDocumentApp.get().getTitle());
                    plagiarismDocumentDTO.setNote(optionalDocumentApp.get().getNote());
                }
            }

            if (existPlagiarism(plagiarismDocumentDTO)) {
                plagiarismDocumentDTO.setStatus(false);
                if (plagiarismDocumentDTO.getRate() == 100) {
                    plagiarismDocumentDTO.setMessage(PlagiarismStatus.SAME.name());
                    plagiarismDocumentDTO.setPlagiarism(null);
                    if (plagiarismDocumentDTO.getDocumentId() != null) {
                        Optional<DocumentApp> documentAppOptional = documentRepo.findById(plagiarismDocumentDTO.getDocumentId());
                        if (documentAppOptional.isPresent()) {
                            log.info("Start get file the same with link: {}", documentAppOptional.get().getLink());
                            plagiarismDocumentDTO.setContents(dtoMapper.toBytesArray(sftpService
                                    .getFileFromSFTP(documentAppOptional.get().getLink())));
                        }
                    }
                } else {
                    plagiarismDocumentDTO.setMessage(PlagiarismStatus.SIMILAR.name());
                }
                this.printResultTest(plagiarismDocumentDTO);
                return plagiarismDocumentDTO;
            } else {
                plagiarismDocumentDTO.setMessage(PlagiarismStatus.DIFFERENT.name());
                // TODO: Build data and store into DB
                List<Sentences> sentences = new ArrayList<>();
                for (int i = 0; i < targets.length; i = i + 3) {
                    Sentences sentence = Sentences.builder()
                            .rawText(getRawTextOfPart(i, targets))
                            .tokenizer(getTokenizerOfPart(i, tokenizerOfTarget))
                            .build();
                    sentences.add(sentence);
                }
                // TODO: Save file
                //String link = fileService.saveFile(Constants.DIR_UPLOADED_REPORT, file.getOriginalFilename(), file.getBytes());
                String link = sftpService.uploadFileToSFTP(Constants.LOCATION_DOCUMENT, uploadDTO.getMultipartFile());

                DocumentApp documentApp = DocumentApp.builder()
                        .title(uploadDTO.getTitle())
                        .fileName(file.getOriginalFilename())
                        .link(link)
                        .note(uploadDTO.getNote())
                        .createdStamp(new Date())
                        .userApp(userService.getCurrentUser())
                        .sentences(sentences)
                        .build();
                this.save(documentApp);
            }
        } catch (Exception e) {
            throw new IOException(e.getMessage());
        }
        return null;
    }

    private String getRawTextOfPart(int index, String[] array) {
        StringBuilder s = new StringBuilder();
        for (int i = index; i < index + 3; i++) {
            if (i < array.length) {
                if (StringUtils.isNotBlank(s.toString())) {
                    s.append("~~");
                }
                s.append(array[i]);
            }
        }
        return s.toString();
    }

    private String getTokenizerOfPart(int index, Map<Integer, List<String>> tokenizers) {
        StringBuilder s = new StringBuilder();
        for (int i = index; i < index + 3; i++) {
            if (tokenizers.containsKey(i)) {
                if (StringUtils.isNotBlank(s.toString())) {
                    s.append("~~");
                }
                s.append(tokenizers.get(i).stream().collect(Collectors.joining("|")));
            }
        }
        return s.toString();
    }

    @Override
    public String[] divisionToSentences(String content) throws Exception {
        if (StringUtils.isEmpty(content)) {
            throw new IllegalArgumentException("Content is empty");
        }
        try {
            content = content.replaceAll("\r\n", " ");
            content = content.replaceAll("\\s+", " ");
            List<String> sentences = new LinkedList<>(Arrays.asList(content.split(REGEX_DIVISION)));
            List<Integer> deletes = new ArrayList<>();
            for (int i = 0; i < sentences.size(); i++) {
                if (sentences.get(i).trim().length() < LIMIT_CHARACTER) {
                    String s = sentences.get(i).trim();
                    int index = i;
                    while (s.length() < LIMIT_CHARACTER && i + 1 < sentences.size()) {
                        i++;
                        deletes.add(i);
                        s += sentences.get(i).trim();
                    }
                    sentences.set(index, s);
                }
            }
            List<String> elementDeletes = new ArrayList<>();
            deletes.forEach(d -> elementDeletes.add(sentences.get(d)));
            elementDeletes.forEach(e -> sentences.remove(e));
            sentences.stream().filter(s -> !StringUtils.isBlank(s)).collect(Collectors.toList());
            return sentences.stream().filter(s -> !StringUtils.isBlank(s)).map(String::trim).toArray(size -> new String[size]);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    private String[] division(String content) {
        content = content.replaceAll("\r\n", " ");
        List<String> sentences = new ArrayList<>();
        BreakIterator iterator = BreakIterator.getSentenceInstance(Locale.US);
        iterator.setText(content);
        int start = iterator.first();
        for (int end = iterator.next();
             end != BreakIterator.DONE;
             start = end, end = iterator.next()) {
            while (end - start < 30) {
                end = iterator.next();
            }
            sentences.add(content.substring(start, end).trim());
        }
        return sentences.stream().filter(StringUtils::isNotBlank).collect(Collectors.toList()).toArray(new String[sentences.size()]);
    }

    @Override
    public List<DocumentApp> findByUserId(Long userId) {
        return documentRepo.findByUserId(userId);
    }

    @Override
    public List<DocumentApp> findAll() {
        return documentRepo.findAll();
    }

    @Override
    public PlagiarismDocumentDTO getPlagiarism(String[] targets, Map<Integer, List<String>> tokenizerOfTarget) {
        if (targets == null || targets.length <= 0) {
            throw new IllegalArgumentException("Array targets want to check plagiarism invalid");
        }
        PlagiarismDocumentDTO plagiarismDocumentDTO = new PlagiarismDocumentDTO();

        // TODO: Get sentences of all documents in database
        List<DocumentApp> documentApps = this.findAll();
        Map<Long, List<Sentences>> allSentences = this.getAllSentences();

        // TODO: If in database haven't document then return empty
        if (allSentences == null || allSentences.isEmpty()) {
            return plagiarismDocumentDTO;
        }

        // TODO: Loop all document to check plagiarism with target
        documentApps.forEach(d -> {
            try {
                updatePlagiarism(targets, d.getId(), allSentences, tokenizerOfTarget, plagiarismDocumentDTO);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        return plagiarismDocumentDTO;
    }

    @Override
    public void delete(Long documentId) {
        try {
            UserApp userApp = userService.getCurrentUser();
            if (userApp == null) {
                throw new IllegalArgumentException("Can't get information of user current");
            }
            Optional<DocumentApp> documentOptional = documentRepo.findByDocumentIdAndUserId(documentId, userApp.getId());
            if (!documentOptional.isPresent()) {
                throw new NotFoundException("Document of user not found");
            }
            documentRepo.delete(documentOptional.get());
            sftpService.deleteFile(documentOptional.get().getLink());
            log.info("Delete document with id {} successful", documentId);
        } catch (Exception e) {
            log.error("Delete document with id {} failed because: {}", documentId, e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void update(Long documentId, UpdateDocumentDTO updateDocumentDTO) {
        try {
            UserApp userApp = userService.getCurrentUser();
            if (userApp == null) {
                throw new IllegalArgumentException("Can't get information of user current");
            }
            Optional<DocumentApp> documentOptional = documentRepo.findByDocumentIdAndUserId(documentId, userApp.getId());
            if (!documentOptional.isPresent()) {
                throw new NotFoundException("Document of user not found");
            }
            DocumentApp documentApp = documentOptional.get();
            documentApp.setTitle(updateDocumentDTO.getTitle());
            documentApp.setNote(updateDocumentDTO.getNote());
            documentApp.setModifiedStamp(new Date());
            documentRepo.save(documentOptional.get());
            log.info("Update document with id {} successful", documentId);
        } catch (Exception e) {
            log.error("Update document with id {} failed because: {}", documentId, e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public Map<Long, List<Sentences>> getAllSentences() {
        List<Sentences> sentences = sentencesService.findAll();
        Map<Long, List<Sentences>> map = new HashMap<>();
        for (Sentences sentence : sentences) {
            if (!map.containsKey(sentence.getDocumentApp().getId())) {
                map.put(sentence.getDocumentApp().getId(), Collections.singletonList(sentence));
            } else {
                List<Sentences> temps = new LinkedList<>(map.get(sentence.getDocumentApp().getId()));
                temps.add(sentence);
                map.put(sentence.getDocumentApp().getId(), temps);
            }
        }
        return map;
    }

    public List<String> getTokenizerFromSentences(Sentences sentences) {
        if (sentences == null || StringUtils.isEmpty(sentences.getTokenizer())) {
            return new ArrayList<>();
        }
        return Arrays.asList(sentences.getTokenizer().split("[|]"));
    }

//    public Map<Integer, List<String>> getTokenizer(String[] targets) throws IOException {
//        Map<Integer, List<String>> map = new HashMap<>();
//        String[] annotators = {"wseg", "pos", "ner", "parse"};
//        VnCoreNLP pipeline = new VnCoreNLP(annotators);
//        for (int i = 0; i < targets.length; i++) {
//            Annotation annotation = new Annotation(targets[i]);
//            try {
//                pipeline.annotate(annotation);
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//
//            List<Word> words = annotation.getWords();
//            List<String> tokenizerOfTarget = new ArrayList<>();
//            words.stream().forEach(w -> tokenizerOfTarget.add(w.getForm()));
//            map.put(i, tokenizerOfTarget);
//        }
//        return map;
//    }

    public Map<Integer, List<String>> getTokenizerBySpace(String[] targets) throws IOException {
        Map<Integer, List<String>> map = new HashMap<>();
        for (int i = 0; i < targets.length; i++) {
            String[] words = targets[i].split("\\s+");
            List<String> tokenizerOfTarget = new ArrayList<>();
            Arrays.stream(words).forEach(w -> tokenizerOfTarget.add(w));
            map.put(i, tokenizerOfTarget);
        }
        return map;
    }

    public List<String> getCommonTokenizer(List<String> tokenizersOfTarget, List<String> tokenizerOfMatching) {
        List<String> tokenizerOfMatchingLower = tokenizerOfMatching.stream().map(t -> t.toLowerCase()).collect(Collectors.toList());
        List<String> result = new ArrayList<>();
        tokenizersOfTarget.stream().forEach(t -> {
            if (!PUNCTUATION.contains(t.toLowerCase().trim()) && tokenizerOfMatchingLower.contains(t.toLowerCase())) {
                result.add(t);
            }
        });
        return result.stream().collect(Collectors.toList());
    }

    private List<IndexDTO> getPlagiarismTest(String target, String matching, List<String> tokenizerTargets, List<String> tokenizerMatching) {
        List<IndexDTO> indexList = new ArrayList<>();

        String targetLower = target.toLowerCase();
        String matchingLower = matching.toLowerCase();
        List<String> matchingLowers = this.toLower(tokenizerMatching);

        try {
            int flagGlobal = 0;
            for (int k = 0; k < tokenizerTargets.size(); k++) {
                String s = tokenizerTargets.get(k).trim();
                String sLower = s.trim().toLowerCase();
                if (matchingLowers.contains(sLower)) {
                    int startTarget = targetLower.indexOf(sLower, flagGlobal);
                    // TODO: Start loop
                    int positionTarget = -1;
                    int positionMatching = -1;
                    int max = 0;
                    if (startTarget != -1) {
                        if (!isCover(startTarget, indexList, true)) {
                            // TODO: Logic of matching
                            int flagMatching = 0;
                            int startMatching = matchingLower.indexOf(sLower, flagMatching);
                            while (flagMatching < matching.length() && startMatching != -1) {
                                flagMatching = startMatching + sLower.length();
                                CountDTO countDTO = countWordDuplicate(sLower, targetLower.substring(startTarget), matchingLower.substring(startMatching));
                                if (!isCover(startMatching, indexList, false)) {
                                    if (countDTO.getEnd() > max) {
                                        max = countDTO.getEnd();
                                        positionTarget = startTarget;
                                        positionMatching = startMatching;
                                        int length = countDTO.getEnd();
                                        flagMatching = startMatching + length - sLower.length(); // Trừ cho độ dài chữ đã cộng ở trê
                                    }
                                }
                                startMatching = matchingLower.indexOf(sLower, flagMatching);
                            }
                            // End loop matching
                        }
                    }
                    if (positionTarget != -1 && positionMatching != -1 && max > 0) {
                        updateIndex(indexList, positionTarget, positionMatching, max);
                    }
                }
                flagGlobal += s.length();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return indexList;
    }

    private void updateIndex(List<IndexDTO> indexDTOS, int target, int matching, int length) {
        for (int i = 0; i < indexDTOS.size(); i++) {
            IndexDTO dto = indexDTOS.get(i);
            if (((target < dto.getStartTarget() && dto.getStartTarget() < target + length) ||
                    matching < dto.getStartMatching() && dto.getStartMatching() < matching + length)
                    && length > dto.getLength()) {
                IndexDTO indexDTO = IndexDTO.builder().startTarget(target)
                        .startMatching(matching)
                        .length(length).build();
                indexDTOS.set(i, indexDTO);
                return;
            }
        }
        indexDTOS.add(IndexDTO.builder().startTarget(target)
                .startMatching(matching)
                .length(length)
                .build());
    }

    private List<String> formatTokenizers(List<String> list) {
        if (list == null || list.size() <= 0) {
            return new ArrayList<>();
        }
        return list.stream().distinct().map(t -> t.trim()).collect(Collectors.toList());
    }

    private List<String> toLower(List<String> list) {
        if (list == null || list.size() <= 0) {
            return new ArrayList<>();
        }
        return list.stream().map(String::toLowerCase).collect(Collectors.toList());
    }

    private boolean isCover(int index, List<IndexDTO> indexDTOS, boolean isTarget) {
        if (indexDTOS == null || indexDTOS.size() <= 0) {
            return false;
        }
        for (IndexDTO indexDTO : indexDTOS) {
            int start = isTarget ? indexDTO.getStartTarget() : indexDTO.getStartMatching();
            if (index >= start && index <= start + indexDTO.getLength()) {
                return true;
            }
        }
        return false;
    }

    private CountDTO countWordDuplicate(String wordFind, String target, String matching) {
        int count = 0;
        int end = 0;
        String[] targets = target.trim().split("\\s+");
        String[] matchings = matching.trim().split("\\s+");
        boolean isFinal = false;
        for (int i = 0; i < targets.length; i++) {
            if (i == 0 && !wordFind.equalsIgnoreCase(targets[i])) {
                break;
            }
            if (i < matchings.length && targets[i].toLowerCase().equalsIgnoreCase(matchings[i])) {
                if (i == targets.length - 1) {
                    isFinal = true;
                    end += targets[i].length();
                } else {
                    end += targets[i].length() + 1;
                }
                count++;
            } else {
                break;
            }
        }
        if (!isFinal) {
            end--;
        }
        return CountDTO.builder().count(count).end(end).build();
    }

    private Map<Integer, Sentences> buildMapSentences(List<Sentences> parts) {
        parts.sort(Comparator.comparing(Sentences::getId));
        Map<Integer, Sentences> map = new HashMap<>();
        int index = 0;
        for (Sentences part : parts) {
            String rawText = part.getRawText();
            String tokenizer = part.getTokenizer();
            String[] texts = rawText.split(DIVISION);
            String[] tokenizers = tokenizer.split(DIVISION);
            for (int i = 0; i < texts.length; i++) {
                Sentences sentences = new Sentences();
                sentences.setRawText(texts[i]);
                sentences.setTokenizer(tokenizers[i]);
                sentences.setDocumentApp(part.getDocumentApp());
                map.put(index, sentences);
                index++;
            }
        }
        return map;
    }

    private void updatePlagiarism(String[] targets, Long documentMatchingId, Map<Long, List<Sentences>> allSentences,
                                  Map<Integer, List<String>> tokenizerOfTarget, PlagiarismDocumentDTO plagiarismDocumentDTO) {

        // TODO: Handle constant rate
        float constantRateDoc = Constants.CONSTANT_RATE_DOCUMENT;
        float constantRateSen = Constants.CONSTANT_RATE_SENTENCES;
        List<RateApp> rateApps = rateService.findAll();
        Optional<RateApp> rateDocumentOptional = rateApps.stream().filter(t->t.getType() == RateType.DOCUMENT).findFirst();
        Optional<RateApp> rateSentenceOptional = rateApps.stream().filter(t->t.getType() == RateType.SENTENCE).findFirst();
        if (rateDocumentOptional.isPresent()) {
            constantRateDoc = Float.parseFloat(rateDocumentOptional.get().getRate().toString()) ;
        }
        if (rateSentenceOptional.isPresent()) {
            constantRateSen = Float.parseFloat(rateSentenceOptional.get().getRate().toString()) ;
        }

        // TODO: Get all sentences of document
        Map<Integer, Sentences> mapSentences = buildMapSentences(allSentences.get(documentMatchingId));

        // TODO: Loop all target to check with sentences of this document
        List<PlagiarismSentencesDTO> plagiarismSentences = new ArrayList<>();
        float totalRateMatchingCondition = 0;

        for (int i = 0; i < targets.length; i++) {
            String target = targets[i];
            // TODO: Get tokenizer of target (Key of tokenizerOfTarget equal i)
            List<String> tokenizers = tokenizerOfTarget.get(i);
            float sentenceHighestRate = 0;

            PlagiarismSentencesDTO plagiarismSentencesDTO = new PlagiarismSentencesDTO();

            // TODO: Loop all sentences of document to check plagiarism
            for (Integer position : mapSentences.keySet()) {
                Sentences sentences = mapSentences.get(position);

                // TODO: Calculate percent plagiarism
                float percent = Algorithm.runAlgorithm(target, sentences.getRawText());

                // TODO: Check with constant number
                plagiarismSentencesDTO.setTarget(target);
                if (percent > sentenceHighestRate && percent > constantRateSen) {
                    sentenceHighestRate = percent;
                    if (percent == 100) {
                        plagiarismSentencesDTO.setTarget(target);
                        plagiarismSentencesDTO.setMatching(sentences.getRawText());
                        plagiarismSentencesDTO.setRate(percent);
                        plagiarismSentencesDTO.setTokenizerPlagiarism(null);
                        break;
                    }

                    // TODO : Convert to list tokenizer from sentences in database
                    List<String> tokenizerOfMatching = this.getTokenizerFromSentences(sentences);

                    // TODO: Store data plagiarism of sentences
                    plagiarismSentencesDTO.setMatching(sentences.getRawText());
                    plagiarismSentencesDTO.setRate(percent);

                    // TODO: Get part plagiarism
                    List<IndexDTO> indexDTOS = this.getPlagiarismTest(target, sentences.getRawText(), tokenizers, tokenizerOfMatching);
                    plagiarismSentencesDTO.setTokenizerPlagiarism(indexDTOS);
                }
            }

            // TODO: Store sentence have highest rate
            plagiarismSentences.add(plagiarismSentencesDTO);

            // TODO: Store data of target sentences have highest rate
            totalRateMatchingCondition += sentenceHighestRate;
        }
        // TODO: Calculate plagiarism of document
        int totalSentences = targets.length;
        float rateOfDocument = totalRateMatchingCondition / totalSentences;
        //rateOfDocument > 70 &&
        if (rateOfDocument > constantRateDoc && rateOfDocument > plagiarismDocumentDTO.getRate()) {
            // TODO: Build data store plagiarism info of document
            plagiarismDocumentDTO.setDocumentId(documentMatchingId);
            plagiarismDocumentDTO.setRate(rateOfDocument);
            plagiarismDocumentDTO.setPlagiarism(plagiarismSentences);
        }
    }

    private boolean existPlagiarism(PlagiarismDocumentDTO plagiarismDocumentDTO) {
        float constantRateDoc = Constants.CONSTANT_RATE_DOCUMENT;
        RateApp rateApp = rateService.findByType(RateType.DOCUMENT.toString());
        if (rateApp != null) {
            constantRateDoc = Float.parseFloat(rateApp.getRate().toString()) ;
        }
        return plagiarismDocumentDTO != null && plagiarismDocumentDTO.getDocumentId() != null
                && plagiarismDocumentDTO.getRate() > constantRateDoc
                && plagiarismDocumentDTO.getPlagiarism() != null
                && plagiarismDocumentDTO.getPlagiarism().size() > 0;
    }

    private Byte[] toBytesArray(byte[] bytesPrim) {
        Byte[] bytes = new Byte[bytesPrim.length];
        Arrays.setAll(bytes, n -> bytesPrim[n]);
        return bytes;
    }

    private void printResultTest(PlagiarismDocumentDTO dto) {
        if (dto != null && dto.getPlagiarism() != null) {
            List<PlagiarismSentencesDTO> sentencesDTOS = dto.getPlagiarism();
            System.out.println("================================================================================");
            System.out.println("Rate of document: " + dto.getRate());
            System.out.println("================================================================================");
            for (int i = 0; i < sentencesDTOS.size(); i++) {
                String target = sentencesDTOS.get(i).getTarget();
                String matching = sentencesDTOS.get(i).getMatching();
                System.out.println("Target: " + target);
                System.out.println("Matching: " + matching);
                System.out.println("Rate: " + sentencesDTOS.get(i).getRate());
                if (!CollectionUtils.isEmpty(sentencesDTOS.get(i).getTokenizerPlagiarism())) {
                    for (IndexDTO indexDTO : sentencesDTOS.get(i).getTokenizerPlagiarism()) {
                        System.out.println("Target plagiarism: "
                                + target.substring(indexDTO.getStartTarget(), indexDTO.getStartTarget() + indexDTO.getLength()) + "|");
                        System.out.println("Matching plagiarism: "
                                + target.substring(indexDTO.getStartTarget(), indexDTO.getStartTarget() + indexDTO.getLength()) + "|");
                    }
                }
                System.out.println("-----------------------------------------------------------------------------");
            }
        }
    }

    private List<IndexDTO> getPlagiarism(String target, String matching, List<String> tokenizerTargets, List<String> tokenizerMatching) {
        List<IndexDTO> indexList = new ArrayList<>();

        String targetLower = target.toLowerCase();
        String matchingLower = matching.toLowerCase();
        List<String> matchingLowers = this.toLower(tokenizerMatching);

        try {
            int flagGlobal = 0;
            for (int k = 0; k < tokenizerTargets.size(); k++) {
                String s = tokenizerTargets.get(k).trim();
                String sLower = s.trim().toLowerCase();
                if (matchingLowers.contains(sLower)) {
                    int startTarget = targetLower.indexOf(sLower, flagGlobal);
                    // TODO: Start loop
                    int flagTarget = 0;
                    int positionTarget = -1;
                    int positionMatching = -1;
                    int max = 0;
                    while (flagTarget < target.length() && startTarget != -1) {
                        flagTarget = startTarget + s.length();
                        if (!isCover(startTarget, indexList, true)) {
                            // TODO: Logic of matching
                            int flagMatching = 0;
                            int startMatching = matchingLower.indexOf(sLower, flagMatching);

                            while (flagMatching < matching.length() && startMatching != -1) {
                                flagMatching = startMatching + sLower.length();
                                CountDTO countDTO = countWordDuplicate(sLower, targetLower.substring(startTarget), matchingLower.substring(startMatching));
                                if (!isCover(startMatching, indexList, false)) {
                                    if (countDTO.getEnd() > max) {
                                        max = countDTO.getEnd();
                                        positionTarget = startTarget;
                                        positionMatching = startMatching;
                                        int length = countDTO.getEnd();
                                        flagMatching = startMatching + length; // Trừ cho độ dài chữ đã cộng ở trê
                                        flagTarget = startTarget + length;
                                    }
                                }
                                startMatching = matchingLower.indexOf(sLower, flagMatching);
                            }
                            // End loop matching
                        }
                        startTarget = targetLower.indexOf(sLower, flagTarget);
                    }
                    if (positionTarget != -1 && positionMatching != -1 && max > 0) {
                        updateIndex(indexList, positionTarget, positionMatching, max);
                    }
                }
                flagGlobal += s.length();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return indexList;
    }
}
