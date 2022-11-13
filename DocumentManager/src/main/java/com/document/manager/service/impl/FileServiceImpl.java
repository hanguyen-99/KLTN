package com.document.manager.service.impl;

import com.document.manager.service.FileService;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;


@Service
@Slf4j
public class FileServiceImpl implements FileService {

    @Override
    @Transactional
    public String saveFile(String dir, String fileName, byte[] bytes) throws IOException {
        try {
            Date date = new Date();
            String link = dir + date.getTime() + "_" + fileName;
            Path path = Paths.get(link);
            File file = new File(dir);
            if (!file.exists()) {
                file.mkdirs();
            }
            Path des = Files.write(path, bytes);
            if (des == null) {
                throw new IOException("Save file failed");
            }
            return link;
        } catch (IOException e) {
            log.info("Save file {} to location {} failed", fileName, dir);
            throw new IOException("Save file failed");
        }
    }

    @Override
    public String readContentDocument(File file) throws IOException {
        PDDocument document = null;
        try {
            document = PDDocument.load(file);
            PDFTextStripper pdfStripper = new PDFTextStripper();
            return pdfStripper.getText(document);
        } catch (Exception e) {
            log.error("Read report failed");
            throw new IOException("Read report failed");
        } finally {
            if (document != null) {
                document.close();
            }
        }
    }
}
