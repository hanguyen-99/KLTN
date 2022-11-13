package com.document.manager.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.document.manager.service.CloudinaryService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryServiceImpl() {
        cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "ddxkbr7ma",
                "api_key", "487599539392341",
                "api_secret", "gG7QJ3U6SLUtXaTKqHgrB5J5n1U",
                "secure", true));
    }

    @Override
    public String upload(MultipartFile file, String folderName) {
        try {
            Map map = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", folderName));
            if (map != null && map.get("public_id") != null && map.get("format") != null) {
                return map.get("public_id").toString() + "." + map.get("format");
            }
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
        return "";
    }

    @Override
    public void delete(String public_id, String folderName) {
        try {
            cloudinary.uploader().destroy(public_id, ObjectUtils.asMap("folder", folderName));
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}
