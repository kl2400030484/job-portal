package com.jobportal.controller;

import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: User not found");
        }
        
        User user = userOpt.get();
        Map<String, Object> profileData = new HashMap<>();
        profileData.put("name", user.getName());
        profileData.put("email", user.getEmail());
        profileData.put("role", user.getRole());
        profileData.put("gender", user.getGender());
        profileData.put("position", user.getPosition());
        profileData.put("yearsOfExperience", user.getYearsOfExperience());
        profileData.put("profileFileUrl", user.getProfileFileUrl());
        
        return ResponseEntity.ok(profileData);
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> updates, Authentication authentication) {
        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: User not found");
        }
        
        User user = userOpt.get();
        
        if (updates.containsKey("name")) {
            user.setName((String) updates.get("name"));
        }
        if (updates.containsKey("gender")) {
            user.setGender((String) updates.get("gender"));
        }
        if (updates.containsKey("position")) {
            user.setPosition((String) updates.get("position"));
        }
        if (updates.containsKey("yearsOfExperience")) {
            Object yrsExp = updates.get("yearsOfExperience");
            if (yrsExp != null) {
                if (yrsExp instanceof Integer) {
                    user.setYearsOfExperience((Integer) yrsExp);
                } else if (yrsExp instanceof String && !((String) yrsExp).isEmpty()) {
                    user.setYearsOfExperience(Integer.parseInt((String) yrsExp));
                }
            } else {
                user.setYearsOfExperience(null);
            }
        }
        
        userRepository.save(user);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, Authentication authentication) {
        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: User not found");
        }
        
        try {
            String fileName = fileStorageService.storeFile(file);
            String fileUrl = "/files/" + fileName;
            
            User user = userOpt.get();
            user.setProfileFileUrl(fileUrl);
            userRepository.save(user);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "File uploaded successfully");
            response.put("fileUrl", fileUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error uploading file: " + e.getMessage());
        }
    }
}
