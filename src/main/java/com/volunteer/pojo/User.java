package com.volunteer.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Long id;                // 主键ID
    private String stuNo;           // 学号/账号, 唯一
    private String password;        // 加密后密码
    private String name;            // 姓名
    private String gender;          // 性别（"男"、"女"）
    private String phone;           // 手机号
    private String email;           // 邮箱
    private String role;            // 角色（"student"、"admin"）
    private Integer status;         // 状态（1启用，0禁用）
    private String avatar;          // 头像URL
    private Timestamp createTime;   // 注册时间
    private Timestamp updateTime;   // 信息更新时间
    private String ssoId;           // 单点登录唯一标识

    // Getter and Setter methods

    public String getUserName() {
        return name;
    }

    public void setUserName(String name) {
        this.name = name;
    }


}