package com.volunteer.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ActivityEnrollment {
    private Long id;
    private Long userId;
    private Long activityId;
    private Date enrollTime;
    private int status; // 1-等待审核, 2-审核通过, 3-报名失败, 4-已取消
    private String explanation; // 拒绝原因

    // getters and setters
}