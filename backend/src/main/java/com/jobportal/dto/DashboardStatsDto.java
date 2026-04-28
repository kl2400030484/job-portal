package com.jobportal.dto;

public class DashboardStatsDto {
    private long totalCandidates;
    private long totalEmployers;
    private long totalJobs;
    private long totalApplications;

    public DashboardStatsDto(long totalCandidates, long totalEmployers, long totalJobs, long totalApplications) {
        this.totalCandidates = totalCandidates;
        this.totalEmployers = totalEmployers;
        this.totalJobs = totalJobs;
        this.totalApplications = totalApplications;
    }

    public long getTotalCandidates() { return totalCandidates; }
    public long getTotalEmployers() { return totalEmployers; }
    public long getTotalJobs() { return totalJobs; }
    public long getTotalApplications() { return totalApplications; }
}
