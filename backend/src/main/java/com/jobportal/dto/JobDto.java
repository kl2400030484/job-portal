package com.jobportal.dto;

public class JobDto {
    private Long id;
    private String title;
    private String description;
    private String status;
    private String employerName;

    public JobDto() {}

    public JobDto(Long id, String title, String description, String status, String employerName) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.employerName = employerName;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getEmployerName() { return employerName; }
    public void setEmployerName(String employerName) { this.employerName = employerName; }
}
