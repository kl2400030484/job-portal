package com.jobportal.controller;

import com.jobportal.dto.DashboardStatsDto;
import com.jobportal.entity.Role;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        long candidates = userRepository.countByRole(Role.CANDIDATE);
        long employers = userRepository.countByRole(Role.EMPLOYER);
        long jobs = jobRepository.count();
        long applications = applicationRepository.count();

        return ResponseEntity.ok(new DashboardStatsDto(candidates, employers, jobs, applications));
    }
}
