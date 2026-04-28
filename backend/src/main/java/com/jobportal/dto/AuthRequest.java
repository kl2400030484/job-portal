package com.jobportal.dto;

public class AuthRequest {
    private String email;
    private String password;
    private String captchaId;
    private String captchaInput;

    public AuthRequest() {}
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getCaptchaId() { return captchaId; }
    public void setCaptchaId(String captchaId) { this.captchaId = captchaId; }
    public String getCaptchaInput() { return captchaInput; }
    public void setCaptchaInput(String captchaInput) { this.captchaInput = captchaInput; }
}
