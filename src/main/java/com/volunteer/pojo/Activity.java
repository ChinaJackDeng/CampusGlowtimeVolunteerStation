package com.volunteer.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Activity {
    private Long id;
    private String name;
    private String coverUrl;
    private String type;
    private String description;
    private String location;
    private Date startTime;
    private Date endTime;
    private BigDecimal duration;
    private Integer capacity;
    private Integer enrolledCount;
    private String status;
    private String requirement;
    private String contact;
    private Long creatorId;
    private String creatorName;
    private Date createTime;
    private Date updateTime;
    private Integer favoriteStatus;
    private Integer version;
    // getter/setter方法
    // Activity.java

    // 只传部分参数的构造函数（用于前端发来的活动表单，其他属性用默认值）
    public Activity(String name, String type, String description, String location,
                    Date startTime, Date endTime, BigDecimal duration, Integer capacity,
                    String requirement, String contact,Long creatorId, String creatorName,String coverUrl) {
        this.id = null;
        this.name = name;
        this.type = type;
        this.description = description;
        this.location = location;
        this.startTime = startTime;
        this.endTime = endTime;
        this.duration = duration;
        this.capacity = capacity;
        this.enrolledCount = 0;
        this.status = "报名中";
        this.requirement = requirement;
        this.contact = contact;
        this.creatorId = creatorId;
        this.creatorName = creatorName;
        this.coverUrl = coverUrl;
        this.createTime = new Date();
        this.updateTime = new Date();
        this.favoriteStatus = 0;
        this.version = 0;
    }
    public boolean isEnrollable() {
        Date now = new Date();
        return this.getStartTime() != null && now.before(this.getStartTime());
    }
}