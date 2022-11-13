package com.document.manager.service;

import java.io.IOException;
import java.util.Map;

public interface MailService {

    //MailResponse sendMail(MailRequest request, String templateName, Map<String, Object> mapData) throws MessagingException;

    void sendMailRegister(String to, String name, Map<String, Object> mapData) throws IOException;

    void sendMailForgotPassword(String to, String name, Map<String, Object> mapData);

}
