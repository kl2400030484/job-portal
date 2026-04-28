package com.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Your Password Reset OTP");
            message.setText("Dear User,\n\nYour One Time Password (OTP) for resetting your account password is: " 
                + otp + "\n\nThis OTP is valid for 5 minutes.\n\nRegard,\nSupport Team");
            
            mailSender.send(message);
        } catch (Exception e) {
            // Handle email failures gracefully
            System.err.println("Failed to send OTP email to " + toEmail + ": " + e.getMessage());
        }
    }
}
