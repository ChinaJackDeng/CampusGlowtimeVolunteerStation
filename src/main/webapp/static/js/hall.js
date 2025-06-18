// 从全局变量获取baseUrl
const baseUrl = window.BASE_URL;
$.ajaxSetup({
    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
    headers: {
        "Accept": "application/json; charset=utf-8"
    }
});

$(function () {
    // 默认选中周六
    $('.weekday-btn[data-value="6"]').addClass('active');

    // 加载活动列表
    function loadActivities(page) {
        // 显示加载遮罩
        $("#activityList").html(`    
        <div class="empty" id="loadingIndicator">
            <i class="fa fa-spinner fa-spin"></i> 加载中...
        </div>
    `);

        // 获取选中的星期值
        const selectedWeekday = $('.weekday-btn.active').data('value');
        let query = $("#searchForm").serialize();

        // 如果未选择类型，移除类型参数
        const selectedType = $("select[name='type']").val();
        if (!selectedType) {
            query = query.replace(/&?type=[^&]*/, '');
        }

        // 添加星期参数（默认周六）
        query += (selectedWeekday !== undefined) ? `&weekday=${selectedWeekday}` : '&weekday=6';
        query += "&page=" + (page || 1);

        $.get(baseUrl + "/activity/list", query)
            .done(function (result) {
                if (result.code !== 200) {
                    $("#activityList").html(`
                    <div class="empty">
                        <i class="fa fa-exclamation-triangle"></i> ${result.msg || "获取活动列表失败"}
                    </div>
                `);
                    return;
                }


                /**
                 * @typedef{Object} Data
                 * @property{Object} activities
                 *
                 *
                 * 活动类型定义
                 * @typedef {Object} Activity
                 * @property {number} id 活动ID
                 * @property {string} name 活动名称
                 * @property {string} coverUrl 封面URL
                 * @property {string} status 活动状态
                 * @property {string} location 地点
                 * @property {Date} startTime 开始时间
                 * @property {number} duration 时长（小时）
                 * @property {number} enrolledCount 当前报名数
                 * @property {number} capacity 招募人数上限
                 */
                const data = result.data;
                if (!data.activities || data.activities.length === 0) {
                    $("#activityList").html(`
                    <div class="empty">
                        <i class="fa fa-search"></i> 暂无符合条件的活动
                    </div>
                `);
                    $("#pagination").html("");
                    return;
                }

                const activityImgBaseUrl = baseUrl + "/static/img/activity/";
                // 清空列表并渲染活动
                $("#activityList").empty();
                $.each(data.activities, function (i, act) {

                    const joinDisabled = (act.status !== "报名中" || act.enrolledCount >= act.capacity)
                        ? "disabled"
                        : "";
                    $("#activityList").append(`                 
                    <div class="activity-card" data-id="${act.id}">
                        <div class="card-header">
                            <img src="${activityImgBaseUrl}${act.coverUrl}" class="card-img" alt="${act.name}">
                            <span class="card-status status ${act.status}">${act.status}</span>
                        </div>
                        <div class="card-body">
                            <div class="card-title">${act.name}</div>
                            <div class="card-meta">
                                时间: ${formatDateTime(act.startTime)} 
                                地点: ${act.location} 
                                时长: ${act.duration}h
                            </div>
                            <div class="card-actions">
                                <button class="btn-fav">收藏</button>
                                <button class="btn-join" ${joinDisabled}>
                                    ${act.status === "报名中" ? "报名" : "已结束"}
                                </button>
                            </div>
                        </div>
                    </div>
                `);
                });

                renderPagination(data.currentPage, data.totalPages);
            })
            .fail(function (jqXHR) {
                $("#activityList").html(`               
                <div class="empty">
                    <i class="fa fa-exclamation-circle"></i> 请求失败：状态码 ${jqXHR.status}
                </div>
            `);
            })
            .always(function () {
                // 移除加载遮罩（如果使用了body级别的遮罩）
                $(".loading-mask").remove();
            });
    }

    // 渲染分页控件
    function renderPagination(current, total) {
        let html = "";
        for (let i = 1; i <= total; i++) {
            html += `<a class="page-link${i === current ? ' active' : ''}" data-p="${i}">${i}</a>`;
        }
        $("#pagination").html(`<div class="pagination">${html}</div>`);
    }

    // 时间格式化函数
    function formatDateTime(str) {
        if (!str) return "未知";
        const date = new Date(str);
        return date.toLocaleString(); // 转换为本地时间格式（如：2025/6/14 上午9:00）
    }

    // 初始化加载第一页
    loadActivities(1);

    // 搜索表单提交事件
    $("#searchForm").on("submit", function (e) {
        e.preventDefault();
        const keyword = $("input[name='keyword']").val().trim();
        const type = $("select[name='type']").val();
        const weekday = $('.weekday-btn.active').data('value');

        if (!keyword && !type && !weekday) {
            alert("请输入搜索关键词、选择类型或星期");
            return;
        }

        loadActivities(1);
    });

    // 分页点击事件
    $("#pagination").on("click", ".page-link", function () {
        loadActivities($(this).data("p"));
    });

    //收藏
    $("#activityList").on("click", ".btn-fav", function (e) {
        e.stopPropagation();
        const card = $(this).closest(".activity-card");
        const id = card.data("id");
        const btn = $(this);

        $.post(baseUrl + "/activity/favorite", { id: id })
            .done(function (result) {
                if (result.code === 200) {
                    alert(result.msg||"收藏成功");
                } else {
                    alert(result.msg || "若要取消收藏请点击'我的收藏'");
                }
            })
            .fail(function () {
                alert("请求失败，请重试");
            });
    });

    // 报名按钮点击事件
    $("#activityList").on("click", ".btn-join", function (e) {
        e.stopPropagation();
        const card = $(this).closest(".activity-card");
        const id = card.data("id");
        const btn = $(this);

        $.post(baseUrl + "/activity/enroll", { id: id })
            .done(function (result) {
                if (result.code === 200) {
                    alert(result.data); // 显示"报名成功"
                    loadActivities(); // 重新加载列表
                    // 更新当前卡片的报名人数（可选优化）
                    const enrolledCount = result.data.enrolledCount; // 假设后端返回更新后的数据
                    card.find(".card-meta").find("[data-field='enrolled']").text(enrolledCount);
                } else {
                    alert(result.msg || "报名失败，请检查活动状态或名额");
                }
            })
            .fail(function () {
                alert("报名请求失败");
            });
    });

    // 模态框关闭事件
    $("#detailModal").on("click", ".close-modal, .modal", function (e) {
        if (e.target.classList.contains('modal') || $(e.target).is('.close-modal')) {
            $("#detailModal").removeClass("active").hide();
        }
    });

    // 星期按钮点击事件
    $('.weekday-btn').click(function () {
        $('.weekday-btn').removeClass('active');
        $(this).addClass('active');
        loadActivities(1); // 切换星期后重新加载
    });

    // 键盘回车键触发搜索
    $("#searchForm input").on("keypress", function (e) {
        if (e.key === "Enter") {
            $("#searchForm").trigger("submit");
        }
    });
    /**
     * 更新搜索按钮状态
     * 根据关键词输入、筛选类型选择和星期选择动态启用/禁用搜索按钮
     */
    function updateSearchBtnStatus() {
        // 获取搜索表单元素
        const $searchInput = $("input[name='keyword']");
        const $typeSelect = $("select[name='type']");
        const $activeWeekdayBtn = $('.weekday-btn.active');

        // 获取输入值并处理空值情况
        const keyword = $searchInput.val()?.trim() || '';
        const type = $typeSelect.val();
        const hasActiveWeekday = $activeWeekdayBtn.length > 0;

        // 获取搜索按钮
        const $searchBtn = $(".search-btn");

        // 检查是否有任何有效搜索条件
        const hasSearchCriteria = keyword.length > 0 ||
            (type && type !== 'all' && type !== '') ||
            hasActiveWeekday;

        // 更新按钮状态
        $searchBtn.prop("disabled", !hasSearchCriteria);

        // 为表单元素添加/移除视觉反馈
        if (keyword.length > 0) {
            $searchInput.addClass('has-content');
        } else {
            $searchInput.removeClass('has-content');
        }

        if (type && type !== 'all' && type !== '') {
            $typeSelect.addClass('has-selection');
        } else {
            $typeSelect.removeClass('has-selection');
        }
    }

// 监听搜索条件变化事件
    $(document).ready(function() {
        // 输入框输入事件
        $("input[name='keyword']").on('input', updateSearchBtnStatus);

        // 下拉选择框变化事件
        $("select[name='type']").on('change', updateSearchBtnStatus);

        // 星期按钮点击事件
        $('.weekday-btn').on('click', updateSearchBtnStatus);

        // 初始化按钮状态
        updateSearchBtnStatus();

        // 添加表单提交处理
        $("#searchForm").on('submit', function(e) {
            // 如果按钮禁用状态下提交，阻止默认行为
            if ($(".search-btn").prop("disabled")) {
                e.preventDefault();
                return false;
            }
        });
    });
});