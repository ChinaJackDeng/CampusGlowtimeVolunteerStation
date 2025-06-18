package com.volunteer.utils;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import java.lang.reflect.Field;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

public class AdvancedThreadCleanupListener implements ServletContextListener {
    private static final Logger logger = Logger.getLogger(AdvancedThreadCleanupListener.class.getName());
    private static final String MYSQL_CLEANUP_THREAD_NAME = "mysql-cj-abandoned-connection-cleanup";

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        // 应用初始化时无需操作
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        try {
            // 首先尝试标准的JDBC驱动注销
            JdbcCleanupListener.deregisterJdbcDrivers();

            // 强制终止MySQL清理线程
            terminateMysqlCleanupThread();

            // 给线程一些时间来关闭
            Thread.sleep(500);

            // 再次尝试终止所有剩余的非守护线程
            terminateRemainingThreads();

        } catch (Exception e) {
            logger.log(Level.SEVERE, "线程清理失败", e);
        }
    }

    private void terminateMysqlCleanupThread() {
        try {
            // 尝试通过反射获取并关闭MySQL清理线程
            Class<?> driverClass = Class.forName("com.mysql.cj.jdbc.Driver");
            Field cleanupThreadField = driverClass.getDeclaredField("abandonedConnectionCleanupThread");
            cleanupThreadField.setAccessible(true);
            Object cleanupThread = cleanupThreadField.get(null);

            if (cleanupThread instanceof ThreadPoolExecutor) {
                ThreadPoolExecutor executor = (ThreadPoolExecutor) cleanupThread;
                executor.shutdownNow();
                logger.info("已强制关闭MySQL废弃连接清理线程池");
            }
        } catch (Exception e) {
            // 如果反射失败，尝试通过线程名称查找并中断
            logger.log(Level.FINE, "无法通过反射关闭MySQL清理线程，尝试通过线程名称查找", e);
            terminateThreadByName(MYSQL_CLEANUP_THREAD_NAME);
        }
    }

    private void terminateThreadByName(String threadName) {
        ThreadGroup rootGroup = Thread.currentThread().getThreadGroup();
        while (rootGroup.getParent() != null) {
            rootGroup = rootGroup.getParent();
        }

        // 估计线程数量
        int estimatedSize = rootGroup.activeCount() * 2;
        Thread[] allThreads = new Thread[estimatedSize];
        int actualSize = rootGroup.enumerate(allThreads);

        for (int i = 0; i < actualSize; i++) {
            Thread thread = allThreads[i];
            if (thread != null && thread.getName().contains(threadName)) {
                try {
                    logger.info("找到MySQL清理线程，尝试中断: " + thread.getName());
                    thread.interrupt();

                    // 等待线程终止
                    thread.join(1000);

                    if (thread.isAlive()) {
                        logger.warning("MySQL清理线程未能正常终止，尝试强制停止");
                        thread.stop(); // 极端情况使用stop()
                    } else {
                        logger.info("MySQL清理线程已成功终止");
                    }
                } catch (Exception e) {
                    logger.log(Level.SEVERE, "终止MySQL清理线程失败", e);
                }
            }
        }
    }

    private void terminateRemainingThreads() {
        // 查找并终止所有剩余的非守护线程
        ThreadGroup rootGroup = Thread.currentThread().getThreadGroup();
        while (rootGroup.getParent() != null) {
            rootGroup = rootGroup.getParent();
        }

        int estimatedSize = rootGroup.activeCount() * 2;
        Thread[] allThreads = new Thread[estimatedSize];
        int actualSize = rootGroup.enumerate(allThreads);

        for (int i = 0; i < actualSize; i++) {
            Thread thread = allThreads[i];
            if (thread != null && !thread.isDaemon() && thread.isAlive()
                    && !Thread.currentThread().equals(thread)) {
                try {
                    logger.info("尝试终止剩余的非守护线程: " + thread.getName());
                    thread.interrupt();
                    thread.join(500);
                } catch (Exception e) {
                    logger.log(Level.WARNING, "终止线程失败: " + thread.getName(), e);
                }
            }
        }
    }
}