package com.volunteer.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CommonController {

    // 系统首页重定向到活动大厅
    @GetMapping({"/", "/index"})
    public String index() {
        return "redirect:/activity/hall";
    }
}
