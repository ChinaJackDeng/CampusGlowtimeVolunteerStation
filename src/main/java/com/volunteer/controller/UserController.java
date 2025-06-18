package com.volunteer.controller;

import com.volunteer.exception.UnauthorizedException;
import com.volunteer.pojo.User;
import com.volunteer.pojo.VolunteerHourVO;
import com.volunteer.service.VolunteerHoursService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.List;


@Controller
@RequestMapping("/user")
public class UserController {

    private VolunteerHoursService volunteerHoursService;
    @Autowired
    private void setVolunteerHoursService(VolunteerHoursService volunteerHoursService){
        this.volunteerHoursService=volunteerHoursService;
    }

    // 志愿时长
    @GetMapping("/hours")
    public String hoursPage() {
        return "user/hours";
    }

    // 系统指南
    @GetMapping("/guide")
    public String guidePage() {
        return "user/guide";
    }

    // 获取志愿时长列表
    @GetMapping("/hours/list")
    @ResponseBody
    public List<VolunteerHourVO> listHours(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            throw new UnauthorizedException("未登录");
        }
        return volunteerHoursService.getVolunteerHours(user.getId());
    }

    // 导出Excel
    @GetMapping("/hours/export")
    public void exportExcel(
            @RequestParam("type") String type,
            HttpSession session,
            HttpServletResponse response
    ) throws IOException {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            throw new UnauthorizedException("未登录");
        }
        String suffix="";
        switch (type){
            case "excel":suffix="xlsx";break;
            case "pdf":suffix="pdf";break;
            default:suffix="docx";
        }
        // 设置响应头
        String fileName = user.getStuNo() + "_" + user.getName() + "." + suffix;
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; filename=" + URLEncoder.encode(fileName, "UTF-8"));

        // 根据类型导出
        if ("excel".equalsIgnoreCase(type)) {
            volunteerHoursService.exportToExcel(user.getId(), response.getOutputStream());
        }  else {
            throw new IllegalArgumentException("不支持的导出类型: " + type);
        }
    }


}