package com.jobportal.repository;

import com.jobportal.entity.OtpToken;
import com.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {
    Optional<OtpToken> findByOtpAndUser(String otp, User user);
    Optional<OtpToken> findByUser(User user);
    void deleteByUser(User user);
}
