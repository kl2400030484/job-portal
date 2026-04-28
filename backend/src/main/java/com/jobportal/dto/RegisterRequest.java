package com.jobportal.dto;

import com.jobportal.entity.Role;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role; // ONLY CANDIDATE or EMPLOYER allowed in logic
    private String captchaId;
    private String captchaInput;

    public RegisterRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getCaptchaId() { return captchaId; }
    public void setCaptchaId(String captchaId) { this.captchaId = captchaId; }
    public String getCaptchaInput() { return captchaInput; }
    public void setCaptchaInput(String captchaInput) { this.captchaInput = captchaInput; }
}
