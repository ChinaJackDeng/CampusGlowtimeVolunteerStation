package com.volunteer.utils;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;
import java.util.concurrent.ThreadPoolExecutor;

public class JdbcCleanupListener implements ServletContextListener {

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        deregisterJdbcDrivers();
        shutdownAbandonedConnectionThread();
    }

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        // 初始化时无需操作
    }

    public static void deregisterJdbcDrivers() {
        Enumeration<Driver> drivers = DriverManager.getDrivers();
        while (drivers.hasMoreElements()) {
            Driver driver = drivers.nextElement();
            try {
                DriverManager.deregisterDriver(driver);
                System.out.println("已注销JDBC驱动: " + driver);
            } catch (SQLException e) {
                System.err.println("无法注销JDBC驱动: " + driver);
                e.printStackTrace();
            }
        }
    }

    private void shutdownAbandonedConnectionThread() {
        try {
            // 反射获取MySQL的废弃连接清理线程池
            Class<?> jdbcDriverClass = Class.forName("com.mysql.cj.jdbc.Driver");
            java.lang.reflect.Field cleanupThreadField = jdbcDriverClass.getDeclaredField("abandonedConnectionCleanupThread");
            cleanupThreadField.setAccessible(true);
            Object cleanupThread = cleanupThreadField.get(null);

            if (cleanupThread instanceof ThreadPoolExecutor) {
                ThreadPoolExecutor executor = (ThreadPoolExecutor) cleanupThread;
                executor.shutdownNow();
                System.out.println("已关闭MySQL废弃连接清理线程池");
            }
        } catch (Exception e) {
            System.err.println("关闭废弃连接线程失败: " + e.getMessage());
        }
    }
}