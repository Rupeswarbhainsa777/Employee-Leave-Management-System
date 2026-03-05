package com.example.Employee.Leave.Management.System.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "leave_balances",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "year"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int year;


    private int vacationTotal = 20;
    private int vacationUsed = 0;

    private int sickTotal = 10;
    private int sickUsed = 0;

    private int personalTotal = 5;
    private int personalUsed = 0;

    private int emergencyTotal = 5;
    private int emergencyUsed = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}