package com.jobportal.controller;

import com.jobportal.dto.JobDto;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    @GetMapping
    public ResponseEntity<List<JobDto>> getAllOpenJobs() {
        List<JobDto> jobs = jobRepository.findByStatus("OPEN").stream()
                .map(j -> new JobDto(j.getId(), j.getTitle(), j.getDescription(), j.getStatus(), j.getEmployer().getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<JobDto>> getEmployerJobs(Authentication authentication) {
        User employer = (User) authentication.getPrincipal();
        List<JobDto> jobs = jobRepository.findByEmployer(employer).stream()
                .map(j -> new JobDto(j.getId(), j.getTitle(), j.getDescription(), j.getStatus(), employer.getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(jobs);
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<?> postJob(@RequestBody JobDto jobDto, Authentication authentication) {
        User employer = (User) authentication.getPrincipal();
        Job job = new Job();
        job.setTitle(jobDto.getTitle());
        job.setDescription(jobDto.getDescription());
        job.setStatus("OPEN");
        job.setEmployer(employer);
        
        jobRepository.save(job);
        return ResponseEntity.ok("Job posted successfully!");
    }

    @PutMapping("/{jobId}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<?> updateJobStatus(@PathVariable Long jobId, @RequestParam String status, Authentication authentication) {
        User employer = (User) authentication.getPrincipal();
        Job job = jobRepository.findById(jobId).orElse(null);
        if (job == null) {
            return ResponseEntity.badRequest().body("Job not found");
        }
        if (!job.getEmployer().getId().equals(employer.getId())) {
            return ResponseEntity.status(403).body("Not authorized to modify this job");
        }
        job.setStatus(status);
        jobRepository.save(job);
        return ResponseEntity.ok("Job status updated successfully");
    }
}
