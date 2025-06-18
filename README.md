# CampusGlowtimeVolunteerStation

基于 SSM 框架开发的校园志愿活动管理系统，为校园志愿活动提供全流程数字化管理方案，提升志愿活动组织效率与参与体验。

## 项目概述

CampusGlowtimeVolunteerStation 采用 Spring+Spring MVC+MyBatis (SSM) 框架构建，聚焦解决传统校园志愿活动管理中信息不对称、流程繁琐、数据统计困难等痛点。系统支持学生用户与管理员双角色体系，实现从活动发布、报名审核到志愿时长统计的全生命周期管理，助力校园志愿活动信息化升级。

## 功能特点

### 用户管理模块
- 学生 / 管理员双角色认证体系，学生凭学号 + 密码登录
- 基于角色的权限控制，实现差异化功能界面跳转

### 活动全流程管理
- 管理员端支持活动创建、编辑、删除及状态管理
- 活动信息多维度筛选（类型 / 时间 / 地点）与详情展示
- 乐观锁机制防止并发编辑冲突，确保数据一致性

### 报名与收藏系统
- 学生在线报名、取消报名及审核状态实时查询
- 活动收藏功能，支持一键报名收藏活动
- 管理员端审核操作

### 志愿时长统计
- 自动汇总参与活动时长
- 一键导出 Excel 格式时长证明，满足实践学分认证需求

## 技术架构

### 后端技术
- 核心框架：Spring 4.3.18.RELEASE
- Web 框架：Spring MVC 4.3.18.RELEASE
- 持久层：MyBatis 3.4.5
- 数据库：MySQL 5.7
- 工具类：Apache Commons、Hutool、POI

### 前端技术
- 视图层：JSP 2.3
- 脚本：JavaScript、jQuery 3.3.1
- 样式：Bootstrap 3.3.7 响应式设计
- 图表：ECharts 4.2.1 数据可视化

## 开发环境
- JDK 17
- IDEA 2024.1+
- Maven 3.6.3
- Tomcat 11

## 数据库设计

### 核心数据表（4 张）

```sql
-- 用户表：存储用户基本信息及权限
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  stu_no VARCHAR(20) UNIQUE NOT NULL COMMENT '学号/工号',
  name VARCHAR(50) NOT NULL COMMENT '姓名',
  password VARCHAR(100) NOT NULL COMMENT 'BCrypt加密密码',
  role ENUM('student', 'admin') DEFAULT 'student' COMMENT '角色',
  status TINYINT DEFAULT 1 COMMENT '状态(1:激活 0:封禁)',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间'
);

-- 志愿活动表：存储活动完整信息
CREATE TABLE volunteer_activity (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '活动名称',
  description TEXT COMMENT '活动描述',
  location VARCHAR(200) COMMENT '活动地点',
  start_time DATETIME NOT NULL COMMENT '开始时间',
  end_time DATETIME NOT NULL COMMENT '结束时间',
  duration INT COMMENT '时长(小时)',
  capacity INT COMMENT '最大人数',
  enrolled_count INT DEFAULT 0 COMMENT '已报名人数',
  status ENUM('publishing', 'ended', 'cancelled') DEFAULT 'publishing' COMMENT '活动状态',
  version INT DEFAULT 1 COMMENT '乐观锁版本号',
  creator_id BIGINT COMMENT '创建者ID',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 报名记录表：关联用户与活动
CREATE TABLE user_activity_enroll (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL COMMENT '用户ID',
  activity_id BIGINT NOT NULL COMMENT '活动ID',
  status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending' COMMENT '报名状态',
  apply_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '报名时间',
  review_time DATETIME COMMENT '审核时间',
  review_opinion VARCHAR(200) COMMENT '审核意见',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (activity_id) REFERENCES volunteer_activity(id)
);

-- 活动收藏表：用户个性化收藏
CREATE TABLE user_activity_favorite (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL COMMENT '用户ID',
  activity_id BIGINT NOT NULL COMMENT '活动ID',
  favorite_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  status TINYINT DEFAULT 1 COMMENT '收藏状态(1:有效 0:已取消)',
  UNIQUE KEY uk_user_activity (user_id, activity_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (activity_id) REFERENCES volunteer_activity(id)
);
```

### 模块交互图

```plaintext
┌───────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   用户管理模块  │────►│  活动管理模块   │────►│   报名管理模块  │
└───────────────┘     └─────────────────┘     └─────────────────┘
                                                              │
                                                              ▼
                                                    ┌─────────────────┐
                                                    │ 志愿时长统计模块 │
                                                    └─────────────────┘
```

## 快速部署

### 克隆项目
```bash
git clone https://github.com/ChinaJackDeng/CampusGlowtimeVolunteerStation.git
```

### 配置数据库
1. 导入`db/CampusGlowtimeVolunteerStation.sql`创建数据库
2. 修改`src/main/resources/mybatis-config.xml`中的数据库连接信息

### 编译打包
```bash
mvn clean package -Dmaven.test.skip=true
```

### 部署运行
1. 将`target/CampusGlowtimeVolunteerStation.war`复制到 Tomcat/webapps 目录
2. 启动 Tomcat 后访问：http://localhost:8080/CampusGlowtimeVolunteerStation

### 默认账号
- 学生测试账号：yy / 123
- 管理员账号：admin / adminpwd（首次登录后建议修改密码）

## 项目截图

| 模块 | 截图说明 |
|------|----------|
| 登录页面 | 双角色登录入口 |
| 活动大厅 | 学生端活动列表与筛选 |
| 管理后台 | 管理员活动全流程管理界面 |
| 时长统计 | 志愿时长可视化与导出功能 |

## 开发历程

```plaintext
需求分析：2025.04.15-2025.04.25
系统设计：2025.04.26-2025.05.05
编码实现：2025.05.06-2025.06.06
测试验收：2025.06.07-2025.06.17
```

## 项目亮点

- 完整事务控制：报名 / 取消操作采用数据库事务，确保数据一致性
- 用户体验：响应式设计适配移动端、操作流程可视化引导

## 待优化点

- 部分复杂查询接口效率有待提升
- 移动端专项适配不足，交互体验需优化
- 高并发场景下的限流与熔断机制缺失
- 活动推荐算法与个性化服务功能待开发

## 未来规划

- 微服务架构重构，提升系统扩展性
- 开发微信小程序端，拓展使用场景
- 集成消息推送功能（报名审核 / 活动提醒）
- 引入 AI 推荐算法，智能匹配用户与活动
- 增加活动评价与反馈系统，完善闭环管理

## 联系方式

- 项目地址：https://github.com/ChinaJackDeng/CampusGlowtimeVolunteerStation
- Issues：https://github.com/ChinaJackDeng/CampusGlowtimeVolunteerStation/issues
