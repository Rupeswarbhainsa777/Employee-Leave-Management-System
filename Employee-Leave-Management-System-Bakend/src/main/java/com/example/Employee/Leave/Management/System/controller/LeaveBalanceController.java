package com.example.Employee.Leave.Management.System.controller;

import com.example.Employee.Leave.Management.System.entity.LeaveBalance;
import com.example.Employee.Leave.Management.System.service.LeaveBalanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Year;

@RestController
@RequestMapping("/api/leave-balance")
@RequiredArgsConstructor
@CrossOrigin
public class LeaveBalanceController {

    @Autowired
    private final LeaveBalanceService leaveBalanceService;

    @GetMapping("/{userId}")
    public LeaveBalance getBalance(@PathVariable Long userId) {
        return leaveBalanceService.getLeaveBalance(userId, Year.now().getValue());
    }
}