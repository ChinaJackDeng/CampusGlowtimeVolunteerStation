package com.volunteer.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EnrollmentVO {
    private Long id;
    private String userName;
    private String userNo;
    private String userEmail;
    private String activityName;
    private String activityContact;
    private Integer status;
    private Date enrollTime;
    private String explanation;
    //  getter和setter方法
}