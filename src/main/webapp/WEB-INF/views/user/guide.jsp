<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>校园志愿服务系统 - 使用指南</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --primary-color: #1e40af;
            --secondary-color: #3b82f6;
            --accent-color: #60a5fa;
            --light-color: #e0f2fe;
            --dark-color: #0f172a;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fafc;
            color: #334155;
        }

        .guide-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .guide-header {
            text-align: center;
            margin-bottom: 3rem;
            position: relative;
        }

        .guide-header h1 {
            color: var(--primary-color);
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            position: relative;
            display: inline-block;
        }

        .guide-header h1::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 4px;
            background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
            border-radius: 2px;
        }

        .guide-header p {
            color: #64748b;
            font-size: 1.1rem;
            max-width: 800px;
            margin: 0 auto;
        }

        .guide-section {
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            padding: 2.5rem;
            margin-bottom: 2rem;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .guide-section:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .guide-section h2 {
            color: var(--primary-color);
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid var(--light-color);
        }

        .guide-section h3 {
            color: var(--secondary-color);
            font-size: 1.4rem;
            margin: 1.5rem 0 1rem;
        }

        .guide-list {
            list-style-type: none;
            padding-left: 0;
        }

        .guide-list li {
            margin-bottom: 1rem;
            position: relative;
            padding-left: 1.8rem;
        }

        .guide-list li::before {
            content: '\f00c';
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
            color: var(--secondary-color);
            position: absolute;
            left: 0;
            top: 0.2rem;
        }

        .feature-card {
            background-color: #f1f5f9;
            border-left: 4px solid var(--secondary-color);
            border-radius: 0 8px 8px 0;
            padding: 1.5rem;
            margin-bottom: 1rem;
            transition: all 0.3s ease;
        }

        .feature-card:hover {
            background-color: #e2e8f0;
            transform: translateX(5px);
        }

        .feature-card h4 {
            color: var(--primary-color);
            margin-top: 0;
            display: flex;
            align-items: center;
        }

        .feature-card h4 i {
            margin-right: 0.5rem;
            color: var(--secondary-color);
        }

        .tech-support {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            border-radius: 12px;
            padding: 2rem;
            margin-top: 3rem;
        }

        .tech-support h2 {
            color: white;
            border-bottom: 2px solid rgba(255, 255, 255, 0.3);
        }

        .tech-support p {
            font-size: 1.1rem;
            margin-bottom: 1rem;
        }

        .tech-support a {
            color: white;
            font-weight: bold;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .tech-support a:hover {
            color: var(--light-color);
            text-decoration: underline;
        }

        .back-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background-color: var(--secondary-color);
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            z-index: 100;
        }

        .back-to-top.visible {
            opacity: 1;
        }

        .back-to-top:hover {
            background-color: var(--primary-color);
            transform: translateY(-5px);
        }

        @media (max-width: 768px) {
            .guide-container {
                padding: 1.5rem;
            }

            .guide-header h1 {
                font-size: 2rem;
            }

            .guide-section {
                padding: 1.5rem;
            }

            .tech-support {
                padding: 1.5rem;
            }
        }
    </style>
<div class="guide-container">
    <div class="guide-header">
        <h1>校园志愿服务系统</h1>
        <p>使用指南 - 帮助你快速了解系统功能与操作流程</p>
    </div>

    <div class="guide-section" id="guide-registration">
        <h2>用户注册</h2>
        <ul class="guide-list">
            <li><strong>创建账户</strong>：填写个人信息即可注册系统账号</li>
            <li><strong>必填信息</strong>：姓名、学号、密码、性别、手机号、邮箱</li>
            <li><strong>信息要求</strong>：学号需准确填写学校分配的唯一编号，邮箱用于接收系统通知</li>
        </ul>
    </div>

    <div class="guide-section" id="guide-login">
        <h2>用户登录</h2>
        <ul class="guide-list">
            <li><strong>登录方式</strong>：通过注册时的学号和密码进行系统登录</li>
            <li><strong>快速验证</strong>：系统实时验证账号信息，确保安全登录</li>
            <li><strong>忘记密码</strong>：若忘记密码，可通过技术支持邮箱找回</li>
        </ul>
    </div>

    <div class="guide-section" id="guide-navigation">
        <h2>系统导航</h2>
        <p>登录后界面顶部设有五大功能按钮，便于快速访问系统功能：</p>
        <div class="feature-card">
            <h4><i class="fas fa-archive"></i>活动大厅</h4>
            <p>浏览和搜索志愿服务活动，支持两种搜索方式：<br>
                - 关键词搜索：输入活动内容或选择活动类型查找<br>
                - 时间搜索：点击周一至周末按钮筛选对应时段活动</p>
            <p><strong>活动操作</strong>：可收藏感兴趣的活动或直接报名（已报名活动不可重复操作）</p>
        </div>

        <div class="feature-card">
            <h4><i class="fas fa-bookmark"></i>我的收藏</h4>
            <p>查看已收藏的志愿服务活动，支持以下操作：<br>
                - 取消收藏：对已收藏活动取消关注<br>
                - 报名活动：对收藏的活动直接提交报名申请</p>
        </div>

        <div class="feature-card">
            <h4><i class="fas fa-user-check"></i>我的报名</h4>
            <p>查看报名活动的审核状态，不同状态操作说明：<br>
                - <strong>等待审核</strong>：可随时取消报名申请<br>
                - <strong>审核通过</strong>：可删除报名记录（活动开始前）<br>
                - <strong>报名失败</strong>：查看失败原因并删除记录</p>
        </div>

        <div class="feature-card">
            <h4><i class="fas fa-clock"></i>志愿时长</h4>
            <p>查看个人志愿服务时长记录，包含：<br>
                - 活动日期、活动名称、服务时长等详细信息<br>
                - 支持将时长记录导出为Excel表格，便于统计使用</p>
        </div>

        <div class="feature-card">
            <h4><i class="fas fa-sign-out-alt"></i>退出系统</h4>
            <p>点击退出按钮安全退出系统，保护账户信息安全</p>
        </div>
    </div>

    <div class="tech-support">
        <h2>技术支持</h2>
        <p>如果在使用系统过程中遇到任何问题，可通过以下方式获取帮助：</p>
        <p><i class="fas fa-envelope"></i> 发送邮件至：<a href="mailto:2949561970@qq.com">2949561970@qq.com</a></p>
        <p>可咨询的问题包括：</p>
        <ul class="guide-list" style="color: rgba(255, 255, 255, 0.9);">
            <li>账号注册与登录问题</li>
            <li>密码找回与账户安全</li>
            <li>活动报名失败申诉</li>
            <li>志愿时长记录异常</li>
            <li>系统功能使用疑问</li>
        </ul>
    </div>
</div>

<div class="back-to-top" id="backToTop">
    <i class="fas fa-arrow-up"></i>
</div>

</body>
</html>