package com.volunteer.service.impl;

import com.volunteer.mapper.UserMapper;
import com.volunteer.pojo.VolunteerHourVO;
import com.volunteer.service.VolunteerHoursService;
import com.volunteer.exception.ServiceException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.util.List;

@Service
public class VolunteerHoursServiceImpl implements VolunteerHoursService {

    private UserMapper hoursMapper;
    @Autowired
    private void setHoursMapper(UserMapper hoursMapper){
        this.hoursMapper=hoursMapper;
    }

    @Override
    public List<VolunteerHourVO> getVolunteerHours(Long userId) {
        return hoursMapper.selectVolunteerHours(userId);
    }

    @Override
    public void exportToExcel(Long userId, OutputStream outputStream) {
        List<VolunteerHourVO> hoursList = getVolunteerHours(userId);

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("志愿时长记录");

            // 创建表头样式
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            // 创建表头
            Row headerRow = sheet.createRow(0);
            String[] headers = {"序号", "活动日期", "活动名称", "志愿时长(小时)"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // 填充数据
            for (int i = 0; i < hoursList.size(); i++) {
                Row row = sheet.createRow(i + 1);
                VolunteerHourVO hour = hoursList.get(i);

                row.createCell(0).setCellValue(i + 1);
                row.createCell(1).setCellValue(hour.getActivityDate());
                row.createCell(2).setCellValue(hour.getActivityName());
                row.createCell(3).setCellValue(hour.getHours());
            }

            // 自动调整列宽
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // 输出到流
            workbook.write(outputStream);
        } catch (Exception e) {
            throw new ServiceException("导出Excel失败");
        }
    }
}