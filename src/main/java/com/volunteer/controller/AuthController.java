package com.volunteer.controller;

import com.volunteer.pojo.User;
import com.volunteer.service.DashboardService;
import com.volunteer.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    private DashboardService dashboardService;
    @Autowired
    private void setDashboardService(DashboardService dashboardService){
        this.dashboardService=dashboardService;
    }
    @GetMapping("/login")
    public String loginPage() {
        return "auth/login";
    }

    // 注册页
    @GetMapping("/register")
    public String registerPage(HttpSession session) {
        session.setAttribute("token", 1);
        return "auth/register";
    }

    // 登录处理
    @PostMapping("/login")
    public String login(@RequestParam String stuNo, @RequestParam String password, HttpSession session) {
        if(userService.isPasswordMatchById(stuNo, password)) {
            User user=userService.getUserByStuNoAndPwd(stuNo,password);
            if(user!=null){
                session.setAttribute("user", user);
                if(dashboardService.isAdmin(user.getRole()))
                {
                    session.setAttribute("adminName",user.getName());
                    return "admin/dashboard";

                }
                return "activity/hall";
            }
        }
        session.setAttribute("msg", "账号或密码错误");
        return "redirect:/login";

    }

    // 注册处理
    @PostMapping("/register")
    public String register(@RequestParam String stuNo, @RequestParam String name,
                            @RequestParam String password, @RequestParam String gender,@RequestParam String phone,@RequestParam String email,  HttpSession session) {
        boolean success = userService.canRegister(stuNo);
        if (success) {
            userService.registerNewUser(stuNo,name,password,gender,phone,email);
            return "redirect:/login";
        }
        session.setAttribute("msg", "注册失败");
       return "redirect:/register";
    }

    // 注销
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}
