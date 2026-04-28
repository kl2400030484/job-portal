package com.jobportal.dto;

public class ApplicationDto {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String candidateName;
    private String candidateEmail;
    private String status;
    private String candidateGender;
    private String candidatePosition;
    private Integer candidateYearsOfExperience;
    private String candidateProfileFileUrl;

    public ApplicationDto() {}

    public ApplicationDto(Long id, Long jobId, String jobTitle, String candidateName, String candidateEmail, String status,
                          String candidateGender, String candidatePosition, Integer candidateYearsOfExperience, String candidateProfileFileUrl) {
        this.id = id;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.status = status;
        this.candidateGender = candidateGender;
        this.candidatePosition = candidatePosition;
        this.candidateYearsOfExperience = candidateYearsOfExperience;
        this.candidateProfileFileUrl = candidateProfileFileUrl;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }
    public String getCandidateEmail() { return candidateEmail; }
    public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCandidateGender() { return candidateGender; }
    public void setCandidateGender(String candidateGender) { this.candidateGender = candidateGender; }
    public String getCandidatePosition() { return candidatePosition; }
    public void setCandidatePosition(String candidatePosition) { this.candidatePosition = candidatePosition; }
    public Integer getCandidateYearsOfExperience() { return candidateYearsOfExperience; }
    public void setCandidateYearsOfExperience(Integer candidateYearsOfExperience) { this.candidateYearsOfExperience = candidateYearsOfExperience; }
    public String getCandidateProfileFileUrl() { return candidateProfileFileUrl; }
    public void setCandidateProfileFileUrl(String candidateProfileFileUrl) { this.candidateProfileFileUrl = candidateProfileFileUrl; }
}
