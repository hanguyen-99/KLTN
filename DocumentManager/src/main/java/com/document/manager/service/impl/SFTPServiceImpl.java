package com.document.manager.service.impl;

import com.document.manager.domain.DocumentApp;
import com.document.manager.service.SFTPService;
import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class SFTPServiceImpl implements SFTPService {

    private static final String SFTP_HOST = "103.125.170.20";
    private static final int SFTP_PORT = 10041;
    private static final int TIME_OUT = 60000;
    private static final int BUFFER_SIZE = 1024 * 1024 * 1;
    private static final String SFTP_USERNAME = "root";
    private static final String SFTP_PASSWORD = "mI8U6Ci0";


    @Override
    public byte[] getFileFromSFTP(String path) {
        if (StringUtils.isEmpty(path)) {
            log.info("Path not allow empty");
            throw new IllegalArgumentException("Path not allow empty");
        }
        try {
            JSch jsch = new JSch();
            Session session = jsch.getSession(SFTP_USERNAME, SFTP_HOST, SFTP_PORT);
            session.setConfig("StrictHostKeyChecking", "no");
            session.setPassword(SFTP_PASSWORD);
            session.connect();
            if (session == null) {
                throw new RuntimeException("Can't create session sftp...");
            }
            Channel channel = session.openChannel("sftp");
            if (channel == null) {
                throw new RuntimeException("Can't create channel sftp...");
            }
            channel.connect();
            ChannelSftp channelSftp = (ChannelSftp) channel;
            if (channelSftp == null) {
                throw new RuntimeException("Can't connect channel sftp...");
            }
            InputStream inputStream = channelSftp.get(path);
            byte[] bytes = IOUtils.toByteArray(inputStream);
            closeConnect(session, channelSftp);
            return bytes;
        } catch (Exception e) {
            log.info("getFileFromSFTP failed because: {}", e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public Map<Long, byte[]> getDocumentsFromSFTP(List<DocumentApp> documentApps) {
        if (!CollectionUtils.isEmpty(documentApps)) {
            Map<Long, byte[]> map = new HashMap<>();
            try {
                JSch jsch = new JSch();
                Session session = jsch.getSession(SFTP_USERNAME, SFTP_HOST, SFTP_PORT);
                session.setConfig("StrictHostKeyChecking", "no");
                session.setPassword(SFTP_PASSWORD);
                session.connect();
                if (session == null) {
                    throw new RuntimeException("Can't create session sftp...");
                }
                Channel channel = session.openChannel("sftp");
                if (channel == null) {
                    throw new RuntimeException("Can't create channel sftp...");
                }
                channel.connect();
                ChannelSftp channelSftp = (ChannelSftp) channel;
                if (channelSftp == null) {
                    throw new RuntimeException("Can't connect channel sftp...");
                }
                for (DocumentApp document : documentApps) {
                    InputStream inputStream = channelSftp.get(document.getLink());
                    byte[] bytes = IOUtils.toByteArray(inputStream);
                    if (bytes != null && bytes.length > 0) {
                        map.put(document.getId(), bytes);
                    }
                }
                this.closeConnect(session, channelSftp);
                return map;
            } catch (Exception e) {
                log.info("getDocumentsFromSFTP failed because: {}", e.getMessage());
                throw new RuntimeException(e.getMessage());
            }
        }
        return new HashMap<>();
    }

    @Override
    public String uploadFileToSFTP(String path, MultipartFile file) {
        if (StringUtils.isEmpty(path)) {
            throw new IllegalArgumentException("Path not allow empty");
        }
        if (file == null) {
            throw new IllegalArgumentException("File upload to SFTP not allow empty");
        }
        try {
            JSch jsch = new JSch();
            Session session = jsch.getSession(SFTP_USERNAME, SFTP_HOST, SFTP_PORT);
            session.setConfig("StrictHostKeyChecking", "no");
            session.setPassword(SFTP_PASSWORD);
            session.connect();

            Channel channel = session.openChannel("sftp");
            channel.connect();
            ChannelSftp channelSftp = (ChannelSftp) channel;
            channelSftp.cd(path);
            String name = new Date().getTime() + "-" + file.getOriginalFilename();
            channelSftp.put(file.getInputStream(), name);
            this.closeConnect(session, channelSftp);
            return path + "/" + name;
        } catch (Exception e) {
            log.info("uploadFileToSFTP failed because: {}", e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void deleteFile(String path) {
        if (StringUtils.isEmpty(path)) {
            throw new IllegalArgumentException("Path not allow empty");
        }
        try {
            JSch jsch = new JSch();
            Session session = jsch.getSession(SFTP_USERNAME, SFTP_HOST, SFTP_PORT);
            session.setConfig("StrictHostKeyChecking", "no");
            session.setPassword(SFTP_PASSWORD);
            session.connect();

            Channel channel = session.openChannel("sftp");
            channel.connect();
            ChannelSftp channelSftp = (ChannelSftp) channel;
            channelSftp.rm(path);
            this.closeConnect(session, channelSftp);
        } catch (Exception e) {
            log.info("deleteFile failed because: {}", e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    private void closeConnect(Session session, ChannelSftp channelSftp) {
        channelSftp.exit();
        session.disconnect();
    }
}
