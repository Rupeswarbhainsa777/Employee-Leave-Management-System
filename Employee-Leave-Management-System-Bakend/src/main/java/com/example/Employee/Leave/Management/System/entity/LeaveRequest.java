package com.example.Employee.Leave.Management.System.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String employeeName;
    private String leaveType; // VACATION, SICK, PERSONAL, EMERGENCY

    private LocalDate startDate;
    private LocalDate endDate;

    private String reason;

    private String status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @PrePersist
    public void setDefaultStatus() {
        if (status == null) {
            status = "PENDING";
        }
    }
}