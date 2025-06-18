package com.volunteer.controller;

import com.volunteer.pojo.ActivityEnrollment;
import com.volunteer.pojo.Result;
import com.volunteer.pojo.Activity;
import com.volunteer.pojo.User;
import com.volunteer.service.ActivityService;
import com.volunteer.service.FavoriteService;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Controller
@RequestMapping("/activity")
public class ActivityController {

    private ActivityService activityService;
    @Autowired
    private void setActivityService(ActivityService activityService){
        this.activityService=activityService;
    }
    private  FavoriteService favoriteService;
    @Autowired
    private void setFavoriteService(FavoriteService favoriteService){
        this.favoriteService=favoriteService;
    }
    // 活动大厅页
    @GetMapping("/hall")
    public String hallPage() {
        return "activity/hall";
    }

    // 收藏页
    @GetMapping("/favorites")
    public String favoritesPage() {
        return "activity/favorites";
    }

    // 我的报名页
    @GetMapping("/enrollments")
    public String enrollmentsPage() {
        return "activity/enrollments";
    }

    // 获取活动列表（JSON）
    @GetMapping("/list")
    @ResponseBody
    public Result list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer weekday,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize
    ) {

        Map<String, Object> result = activityService.getActivityList(keyword,type,weekday,page,pageSize);
        return Result.success(result);
    }

    // 活动列表页的收藏接口（仅支持收藏）
    @PostMapping("/favorite")
    @ResponseBody
    public Result addFavorite(@RequestParam("id") Long activityId, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return Result.error("请先登录");
        }

        // 执行收藏逻辑
        boolean success = favoriteService.addFavorite(user.getId(), activityId);
        return success ?
                Result.success("已收藏") :
                Result.error("收藏失败，活动已结束或已收藏");
    }

    // “我的收藏”页面的取消接口（独立）
    @PostMapping("/favorite/cancel")
    @ResponseBody
    public Result cancelFavorite(@RequestParam("id") Long activityId, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return Result.error("请先登录");
        }

        boolean success = favoriteService.cancelFavorite(user.getId(), activityId);
        return success ?
                Result.success("已取消收藏") :
                Result.error("取消失败，未找到收藏记录");
    }
    @PostMapping("/favorite/batchCancel")
    @ResponseBody
    public Result batchCancelFavorites(@RequestBody List<Long> ids, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return Result.error("请先登录");
        }

        boolean success = favoriteService.batchCancelFavorites(user.getId(), ids);
        return success ?
                Result.success("批量取消成功") :
                Result.error("批量取消失败");
    }
    // 报名活动
    @PostMapping("/enroll")
    @ResponseBody
    public Result enroll(@RequestParam("id") Long activityId) {
        try {
            boolean success = activityService.enroll(activityId);
            if (success) {
                return Result.success("报名成功");
            } else {
                return Result.error("报名失败，已经报名过、活动不存在、已结束或名额已满");
            }
        } catch (Exception e) {
            return Result.error("报名请求失败，请重试");
        }//java.lang.NullPointerException: Cannot invoke "java.lang.Integer.intValue()" because the return value of "com.volunteer.pojo.Activity.getEnrolledCount()" is null
    }//

    // 我的收藏列表
    @GetMapping("/favorites/list")
    @ResponseBody
    public Result favoritesList(
            @RequestParam(required = false, defaultValue = "all") String type,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            HttpSession session
    ) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return Result.error("请先登录");
        }

        // 修正：传递用户ID到Service
        Map<String, Object> result = favoriteService.getFavoriteActivities(
                user.getId(), type, page, pageSize
        );

        return Result.success(result);
    }

    /**
     * 获取用户报名列表
     */
    @GetMapping("/enrollments/list")
    @ResponseBody
    public Result enrollmentsList(@RequestParam(required = false) String status,HttpSession session) {
        try {
            // 获取当前登录用户
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return Result.error("未登录");
            }
            Long userId = user.getId();

            // 根据状态查询报名记录
            List<ActivityEnrollment> enrollments = activityService.getEnrollmentsByUserIdAndStatus(userId, status);

            // 构建返回结果
            List<Map<String, Object>> resultList = new ArrayList<>();
            for (ActivityEnrollment enrollment : enrollments) {
                // 获取活动信息
                Activity activity = activityService.getActivityById(enrollment.getActivityId());
                if (activity != null) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", enrollment.getId());
                    item.put("activityId", activity.getId());
                    item.put("name", activity.getName());
                    item.put("location", activity.getLocation());
                    item.put("contact", activity.getContact());
                    item.put("startTime", activity.getStartTime());
                    item.put("endTime", activity.getEndTime());
                    item.put("duration", activity.getDuration());
                    item.put("coverUrl", activity.getCoverUrl());
                    item.put("enrollStatus", enrollment.getStatus());
                    item.put("explanation", enrollment.getExplanation());
                    resultList.add(item);
                }
            }


            return Result.success(resultList);
        } catch (Exception e) {
            return Result.error("获取报名列表失败");
        }
    }

    /**
     * 取消报名
     */
    @PostMapping("/enrollments/cancel")
    @ResponseBody
    @Transactional
    public Result cancelEnrollment(@RequestParam("id") Long id, HttpSession session) {
        try {
            // 获取当前登录用户
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return Result.error("未登录");
            }
            Long userId = user.getId();

            // 验证报名记录是否存在
            ActivityEnrollment enrollment = activityService.getEnrollmentById(id);
            if (enrollment == null) {
                return Result.error("报名记录不存在");
            }

            // 验证权限
            if (!enrollment.getUserId().equals(userId)) {
                return Result.error("无权操作该报名记录");
            }

            // 验证状态是否可取消（等待审核状态可取消）
            if (1!=enrollment.getStatus()) {
                return Result.error("当前状态不可取消报名");
            }

            // 更新报名状态为"已取消"
            enrollment.setStatus(0);
            activityService.updateEnrollment(enrollment);

            // 活动人数减1
            activityService.decreaseEnrollmentCount(enrollment.getActivityId());

            return Result.success("已取消报名");
        } catch (Exception e) {
            return Result.error("取消报名失败");
        }
    }

    @PostMapping("/enrollments/delete")
    @ResponseBody
    @Transactional
    public Result deleteEnrollment(@RequestParam("id") Long id, HttpSession session) {
        try {
            // 1. 验证用户登录状态
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return Result.error("未登录");
            }
            Long userId = user.getId();

            // 2. 查询报名记录
            ActivityEnrollment enrollment = activityService.getEnrollmentById(id);
            if (enrollment == null) {
                return Result.error("报名记录不存在");
            }

            // 3. 验证权限（确保只能删除自己的报名记录）
            if (!enrollment.getUserId().equals(userId)) {
                return Result.error("无权删除该报名记录");
            }

            // 4. 验证状态（只允许删除特定状态的记录）
            if (!isDeletableStatus(enrollment.getStatus())) {
                return Result.error("当前状态不允许删除");
            }

            // 5. 执行删除操作
            activityService.deleteEnrollment(id);

            // 6. 返回成功结果
            return Result.success("删除记录成功");
        } catch (Exception e) {
            return Result.error("删除记录失败，请稍后重试");
        }
    }

    // 判断状态是否允许删除
    private boolean isDeletableStatus(int status) {
        // 示例：只允许删除"审核通过"和"报名失败"的记录
        return 2==status || 3==status;
    }
}
