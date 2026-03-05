package com.example.Employee.Leave.Management.System.service;

import com.example.Employee.Leave.Management.System.entity.LeaveBalance;
import com.example.Employee.Leave.Management.System.entity.User;
import com.example.Employee.Leave.Management.System.repository.LeaveBalanceRepository;
import com.example.Employee.Leave.Management.System.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Year;

@Service
@RequiredArgsConstructor
public class LeaveBalanceService {

    private final LeaveBalanceRepository leaveBalanceRepository;
    private final UserRepository userRepository;

    public LeaveBalance getLeaveBalance(Long userId, int year) {

        return leaveBalanceRepository.findByUserIdAndYear(userId, year)
                .orElseGet(() -> createDefaultBalance(userId, year));
    }

    public LeaveBalance createDefaultBalance(Long userId, int year) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LeaveBalance balance = LeaveBalance.builder()
                .user(user)
                .year(year)
                .vacationTotal(20)
                .vacationUsed(0)
                .sickTotal(10)
                .sickUsed(0)
                .personalTotal(5)
                .personalUsed(0)
                .emergencyTotal(3)
                .emergencyUsed(0)
                .build();

        return leaveBalanceRepository.save(balance);
    }

    public void updateUsedLeave(Long userId, String leaveType, int days) {

        int currentYear = Year.now().getValue();
        LeaveBalance balance = getLeaveBalance(userId, currentYear);

        switch (leaveType.toUpperCase()) {

            case "VACATION":
                balance.setVacationUsed(balance.getVacationUsed() + days);
                break;

            case "SICK":
                balance.setSickUsed(balance.getSickUsed() + days);
                break;

            case "PERSONAL":
                balance.setPersonalUsed(balance.getPersonalUsed() + days);
                break;

            case "EMERGENCY":
                balance.setEmergencyUsed(balance.getEmergencyUsed() + days);
                break;

            default:
                throw new RuntimeException("Invalid Leave Type");
        }

        leaveBalanceRepository.save(balance);
    }
}