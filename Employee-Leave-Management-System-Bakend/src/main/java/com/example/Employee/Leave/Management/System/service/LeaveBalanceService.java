package com.example.Employee.Leave.Management.System.service;

import com.example.Employee.Leave.Management.System.entity.LeaveBalance;
import com.example.Employee.Leave.Management.System.entity.User;
import com.example.Employee.Leave.Management.System.repository.LeaveBalanceRepository;
import com.example.Employee.Leave.Management.System.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Year;

@Service
@RequiredArgsConstructor
public class LeaveBalanceService {

    @Autowired
    private final LeaveBalanceRepository leaveBalanceRepository;
    @Autowired
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

        if (leaveType.equalsIgnoreCase("VACATION")) {

            balance.setVacationUsed(balance.getVacationUsed() + days);

        } else if (leaveType.equalsIgnoreCase("SICK")) {

            balance.setSickUsed(balance.getSickUsed() + days);

        } else if (leaveType.equalsIgnoreCase("PERSONAL")) {

            balance.setPersonalUsed(balance.getPersonalUsed() + days);

        } else if (leaveType.equalsIgnoreCase("EMERGENCY")) {

            balance.setEmergencyUsed(balance.getEmergencyUsed() + days);

        } else {

            throw new RuntimeException("Invalid Leave Type");
        }

        leaveBalanceRepository.save(balance);
    }
}