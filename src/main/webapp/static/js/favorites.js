// 从全局变量获取baseUrl
const baseUrl = window.BASE_URL;

$(function () {
    // 当前分类类型，默认全部
    let currentType = "all";

    // 页面加载时加载收藏活动
    loadFav();

    // 分类标签点击事件
    $(".favorite-tabs .favorite-tabs__btn").click(function () {
        $(this).addClass("favorite-tabs__btn--active").siblings().removeClass("favorite-tabs__btn--active");
        const type = $(this).data("type");

        // 一键取消不可报名活动
        if (type === "cancel-all") {
            if (confirm("确定要一键取消所有不可报名的活动吗？")) {
                cancelAllCannotEnroll();
            }
        } else {
            currentType = type;
            loadFav(null, currentType, 1, 100);
        }
    });

    // 加载收藏活动列表
    function loadFav(cacheBuster, type = "all", page = 1, pageSize = 100) {
        let url = baseUrl + "/activity/favorites/list?type=" + type + "&page=" + page + "&pageSize=" + pageSize;
        if (cacheBuster) {
            url += "&_=" + cacheBuster;
        }

        $.get(url, function (result) {
            console.log("加载收藏列表:", result);
            const activities = (result.data && result.data.activities) ? result.data.activities : [];
            renderFavList(activities);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error("加载收藏列表失败:", textStatus, errorThrown);
            alert("获取收藏列表失败，请刷新页面");
        });
    }

    // 渲染收藏活动列表
    function renderFavList(activities) {
        if (!activities || activities.length === 0) {
            $("#favList").html(`
                <div class="favorite-grid__empty">
                    您还没有收藏任何活动
                </div>
            `);
            return;
        }

        $("#favList").empty();
        $.each(activities, function (i, act) {
            // 判断活动是否可报名
            const now = new Date();
            const startTime = new Date(act.startTime);
            const endTime = new Date(act.endTime);
            const canEnroll = now < startTime;

            // 获取星期几
            const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
            const weekTag = weekDays[startTime.getDay()];

            const activityImgBaseUrl = baseUrl + "/static/img/activity/";
            // 构建活动卡片HTML
            let html = `
                <div class="favorite-card ${canEnroll ? 'favorite-card--can-enroll' : 'favorite-card--cannot-enroll'}" data-id="${act.id}">
                    <div class="favorite-card__header">
                        <img src="${activityImgBaseUrl}${act.coverUrl}" alt="${act.name}" class="favorite-card__image" onerror="this.onerror=null;this.src='${activityImgBaseUrl}default.png';">
                        <span class="favorite-card__status ${canEnroll ? 'favorite-card__status--can-enroll' : 'favorite-card__status--cannot-enroll'}">
                            ${canEnroll ? '可报名' : '不可报名'}
                        </span>
                        ${canEnroll ? '<span class="favorite-card__week-tag">' + weekTag + '</span>' : ''}
                    </div>
                    <div class="favorite-card__body">
                        <h3 class="favorite-card__title">${escapeHTML(act.name)}</h3>
                        <div class="favorite-card__info">
                            <span class="favorite-card__info-item"><i class="fa fa-calendar"></i> ${formatDate(act.startTime)} - ${formatTime(act.endTime)}</span>
                            <span class="favorite-card__info-item"><i class="fa fa-map-marker"></i> ${escapeHTML(act.location)}</span>
                            <span class="favorite-card__info-item"><i class="fa fa-users"></i> 已报名: ${act.enrolledCount ?? 0}/${act.capacity ?? 0}</span>
                            <span class="favorite-card__info-item"><i class="fa fa-clock-o"></i> 时长: ${act.duration ?? 0}小时</span>
                            <span class="favorite-card__info-item"><i class="fa fa-user"></i> 联系人: ${escapeHTML(act.contact)}</span>
                        </div>
                        <div class="favorite-card__desc">
                            ${escapeHTML(act.description)}
                        </div>
                    </div>
                    <div class="favorite-card__footer">
                        <div class="favorite-card__btn-group">
                            <button class="favorite-card__btn favorite-card__btn--cancel-fav">取消收藏</button>
            `;

            // 如果可以报名，添加报名按钮
            if (canEnroll) {
                html += `
                            <button class="favorite-card__btn favorite-card__btn--enroll">报名参加</button>
                `;
            }

            html += `
                        </div>
                    </div>
                </div>
            `;

            $("#favList").append(html);
        });
    }

    // 绑定事件（使用传统函数确保this指向正确）
    $("#favList").on("click", ".favorite-card__btn--cancel-fav", function (e) {
        const btn = $(this);
        const id = btn.closest(".favorite-card").data("id");
        cancelFavorite(id, btn);
    });

    $("#favList").on("click", ".favorite-card__btn--enroll", function (e) {
        const btn = $(this);
        const id = btn.closest(".favorite-card").data("id");
        enrollActivity(id, btn);
    });

    // 取消收藏
    function cancelFavorite(id, btn) {
        console.log("取消收藏请求:", id);

        // 防止按钮在处理中被重复点击
        if (btn.attr("disabled")) return;

        const originalText = btn.text();
        btn.text("处理中...").attr("disabled", true);

        $.post(baseUrl + "/activity/favorite/cancel", { id: id }, function (result) {
            console.log("取消收藏响应:", result);
            btn.text(originalText).removeAttr("disabled");

            if (result.code === 200) {
                // 从UI移除卡片
                const card = $("#favList .favorite-card[data-id='" + id + "']");
                if (card.length > 0) {
                    card.slideUp(300, function() {
                        $(this).remove();
                    });
                } else {
                    console.error("未找到要移除的卡片:", id);
                }

                // 延迟加载以确保后端数据更新
                setTimeout(() => {
                    loadFav(Math.random(), currentType, 1, 100);
                }, 500);

                alert(result.data || "取消收藏成功");
            } else {
                alert(result.msg || "取消收藏失败");
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            btn.text(originalText).removeAttr("disabled");
            console.error("取消收藏请求失败:", textStatus, errorThrown);
            alert("网络请求失败，请重试");
        });
    }

    function cancelAllCannotEnroll() {
        $.get(baseUrl + "/activity/favorites/list?type=cannot-enroll&page=1&pageSize=100", function (result) {
            const activities = (result.data && result.data.activities) ? result.data.activities : [];
            const cannotEnrollIds = activities.map(activity => activity.id);
            console.log(result);
            console.log(cannotEnrollIds);

            if (cannotEnrollIds.length === 0) {
                alert("没有不可报名的活动需要取消");
                return;
            }

            $.ajax({
                url: baseUrl + "/activity/favorite/batchCancel",
                type: "POST",
                contentType: "application/json", // 必须设置
                data: JSON.stringify(cannotEnrollIds), // 直接发送数组，如 [1, 2, 3]
                success: function (result) {
                    console.log(result);
                    if (result.code===200) {
                        loadFav(null, currentType, 1, 100);
                        alert("已成功取消" + cannotEnrollIds.length + "个不可报名活动的收藏");
                    } else {
                        alert(result.msg || "批量取消失败");
                    }
                },
                error: function (xhr, status, error) {
                    alert("请求失败：" + error + " (状态码: " + xhr.status + ")");
                }
            });
        });
    }

    // 报名参加活动
    function enrollActivity(id, btn) {
        // 防止按钮在处理中被重复点击
        if (btn.attr("disabled")) return;

        const originalText = btn.text();
        btn.text("处理中...").attr("disabled", true);

        $.post(baseUrl + "/activity/enroll", { id: id }, function (result) {
            btn.text(originalText).removeAttr("disabled");

            if (result.success || result.code === 200) {
                alert("报名成功");
                loadFav(null, currentType, 1, 100);
            } else {
                alert(result.msg || "报名失败");
            }
        }).fail(function() {
            btn.text(originalText).removeAttr("disabled");
            alert("网络请求失败，请重试");
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

    // 防XSS转义
    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
});