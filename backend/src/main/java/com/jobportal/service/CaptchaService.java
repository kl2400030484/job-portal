package com.jobportal.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CaptchaService {

    // Store CAPTCHA details: captchaId -> CaptchaData
    private final Map<String, CaptchaData> captchaCache = new ConcurrentHashMap<>();

    private static final int CAPTCHA_WIDTH = 150;
    private static final int CAPTCHA_HEIGHT = 50;
    private static final int CAPTCHA_LENGTH = 6;
    private static final int EXPIRY_MINUTES = 3;

    private static class CaptchaData {
        String text;
        LocalDateTime expiryTime;

        CaptchaData(String text, LocalDateTime expiryTime) {
            this.text = text;
            this.expiryTime = expiryTime;
        }
    }

    public CaptchaResponse generateCaptcha() {
        String captchaText = generateRandomString();
        String base64Image = generateCaptchaImage(captchaText);

        String captchaId = UUID.randomUUID().toString();
        captchaCache.put(captchaId, new CaptchaData(captchaText, LocalDateTime.now().plusMinutes(EXPIRY_MINUTES)));

        return new CaptchaResponse(captchaId, base64Image);
    }

    public boolean validateCaptcha(String captchaId, String userInput) {
        if (captchaId == null || userInput == null || captchaId.isEmpty() || userInput.isEmpty()) {
            return false;
        }

        CaptchaData data = captchaCache.remove(captchaId); // Remove verifies it strictly once (single-use)

        if (data == null) {
            return false; // Invalid or already used
        }

        if (data.expiryTime.isBefore(LocalDateTime.now())) {
            return false; // Expired
        }

        return data.text.equalsIgnoreCase(userInput.trim());
    }

    @Scheduled(fixedRate = 60000) // Run every 60 seconds
    public void cleanupExpiredCaptchas() {
        LocalDateTime now = LocalDateTime.now();
        captchaCache.entrySet().removeIf(entry -> entry.getValue().expiryTime.isBefore(now));
    }

    private String generateRandomString() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"; // Removed similar looking characters like 1, l, I, O, 0
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < CAPTCHA_LENGTH; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private String generateCaptchaImage(String text) {
        BufferedImage image = new BufferedImage(CAPTCHA_WIDTH, CAPTCHA_HEIGHT, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = image.createGraphics();

        // Background
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, CAPTCHA_WIDTH, CAPTCHA_HEIGHT);

        // Draw text
        Font font = new Font("Arial", Font.BOLD, 30);
        g2d.setFont(font);
        
        Random random = new Random();
        for (int i = 0; i < text.length(); i++) {
            // Apply slight random color
            g2d.setColor(new Color(random.nextInt(150), random.nextInt(150), random.nextInt(150)));
            // Add slight distortion (rotation/position)
            int yPos = 30 + random.nextInt(10) - 5;
            g2d.drawString(String.valueOf(text.charAt(i)), 20 * i + 15, yPos);
        }

        // Add noise lines
        g2d.setColor(Color.LIGHT_GRAY);
        for (int i = 0; i < 6; i++) {
            int x1 = random.nextInt(CAPTCHA_WIDTH);
            int y1 = random.nextInt(CAPTCHA_HEIGHT);
            int x2 = random.nextInt(CAPTCHA_WIDTH);
            int y2 = random.nextInt(CAPTCHA_HEIGHT);
            g2d.drawLine(x1, y1, x2, y2);
        }

        // Add noise dots
        for (int i = 0; i < 50; i++) {
            int x = random.nextInt(CAPTCHA_WIDTH);
            int y = random.nextInt(CAPTCHA_HEIGHT);
            image.setRGB(x, y, Color.GRAY.getRGB());
        }

        g2d.dispose();

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            ImageIO.write(image, "png", baos);
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(baos.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Error rendering CAPTCHA image", e);
        }
    }

    public static class CaptchaResponse {
        private String captchaId;
        private String captchaImage;

        public CaptchaResponse(String captchaId, String captchaImage) {
            this.captchaId = captchaId;
            this.captchaImage = captchaImage;
        }

        public String getCaptchaId() { return captchaId; }
        public String getCaptchaImage() { return captchaImage; }
    }
}
