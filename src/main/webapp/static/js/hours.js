const baseUrl = window.BASE_URL;
$(function() {
    // 加载志愿时长列表
    function loadHoursList() {
        $.get(baseUrl + "/user/hours/list", function(data) {
            console.log("收到数据:", data);
            updateHourTable(data);
        }).fail(function(xhr) {
            handleLoadError(xhr);
        });
    }

    // 更新表格数据
    function updateHourTable(data) {
        let totalHours = 0;
        const $tbody = $("#hourTable tbody");
        $tbody.empty();

        console.log("数据类型:", typeof data);
        console.log("数据是否为数组:", Array.isArray(data));
        console.log("数据长度:", data.length);
        console.log("数据内容:", data);

        if (!Array.isArray(data) || data.length === 0) {
            $tbody.append(`<tr><td colspan="4" class="text-center no-data">暂无志愿时长记录</td></tr>`);
            return;
        }

        data.forEach((item, index) => {
            console.log(`渲染第 ${index + 1} 条数据 (索引: ${index})`, item);

            const date = item.activityDate || '无日期';
            const name = item.activityName || '无名称';
            const hour = item.hours !== undefined ? item.hours : 0;

            const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${date}</td>
                        <td>${name}</td>
                        <td>${hour}</td>
                    </tr>
                `;

            $tbody.append(row);
            totalHours += parseFloat(hour);
        });

        const totalRow = `
                <tr class="total-row">
                    <td colspan="3"><b>总计</b></td>
                    <td><b>${totalHours.toFixed(2)}</b></td>
                </tr>
            `;
        $tbody.append(totalRow);

        console.log("表格已渲染，总计时长:", totalHours);
    }

    // 处理加载错误
    function handleLoadError(xhr) {
        let errorMsg = "加载志愿时长失败";
        if (xhr.status === 401) {
            errorMsg = "未登录，请先登录";
        } else if (xhr.status === 404) {
            errorMsg = "请求的资源不存在";
        } else if (xhr.status === 500) {
            errorMsg = "服务器内部错误";
        }
        alert(errorMsg);
    }

    // 导出Excel
    function exportToExcel() {
        const $btn = $("#exportExcel");
        $btn.addClass("spinning").prop("disabled", true).html('<i class="icon-spinner spinning"></i> 导出中...');

        window.location = baseUrl + "/user/hours/export?type=excel";

        setTimeout(() => {
            $btn.removeClass("spinning").prop("disabled", false).html('<i class="icon-download"></i> 导出Excel');
        }, 3000);
    }

    // 绑定事件
    $("#exportExcel").click(exportToExcel);

    // 初始化加载
    loadHoursList();
});