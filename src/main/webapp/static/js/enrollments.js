// 从全局变量获取baseUrl
const baseUrl = window.BASE_URL;
$(function() {
    // 状态码与显示文本的映射
    const statusTextMap = {
        "1": "等待审核",
        "2": "审核通过",
        "3": "报名失败"
    };

    // 状态样式类映射
    const statusClassMap = {
        "1": "status-pending",
        "2": "status-passed",
        "3": "status-rejected"
    };

    // 加载报名列表
    function loadEnrollments(status) {
        $.get(`${baseUrl}/activity/enrollments/list`, { status: status }, function(result) {
            console.log(result);
            if (result.code===200) {
                renderEnrollmentList(result.data, status);
            } else {
                $("#enrollList").html(`<div class='enrollments-empty'>${result.msg || '获取数据失败'}</div>`);
            }
        }).fail(function(xhr, status, error) {
            console.error("加载报名列表失败:", error);
            $("#enrollList").html("<div class='enrollments-empty'>加载失败，请重试</div>");
        });
    }

    // 渲染报名列表
    function renderEnrollmentList(activities, currentStatus) {
        $("#enrollList").empty();

        if (!activities || activities.length === 0) {
            $("#enrollList").html(`<div class='enrollments-empty'>暂无${statusTextMap[currentStatus]}的报名记录</div>`);
            return;
        }
        const showExplanation = currentStatus === 3;
        // 创建表格
        let tableHtml = `
            <table class="enrollments-table">
                <thead>
                    <tr>
                        <th>活动名称</th>
                        <th>时间</th>
                        <th>地点</th>
                        <th>联系人</th>
                        <th>状态</th>
                          ${showExplanation ? '<th>说明</th>' : ''}
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // 添加表格内容
        $.each(activities, function(i, activity) {
            // 解析日期并获取星期几
            const startTime = new Date(activity.startTime);
            const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
            const weekDay = weekDays[startTime.getDay()];

            // 格式化日期和时间
            const formattedDate = formatDate(activity.startTime);
            const formattedTime = formatTime(activity.startTime) + " - " + formatTime(activity.endTime);

            // 构建状态标签
            const statusTag = `<span class="status-tag ${statusClassMap[activity.enrollStatus]}">${statusTextMap[activity.enrollStatus]}</span>`;

            // 构建操作按钮
            let actionHtml = "";
            if (activity.enrollStatus === 1) {
                // 等待审核状态，显示取消报名按钮
                actionHtml = `<button class="btn btn-cancel" data-id="${activity.id}">取消报名</button>`;
            }
            else if (activity.enrollStatus === 2||activity.enrollStatus===3) {
                // 通过和失败状态，显示“删除”按钮
                actionHtml = `<button class="btn btn-delete" data-id="${activity.id}">删除记录</button>`;
            }
            // 添加表格行
            tableHtml += `
                <tr>
                    <td>${activity.name}</td>
                    <td>${formattedDate} ${weekDay}<br>${formattedTime}</td>
                    <td>${activity.location}</td>
                    <td>${activity.contact}</td>
                    <td>${statusTag}</td>
                     ${showExplanation ? `<td>${activity.explanation || '无'}</td>` : ''}
                    <td>${actionHtml}</td>
                </tr>
            `;
        });

        // 结束表格
        tableHtml += `
                </tbody>
            </table>
        `;

        $("#enrollList").append(tableHtml);

        // 绑定取消报名按钮事件
        bindCancelEvents();

        // 绑定删除按钮事件
        bindDeleteEvents();
    }

    // 绑定取消报名按钮事件
    function bindCancelEvents() {
        $("#enrollList").on("click", ".btn-cancel", function() {
            const id = $(this).data("id");
            if (confirm("确定要取消该活动的报名吗？")) {
                cancelEnrollment(id);
            }
        });
    }

    // 绑定删除按钮事件
    function bindDeleteEvents() {
        $("#enrollList").on("click", ".btn-delete", function() {
            const id = $(this).data("id");
            if (confirm("确定要删除该报名记录吗？此操作不可恢复。")) {
                deleteEnrollment(id);
            }
        });
    }
    // 取消报名
    function cancelEnrollment(enrollmentId) {
        $.post(`${baseUrl}/activity/enrollments/cancel`, { id: enrollmentId }, function(result) {
            if (result.code===200) {
                alert("取消报名成功");
                const currentStatus = $(".enrollments-tabs li.on").data("status");
                loadEnrollments(currentStatus);
            } else {
                alert(result.msg || "取消报名失败，请重试");
            }
        }).fail(function() {
            alert("网络错误，取消报名失败");
        });
    }

    // 删除报名记录
    function deleteEnrollment(enrollmentId) {
        $.post(`${baseUrl}/activity/enrollments/delete`, { id: enrollmentId }, function(result) {
            if (result.code === 200) {
                alert("删除记录成功");
                const currentStatus = $(".enrollments-tabs li.on").data("status");
                loadEnrollments(currentStatus);
            } else {
                alert(result.msg || "删除记录失败，请重试");
            }
        }).fail(function() {
            alert("网络错误，删除记录失败");
        });
    }

    // 格式化日期
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.getFullYear() + "-" +
            padZero(date.getMonth() + 1) + "-" +
            padZero(date.getDate());
    }

    // 格式化时间
    function formatTime(dateStr) {
        const date = new Date(dateStr);
        return padZero(date.getHours()) + ":" +
            padZero(date.getMinutes());
    }

    // 数字补零
    function padZero(num) {
        return num < 10 ? "0" + num : num;
    }

    // 初始化加载等待审核的报名
    let initialStatus = $(".enrollments-tabs li.on").data("status");
    loadEnrollments(initialStatus);

    // 选项卡点击事件
    $(".enrollments-tabs li").click(function() {
        $(".enrollments-tabs li").removeClass("on");
        $(this).addClass("on");
        const status = $(this).data("status");
        loadEnrollments(status);
    });
});