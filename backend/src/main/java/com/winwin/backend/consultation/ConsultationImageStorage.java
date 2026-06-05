package com.winwin.backend.consultation;

import org.springframework.web.multipart.MultipartFile;

public interface ConsultationImageStorage {

  String store(MultipartFile file);
}
