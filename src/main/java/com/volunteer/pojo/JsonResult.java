package com.volunteer.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JsonResult {

    private int state;
    private String message;
    private Object data;

}
