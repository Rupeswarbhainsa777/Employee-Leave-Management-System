package com.example.Employee.Leave.Management.System.service;

import com.example.Employee.Leave.Management.System.entity.LeaveRequest;
import com.example.Employee.Leave.Management.System.repository.LeaveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveService {

    @Autowired
    private LeaveRepository leaveRepository;

    public LeaveRequest applyLeave(LeaveRequest leave) {
        leave.setStatus("PENDING");
        return leaveRepository.save(leave);
    }

    public LeaveRequest approveLeave(Long id) {
        LeaveRequest leave = leaveRepository.findById(id).orElseThrow();
        leave.setStatus("APPROVED");
        return leaveRepository.save(leave);
    }

    public List<LeaveRequest> getPendingLeaves() {
        return leaveRepository.findByStatus("PENDING");
    }


    public List<LeaveRequest> getAll() {
        return leaveRepository.findAll();
    }
}