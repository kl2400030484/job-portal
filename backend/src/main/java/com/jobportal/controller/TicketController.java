package com.jobportal.controller;

import com.jobportal.dto.TicketDto;
import com.jobportal.entity.SupportTicket;
import com.jobportal.entity.User;
import com.jobportal.repository.SupportTicketRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private SupportTicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('CANDIDATE', 'EMPLOYER')")
    public ResponseEntity<?> raiseTicket(@RequestBody TicketDto ticketDto, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        SupportTicket t = new SupportTicket();
        t.setTitle(ticketDto.getTitle());
        t.setDescription(ticketDto.getDescription());
        t.setRaisedBy(user);
        t.setStatus("OPEN");
        
        ticketRepository.save(t);
        return ResponseEntity.ok("Ticket raised successfully");
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'EMPLOYER')")
    public ResponseEntity<List<TicketDto>> getMyTickets(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<TicketDto> tickets = ticketRepository.findByRaisedBy(user).stream()
                .map(t -> new TicketDto(t.getId(), t.getTitle(), t.getDescription(), t.getRaisedBy().getName(), 
                        t.getAssignedTo() != null ? t.getAssignedTo().getName() : null, t.getStatus()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(tickets);
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPPORT')")
    public ResponseEntity<List<TicketDto>> getAllTickets() {
        List<TicketDto> tickets = ticketRepository.findAll().stream()
                .map(t -> new TicketDto(t.getId(), t.getTitle(), t.getDescription(), t.getRaisedBy().getName(),
                        t.getAssignedTo() != null ? t.getAssignedTo().getName() : null, t.getStatus()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(tickets);
    }

    @PutMapping("/{id}/claim")
    @PreAuthorize("hasRole('SUPPORT')")
    public ResponseEntity<?> claimTicket(@PathVariable Long id, Authentication authentication) {
        User support = (User) authentication.getPrincipal();
        Optional<SupportTicket> tOpt = ticketRepository.findById(id);
        if (tOpt.isEmpty()) return ResponseEntity.badRequest().body("Ticket not found");

        SupportTicket t = tOpt.get();
        t.setAssignedTo(support);
        t.setStatus("CLAIMED");
        ticketRepository.save(t);
        return ResponseEntity.ok("Ticket claimed");
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('SUPPORT')")
    public ResponseEntity<?> resolveTicket(@PathVariable Long id, Authentication authentication) {
        User support = (User) authentication.getPrincipal();
        Optional<SupportTicket> tOpt = ticketRepository.findById(id);
        if (tOpt.isEmpty()) return ResponseEntity.badRequest().body("Ticket not found");

        SupportTicket t = tOpt.get();
        if (t.getAssignedTo() == null || !t.getAssignedTo().getId().equals(support.getId())) {
            return ResponseEntity.badRequest().body("You must claim this ticket first");
        }
        t.setStatus("RESOLVED");
        ticketRepository.save(t);
        return ResponseEntity.ok("Ticket resolved");
    }
}
