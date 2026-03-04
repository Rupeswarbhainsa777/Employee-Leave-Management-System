package com.example.Employee.Leave.Management.System.controller;



import com.example.Employee.Leave.Management.System.entity.LeaveBalance;
import com.example.Employee.Leave.Management.System.entity.User;
import com.example.Employee.Leave.Management.System.repository.LeaveBalanceRepository;
import com.example.Employee.Leave.Management.System.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

        import java.time.Year;
import java.util.Optional;

@RestController
@RequestMapping("/api/leave-balance")
@CrossOrigin
public class LeaveBalanceController {

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private UserRepository userRepository;


    @GetMapping("/{employeeId}")
    public ResponseEntity<?> getCurrentYearBalance(@PathVariable Long employeeId) {

        int currentYear = Year.now().getValue();

        Optional<LeaveBalance> balance =
                leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, currentYear);

        if (balance.isPresent()) {
            return ResponseEntity.ok(balance.get());
        } else {
            return ResponseEntity.badRequest()
                    .body("Leave balance not found for current year");
        }
    }


    @GetMapping("/{employeeId}/{year}")
    public ResponseEntity<?> getBalanceByYear(@PathVariable Long employeeId,
                                              @PathVariable int year) {

        Optional<LeaveBalance> balance =
                leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, year);

        if (balance.isPresent()) {
            return ResponseEntity.ok(balance.get());
        } else {
            return ResponseEntity.badRequest()
                    .body("Leave balance not found for given year");
        }
    }


    @PostMapping("/create/{employeeId}")
    public ResponseEntity<?> createLeaveBalance(@PathVariable Long employeeId) {

        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LeaveBalance balance = LeaveBalance.builder()
                .employee(employee)
                .year(Year.now().getValue())
                .vacationBalance(15)
                .sickLeaveBalance(10)
                .casualLeaveBalance(8)
                .maternityLeaveBalance(90)
                .paternityLeaveBalance(15)
                .compensatoryLeaveBalance(0)
                .build();

        return ResponseEntity.ok(leaveBalanceRepository.save(balance));
    }


    @PutMapping("/update/{employeeId}/{year}")
    public ResponseEntity<?> updateVacationBalance(
            @PathVariable Long employeeId,
            @PathVariable int year,
            @RequestParam double vacationDays) {

        LeaveBalance balance =
                leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, year)
                        .orElseThrow(() -> new RuntimeException("Leave balance not found"));

        balance.setVacationBalance(vacationDays);

        return ResponseEntity.ok(leaveBalanceRepository.save(balance));
    }
}