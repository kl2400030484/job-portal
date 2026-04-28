package com.jobportal.controller;

import com.jobportal.service.CaptchaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/captcha")
public class CaptchaController {

    @Autowired
    private CaptchaService captchaService;

    @GetMapping
    public ResponseEntity<CaptchaService.CaptchaResponse> getCaptcha() {
        return ResponseEntity.ok(captchaService.generateCaptcha());
    }
}
