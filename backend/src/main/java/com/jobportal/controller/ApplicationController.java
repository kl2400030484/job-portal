package com.jobportal.controller;

import com.jobportal.dto.ApplicationDto;
import com.jobportal.entity.Application;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @PostMapping("/{jobId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<?> applyToJob(@PathVariable Long jobId, Authentication authentication) {
        User candidate = (User) authentication.getPrincipal();
        Optional<Job> jobOpt = jobRepository.findById(jobId);
        
        if (jobOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Job not found");
        }
        Job job = jobOpt.get();

        if (!"OPEN".equals(job.getStatus())) {
            return ResponseEntity.badRequest().body("Job is no longer open for applications");
        }

        if (applicationRepository.existsByJobAndCandidate(job, candidate)) {
            return ResponseEntity.badRequest().body("Already applied to this job");
        }

        Application app = new Application();
        app.setJob(job);
        app.setCandidate(candidate);
        app.setStatus("APPLIED");

        applicationRepository.save(app);
        return ResponseEntity.ok("Successfully applied to job");
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<?> getCandidateApplications(Authentication authentication) {
        User candidate = (User) authentication.getPrincipal();
        List<ApplicationDto> apps = applicationRepository.findByCandidate(candidate).stream()
                .map(a -> new ApplicationDto(a.getId(), a.getJob().getId(), a.getJob().getTitle(), 
                        a.getCandidate().getName(), a.getCandidate().getEmail(), a.getStatus(),
                        a.getCandidate().getGender(), a.getCandidate().getPosition(),
                        a.getCandidate().getYearsOfExperience(), a.getCandidate().getProfileFileUrl()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(apps);
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<?> getApplicationsForJob(@PathVariable Long jobId, Authentication authentication) {
        User employer = (User) authentication.getPrincipal();
        Optional<Job> jobOpt = jobRepository.findById(jobId);

        if (jobOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Job not found");
        }
        Job job = jobOpt.get();

        if (!job.getEmployer().getId().equals(employer.getId())) {
            return ResponseEntity.status(403).body("Not authorized to view these applications");
        }

        List<ApplicationDto> apps = applicationRepository.findByJob(job).stream()
                .map(a -> new ApplicationDto(a.getId(), a.getJob().getId(), a.getJob().getTitle(), 
                        a.getCandidate().getName(), a.getCandidate().getEmail(), a.getStatus(),
                        a.getCandidate().getGender(), a.getCandidate().getPosition(),
                        a.getCandidate().getYearsOfExperience(), a.getCandidate().getProfileFileUrl()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(apps);
    }

    @PutMapping("/{applicationId}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long applicationId, @RequestParam String status, Authentication authentication) {
        User employer = (User) authentication.getPrincipal();
        Optional<Application> appOpt = applicationRepository.findById(applicationId);
        
        if (appOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Application not found");
        }
        
        Application app = appOpt.get();
        if (!app.getJob().getEmployer().getId().equals(employer.getId())) {
            return ResponseEntity.status(403).body("Not authorized to modify this application");
        }
        
        app.setStatus(status);
        applicationRepository.save(app);
        return ResponseEntity.ok("Application status updated successfully");
    }

    @GetMapping("/hired")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<?> getHiredCandidates(Authentication authentication) {
        User employer = (User) authentication.getPrincipal();
        List<ApplicationDto> hiredApps = applicationRepository.findByJobEmployerAndStatus(employer, "HIRED").stream()
                .map(a -> new ApplicationDto(a.getId(), a.getJob().getId(), a.getJob().getTitle(),
                        a.getCandidate().getName(), a.getCandidate().getEmail(), a.getStatus(),
                        a.getCandidate().getGender(), a.getCandidate().getPosition(),
                        a.getCandidate().getYearsOfExperience(), a.getCandidate().getProfileFileUrl()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(hiredApps);
    }

    @GetMapping("/employer/applied")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<?> getAppliedCandidates(Authentication authentication) {
        User employer = (User) authentication.getPrincipal();
        List<ApplicationDto> appliedApps = applicationRepository.findByJobEmployerAndStatus(employer, "APPLIED").stream()
                .map(a -> new ApplicationDto(a.getId(), a.getJob().getId(), a.getJob().getTitle(),
                        a.getCandidate().getName(), a.getCandidate().getEmail(), a.getStatus(),
                        a.getCandidate().getGender(), a.getCandidate().getPosition(),
                        a.getCandidate().getYearsOfExperience(), a.getCandidate().getProfileFileUrl()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(appliedApps);
    }
}
