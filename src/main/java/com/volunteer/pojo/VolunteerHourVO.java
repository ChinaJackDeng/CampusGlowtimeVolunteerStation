package com.volunteer.pojo;

public class VolunteerHourVO {
    private Long activityId;
    private String activityName;
    private String activityDate;
    private Double hours;

    // Getters and Setters
    public Long getActivityId() { return activityId; }
    public void setActivityId(Long activityId) { this.activityId = activityId; }

    public String getActivityName() { return activityName; }
    public void setActivityName(String activityName) { this.activityName = activityName; }

    public String getActivityDate() { return activityDate; }
    public void setActivityDate(String activityDate) { this.activityDate = activityDate; }

    public Double getHours() { return hours; }
    public void setHours(Double hours) { this.hours = hours; }
}