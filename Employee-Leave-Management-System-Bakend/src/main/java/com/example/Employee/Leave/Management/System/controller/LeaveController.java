package com.example.Employee.Leave.Management.System.controller;

import com.example.Employee.Leave.Management.System.entity.LeaveRequest;
import com.example.Employee.Leave.Management.System.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin
public class LeaveController {

    @Autowired
    private LeaveService leaveService;



    @PostMapping
    public ResponseEntity<?> appLeave(@RequestBody LeaveRequest request){
        return ResponseEntity.ok(leaveService.applyLeave(request));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approve(
            @PathVariable Long id,
            @RequestParam Long managerId) {

        return ResponseEntity.ok(
                leaveService.approveLeave(id, managerId)
        );
    }


    @GetMapping("/pending")
    public ResponseEntity<List<LeaveRequest>> getPending(){
        return ResponseEntity.ok(leaveService.getPendingLeaves());
    }

    @GetMapping("/all")
    public ResponseEntity<List<LeaveRequest>> getAll(){
        return ResponseEntity.ok(leaveService.getAll());
    }

    @GetMapping("/calendar")
    public ResponseEntity<List<LeaveRequest>> getCalendar(
            @RequestParam int year,
            @RequestParam int month) {

        return ResponseEntity.ok(
                leaveService.getMonthlyCalendar(year, month)
        );
    }


}

