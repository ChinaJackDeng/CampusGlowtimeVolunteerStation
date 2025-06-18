package com.volunteer.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Result {
    private int code;
    private String msg;
    private Object data;

    // 成功响应（无数据）
    public static Result success() {
        return new Result(200, "成功", null);
    }

    // 成功响应（有数据）
    public static Result success(Object data) {
        return new Result(200, "成功", data);
    }
    //成功响应
    public static Result success(String msg,Object data){
        return new Result(200,msg,data);
    }
    // 错误响应
    public static Result error(String msg) {
        return new Result(500, msg, null);
    }

    // 自定义状态码响应（可选）
    public static Result status(int code, String msg) {
        return new Result(code, msg, null);
    }
}