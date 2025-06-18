package com.volunteer.controller;

import com.volunteer.pojo.Activity;
import com.volunteer.pojo.EnrollmentVO;
import com.volunteer.pojo.Result;
import com.volunteer.pojo.User;
import com.volunteer.service.ActivityService;
import com.volunteer.service.DashboardService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController // 返回json用RestController，等同于@Controller + @ResponseBody
@RequestMapping("/admin")
public class AdminController {

    private ActivityService activityService;
    @Autowired
    private void setActivityService(ActivityService activityService){
        this.activityService=activityService;
    }

    private DashboardService dashboardService;
    @Autowired
    private void setDashboardService(DashboardService dashboardService){
        this.dashboardService=dashboardService;
    }

    // 1. 获取所有活动（表格用）
    @GetMapping("/activity/list")
    public List<Activity> activityList() {
        return activityService.getAllActivities();
    }

    @GetMapping("/logout")
    public String headerPage(){
        return "common/header";
    }

    // 2. 修改活动（可选择字段单独修改，前端可传id和字段名+值）
    @PostMapping("/activity/update")
    public Map<String, Object> updateActivity(@RequestBody Map<String, Object> params) {
        Long id = Long.parseLong(params.get("id").toString());
        String field = params.get("field").toString();
        String value = params.get("value").toString();
        boolean ok = activityService.updateField(id, field, value);
        return Map.of("success", ok);
    }

    // 3. 删除活动
    @PostMapping("/activity/delete")
    public Map<String, Object> deleteActivity(@RequestParam Long id) {
        boolean ok = activityService.deleteActivityById(id);
        return Map.of("success", ok);
    }

    // 添加活动信息到数据库
    @PostMapping("/activity/add")
    public Result addActivity(@RequestBody Activity activity, HttpSession session) {
        User user=(User) session.getAttribute("user");
        activity.setCreatorId(user.getId());
        activity.setCreatorName(user.getName());
        boolean ok = activityService.addActivity(activity);
        if(ok) return Result.status(200, "新建成功");
        else return Result.error("创建失败");
    }

    // 5. 获取所有报名审核信息（带用户、活动详情）
    @GetMapping("/enroll/list")
    public List<EnrollmentVO> enrollList() {
        // 返回List<Map>，每条包含用户信息、报名信息、活动信息
        return dashboardService.findAllWithUserAndActivity();
    }
    // 6. 修改报名状态
    @PostMapping("/enroll/status")
    public Map<String, Object> updateEnrollStatus(@RequestBody Map<String, Object> params) {
        Long id = Long.parseLong(params.get("id").toString());
        Integer status = Integer.parseInt(params.get("status").toString());
        boolean ok = dashboardService.updateStatus(id, status);
        return Map.of("success", ok);
    }


}