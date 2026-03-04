package com.example.Employee.Leave.Management.System.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "leave_balances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false, unique = true)
    private User employee;

    @Column(nullable = false)
    private double vacationBalance = 15.0;

    @Column(nullable = false)
    private double sickLeaveBalance = 10.0;

    @Column(nullable = false)
    private double casualLeaveBalance = 8.0;

    @Column(nullable = false)
    private double maternityLeaveBalance = 90.0;

    @Column(nullable = false)
    private double paternityLeaveBalance = 15.0;

    @Column(nullable = false)
    private double compensatoryLeaveBalance = 0.0;

    @Column(nullable = false)
    private int year;

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}