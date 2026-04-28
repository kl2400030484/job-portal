package com.jobportal.dto;

public class TicketDto {
    private Long id;
    private String title;
    private String description;
    private String raisedBy;
    private String assignedTo;
    private String status;

    public TicketDto() {}

    public TicketDto(Long id, String title, String description, String raisedBy, String assignedTo, String status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.raisedBy = raisedBy;
        this.assignedTo = assignedTo;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getRaisedBy() { return raisedBy; }
    public void setRaisedBy(String raisedBy) { this.raisedBy = raisedBy; }
    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
