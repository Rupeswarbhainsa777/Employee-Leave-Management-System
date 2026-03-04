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

    private int vacationTotal;
    private int vacationUsed;

    private int sickTotal;
    private int sickUsed;

    private int personalTotal;
    private int personalUsed;

    private int emergencyTotal;
    private int emergencyUsed;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}