// ��ȫ�ֱ�����ȡbaseUrl
const baseUrl = window.BASE_URL;

$(function () {
    // ��ǰ�������ͣ�Ĭ��ȫ��
    let currentType = "all";

    // ҳ�����ʱ�����ղػ
    loadFav();

    // �����ǩ����¼�
    $(".favorite-tabs .favorite-tabs__btn").click(function () {
        $(this).addClass("favorite-tabs__btn--active").siblings().removeClass("favorite-tabs__btn--active");
        const type = $(this).data("type");

        // һ��ȡ�����ɱ����
        if (type === "cancel-all") {
            if (confirm("ȷ��Ҫһ��ȡ�����в��ɱ����Ļ��")) {
                cancelAllCannotEnroll();
            }
        } else {
            currentType = type;
            loadFav(null, currentType, 1, 100);
        }
    });

    // �����ղػ�б�
    function loadFav(cacheBuster, type = "all", page = 1, pageSize = 100) {
        let url = baseUrl + "/activity/favorites/list?type=" + type + "&page=" + page + "&pageSize=" + pageSize;
        if (cacheBuster) {
            url += "&_=" + cacheBuster;
        }

        $.get(url, function (result) {
            console.log("�����ղ��б�:", result);
            const activities = (result.data && result.data.activities) ? result.data.activities : [];
            renderFavList(activities);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error("�����ղ��б�ʧ��:", textStatus, errorThrown);
            alert("��ȡ�ղ��б�ʧ�ܣ���ˢ��ҳ��");
        });
    }

    // ��Ⱦ�ղػ�б�
    function renderFavList(activities) {
        if (!activities || activities.length === 0) {
            $("#favList").html(`
                <div class="favorite-grid__empty">
                    ����û���ղ��κλ
                </div>
            `);
            return;
        }

        $("#favList").empty();
        $.each(activities, function (i, act) {
            // �жϻ�Ƿ�ɱ���
            const now = new Date();
            const startTime = new Date(act.startTime);
            const endTime = new Date(act.endTime);
            const canEnroll = now < startTime;

            // ��ȡ���ڼ�
            const weekDays = ["����", "��һ", "�ܶ�", "����", "����", "����", "����"];
            const weekTag = weekDays[startTime.getDay()];

            const activityImgBaseUrl = baseUrl + "/static/img/activity/";
            // �������ƬHTML
            let html = `
                <div class="favorite-card ${canEnroll ? 'favorite-card--can-enroll' : 'favorite-card--cannot-enroll'}" data-id="${act.id}">
                    <div class="favorite-card__header">
                        <img src="${activityImgBaseUrl}${act.coverUrl}" alt="${act.name}" class="favorite-card__image" onerror="this.onerror=null;this.src='${activityImgBaseUrl}default.png';">
                        <span class="favorite-card__status ${canEnroll ? 'favorite-card__status--can-enroll' : 'favorite-card__status--cannot-enroll'}">
                            ${canEnroll ? '�ɱ���' : '���ɱ���'}
                        </span>
                        ${canEnroll ? '<span class="favorite-card__week-tag">' + weekTag + '</span>' : ''}
                    </div>
                    <div class="favorite-card__body">
                        <h3 class="favorite-card__title">${escapeHTML(act.name)}</h3>
                        <div class="favorite-card__info">
                            <span class="favorite-card__info-item"><i class="fa fa-calendar"></i> ${formatDate(act.startTime)} - ${formatTime(act.endTime)}</span>
                            <span class="favorite-card__info-item"><i class="fa fa-map-marker"></i> ${escapeHTML(act.location)}</span>
                            <span class="favorite-card__info-item"><i class="fa fa-users"></i> �ѱ���: ${act.enrolledCount ?? 0}/${act.capacity ?? 0}</span>
                            <span class="favorite-card__info-item"><i class="fa fa-clock-o"></i> ʱ��: ${act.duration ?? 0}Сʱ</span>
                            <span class="favorite-card__info-item"><i class="fa fa-user"></i> ��ϵ��: ${escapeHTML(act.contact)}</span>
                        </div>
                        <div class="favorite-card__desc">
                            ${escapeHTML(act.description)}
                        </div>
                    </div>
                    <div class="favorite-card__footer">
                        <div class="favorite-card__btn-group">
                            <button class="favorite-card__btn favorite-card__btn--cancel-fav">ȡ���ղ�</button>
            `;

            // ������Ա�������ӱ�����ť
            if (canEnroll) {
                html += `
                            <button class="favorite-card__btn favorite-card__btn--enroll">�����μ�</button>
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

    // ���¼���ʹ�ô�ͳ����ȷ��thisָ����ȷ��
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

    // ȡ���ղ�
    function cancelFavorite(id, btn) {
        console.log("ȡ���ղ�����:", id);

        // ��ֹ��ť�ڴ����б��ظ����
        if (btn.attr("disabled")) return;

        const originalText = btn.text();
        btn.text("������...").attr("disabled", true);

        $.post(baseUrl + "/activity/favorite/cancel", { id: id }, function (result) {
            console.log("ȡ���ղ���Ӧ:", result);
            btn.text(originalText).removeAttr("disabled");

            if (result.code === 200) {
                // ��UI�Ƴ���Ƭ
                const card = $("#favList .favorite-card[data-id='" + id + "']");
                if (card.length > 0) {
                    card.slideUp(300, function() {
                        $(this).remove();
                    });
                } else {
                    console.error("δ�ҵ�Ҫ�Ƴ��Ŀ�Ƭ:", id);
                }

                // �ӳټ�����ȷ��������ݸ���
                setTimeout(() => {
                    loadFav(Math.random(), currentType, 1, 100);
                }, 500);

                alert(result.data || "ȡ���ղسɹ�");
            } else {
                alert(result.msg || "ȡ���ղ�ʧ��");
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            btn.text(originalText).removeAttr("disabled");
            console.error("ȡ���ղ�����ʧ��:", textStatus, errorThrown);
            alert("��������ʧ�ܣ�������");
        });
    }

    function cancelAllCannotEnroll() {
        $.get(baseUrl + "/activity/favorites/list?type=cannot-enroll&page=1&pageSize=100", function (result) {
            const activities = (result.data && result.data.activities) ? result.data.activities : [];
            const cannotEnrollIds = activities.map(activity => activity.id);
            console.log(result);
            console.log(cannotEnrollIds);

            if (cannotEnrollIds.length === 0) {
                alert("û�в��ɱ����Ļ��Ҫȡ��");
                return;
            }

            $.ajax({
                url: baseUrl + "/activity/favorite/batchCancel",
                type: "POST",
                contentType: "application/json", // ��������
                data: JSON.stringify(cannotEnrollIds), // ֱ�ӷ������飬�� [1, 2, 3]
                success: function (result) {
                    console.log(result);
                    if (result.code===200) {
                        loadFav(null, currentType, 1, 100);
                        alert("�ѳɹ�ȡ��" + cannotEnrollIds.length + "�����ɱ�������ղ�");
                    } else {
                        alert(result.msg || "����ȡ��ʧ��");
                    }
                },
                error: function (xhr, status, error) {
                    alert("����ʧ�ܣ�" + error + " (״̬��: " + xhr.status + ")");
                }
            });
        });
    }

    // �����μӻ
    function enrollActivity(id, btn) {
        // ��ֹ��ť�ڴ����б��ظ����
        if (btn.attr("disabled")) return;

        const originalText = btn.text();
        btn.text("������...").attr("disabled", true);

        $.post(baseUrl + "/activity/enroll", { id: id }, function (result) {
            btn.text(originalText).removeAttr("disabled");

            if (result.success || result.code === 200) {
                alert("�����ɹ�");
                loadFav(null, currentType, 1, 100);
            } else {
                alert(result.msg || "����ʧ��");
            }
        }).fail(function() {
            btn.text(originalText).removeAttr("disabled");
            alert("��������ʧ�ܣ�������");
        });
    }

    // ��ʽ������
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.getFullYear() + "-" +
            padZero(date.getMonth() + 1) + "-" +
            padZero(date.getDate());
    }

    // ��ʽ��ʱ��
    function formatTime(dateStr) {
        const date = new Date(dateStr);
        return padZero(date.getHours()) + ":" +
            padZero(date.getMinutes());
    }

    // ���ֲ���
    function padZero(num) {
        return num < 10 ? "0" + num : num;
    }

    // ��XSSת��
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