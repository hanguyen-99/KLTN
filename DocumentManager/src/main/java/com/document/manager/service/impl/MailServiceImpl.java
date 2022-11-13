package com.document.manager.service.impl;

import com.document.manager.dto.MailRequest;
import com.document.manager.dto.MailResponse;
import com.document.manager.service.MailService;
import freemarker.template.Configuration;
import freemarker.template.Template;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import javax.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
@Slf4j
public class MailServiceImpl implements MailService {

    @Autowired
    private JavaMailSender sender;

    @Autowired
    private Configuration configuration;

    @Autowired
    private Environment env;

    public MailResponse sendMail(MailRequest request, String templateName, Map<String, Object> mapData) {
        MailResponse mailResponse = new MailResponse();
        MimeMessage message = sender.createMimeMessage();
        try {
            MimeMessageHelper messageHelper = new MimeMessageHelper(message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());

            Template template = configuration.getTemplate(templateName);
            String html = FreeMarkerTemplateUtils.processTemplateIntoString(template, mapData);

            messageHelper.setTo(request.getTo());
            messageHelper.setText(html, true);
            messageHelper.setSubject(request.getSubject());
            messageHelper.setFrom(request.getFrom());
            sender.send(messageHelper.getMimeMessage());

            log.info("Mail sending to: " + request.getTo());
            mailResponse.setMessage("Mail sending to: " + request.getTo());
            mailResponse.setStatus(Boolean.TRUE);
        } catch (Exception e) {
            log.info("Mail sending failed: " + e.getMessage());
            mailResponse.setMessage("Mail sending failed: " + e.getMessage());
            mailResponse.setStatus(Boolean.FALSE);
        }
        return mailResponse;
    }

    @Override
    public void sendMailRegister(String to, String name, Map<String, Object> mapData) {
        MailRequest mailRequest = new MailRequest(name, to, env.getProperty("spring.mail.username"), "Xác nhận đăng ký tài khoản");
        log.info("Mail to send: {}", env.getProperty("spring.mail.username"));
        log.info("Pass of mail to send: {}", env.getProperty("spring.mail.password"));
        sendMail(mailRequest, "mail-template-register.ftl", mapData);
    }

    @Override
    public void sendMailForgotPassword(String to, String name, Map<String, Object> mapData) {
        MailRequest mailRequest = new MailRequest(name, to, env.getProperty("spring.mail.username"), "Quên mật khẩu");
        sendMail(mailRequest, "mail-template-forgot-password.ftl", mapData);
    }
}
