package com.jobportal.config;

import com.jobportal.entity.Role;
import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DatabaseSeeder {

    @Bean
    public CommandLineRunner seedDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            userRepository.findByEmail("admin@jobportal.com").ifPresentOrElse(user -> {
                user.setPassword(passwordEncoder.encode("Admin@123"));
                user.setRole(Role.ADMIN);
                userRepository.save(user);
                System.out.println("Admin user updated.");
            }, () -> {
                User admin = new User("Admin User", "admin@jobportal.com", passwordEncoder.encode("Admin@123"), Role.ADMIN);
                userRepository.save(admin);
                System.out.println("Admin user seeded.");
            });

            userRepository.findByEmail("support@jobportal.com").ifPresentOrElse(user -> {
                user.setPassword(passwordEncoder.encode("Support@123"));
                user.setRole(Role.SUPPORT);
                userRepository.save(user);
                System.out.println("Support user updated.");
            }, () -> {
                User support = new User("Support User", "support@jobportal.com", passwordEncoder.encode("Support@123"), Role.SUPPORT);
                userRepository.save(support);
                System.out.println("Support user seeded.");
            });

            if (userRepository.findByEmail("employer@jobportal.com").isEmpty()) {
                User employer = new User("Employer User", "employer@jobportal.com", passwordEncoder.encode("Employer@123"), Role.EMPLOYER);
                userRepository.save(employer);
                System.out.println("Employer user seeded.");
            }
        };
    }
}
