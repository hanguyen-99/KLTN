package com.document.manager.service;

import java.io.File;
import java.io.IOException;

public interface FileService {

    String saveFile(String dir, String fileName, byte[] bytes) throws IOException;

    String readContentDocument(File file) throws IOException;
}
