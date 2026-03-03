package com.example.Employee.Leave.Management.System.controller;

import com.example.Employee.Leave.Management.System.entity.User;
import com.example.Employee.Leave.Management.System.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("reg")
    public User adduser(@RequestBody User user){

        return userService.registerUser(user);
    }
}
