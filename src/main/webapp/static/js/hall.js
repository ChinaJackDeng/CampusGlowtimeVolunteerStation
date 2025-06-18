// ��ȫ�ֱ�����ȡbaseUrl
const baseUrl = window.BASE_URL;
$.ajaxSetup({
    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
    headers: {
        "Accept": "application/json; charset=utf-8"
    }
});

$(function () {
    // Ĭ��ѡ������
    $('.weekday-btn[data-value="6"]').addClass('active');

    // ���ػ�б�
    function loadActivities(page) {
        // ��ʾ��������
        $("#activityList").html(`    
        <div class="empty" id="loadingIndicator">
            <i class="fa fa-spinner fa-spin"></i> ������...
        </div>
    `);

        // ��ȡѡ�е�����ֵ
        const selectedWeekday = $('.weekday-btn.active').data('value');
        let query = $("#searchForm").serialize();

        // ���δѡ�����ͣ��Ƴ����Ͳ���
        const selectedType = $("select[name='type']").val();
        if (!selectedType) {
            query = query.replace(/&?type=[^&]*/, '');
        }

        // ������ڲ�����Ĭ��������
        query += (selectedWeekday !== undefined) ? `&weekday=${selectedWeekday}` : '&weekday=6';
        query += "&page=" + (page || 1);

        $.get(baseUrl + "/activity/list", query)
            .done(function (result) {
                if (result.code !== 200) {
                    $("#activityList").html(`
                    <div class="empty">
                        <i class="fa fa-exclamation-triangle"></i> ${result.msg || "��ȡ��б�ʧ��"}
                    </div>
                `);
                    return;
                }


                /**
                 * @typedef{Object} Data
                 * @property{Object} activities
                 *
                 *
                 * ����Ͷ���
                 * @typedef {Object} Activity
                 * @property {number} id �ID
                 * @property {string} name �����
                 * @property {string} coverUrl ����URL
                 * @property {string} status �״̬
                 * @property {string} location �ص�
                 * @property {Date} startTime ��ʼʱ��
                 * @property {number} duration ʱ����Сʱ��
                 * @property {number} enrolledCount ��ǰ������
                 * @property {number} capacity ��ļ��������
                 */
                const data = result.data;
                if (!data.activities || data.activities.length === 0) {
                    $("#activityList").html(`
                    <div class="empty">
                        <i class="fa fa-search"></i> ���޷��������Ļ
                    </div>
                `);
                    $("#pagination").html("");
                    return;
                }

                const activityImgBaseUrl = baseUrl + "/static/img/activity/";
                // ����б���Ⱦ�
                $("#activityList").empty();
                $.each(data.activities, function (i, act) {

                    const joinDisabled = (act.status !== "������" || act.enrolledCount >= act.capacity)
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
                                ʱ��: ${formatDateTime(act.startTime)} 
                                �ص�: ${act.location} 
                                ʱ��: ${act.duration}h
                            </div>
                            <div class="card-actions">
                                <button class="btn-fav">�ղ�</button>
                                <button class="btn-join" ${joinDisabled}>
                                    ${act.status === "������" ? "����" : "�ѽ���"}
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
                    <i class="fa fa-exclamation-circle"></i> ����ʧ�ܣ�״̬�� ${jqXHR.status}
                </div>
            `);
            })
            .always(function () {
                // �Ƴ��������֣����ʹ����body��������֣�
                $(".loading-mask").remove();
            });
    }

    // ��Ⱦ��ҳ�ؼ�
    function renderPagination(current, total) {
        let html = "";
        for (let i = 1; i <= total; i++) {
            html += `<a class="page-link${i === current ? ' active' : ''}" data-p="${i}">${i}</a>`;
        }
        $("#pagination").html(`<div class="pagination">${html}</div>`);
    }

    // ʱ���ʽ������
    function formatDateTime(str) {
        if (!str) return "δ֪";
        const date = new Date(str);
        return date.toLocaleString(); // ת��Ϊ����ʱ���ʽ���磺2025/6/14 ����9:00��
    }

    // ��ʼ�����ص�һҳ
    loadActivities(1);

    // �������ύ�¼�
    $("#searchForm").on("submit", function (e) {
        e.preventDefault();
        const keyword = $("input[name='keyword']").val().trim();
        const type = $("select[name='type']").val();
        const weekday = $('.weekday-btn.active').data('value');

        if (!keyword && !type && !weekday) {
            alert("�����������ؼ��ʡ�ѡ�����ͻ�����");
            return;
        }

        loadActivities(1);
    });

    // ��ҳ����¼�
    $("#pagination").on("click", ".page-link", function () {
        loadActivities($(this).data("p"));
    });

    //�ղ�
    $("#activityList").on("click", ".btn-fav", function (e) {
        e.stopPropagation();
        const card = $(this).closest(".activity-card");
        const id = card.data("id");
        const btn = $(this);

        $.post(baseUrl + "/activity/favorite", { id: id })
            .done(function (result) {
                if (result.code === 200) {
                    alert(result.msg||"�ղسɹ�");
                } else {
                    alert(result.msg || "��Ҫȡ���ղ�����'�ҵ��ղ�'");
                }
            })
            .fail(function () {
                alert("����ʧ�ܣ�������");
            });
    });

    // ������ť����¼�
    $("#activityList").on("click", ".btn-join", function (e) {
        e.stopPropagation();
        const card = $(this).closest(".activity-card");
        const id = card.data("id");
        const btn = $(this);

        $.post(baseUrl + "/activity/enroll", { id: id })
            .done(function (result) {
                if (result.code === 200) {
                    alert(result.data); // ��ʾ"�����ɹ�"
                    loadActivities(); // ���¼����б�
                    // ���µ�ǰ��Ƭ�ı�����������ѡ�Ż���
                    const enrolledCount = result.data.enrolledCount; // �����˷��ظ��º������
                    card.find(".card-meta").find("[data-field='enrolled']").text(enrolledCount);
                } else {
                    alert(result.msg || "����ʧ�ܣ�����״̬������");
                }
            })
            .fail(function () {
                alert("��������ʧ��");
            });
    });

    // ģ̬��ر��¼�
    $("#detailModal").on("click", ".close-modal, .modal", function (e) {
        if (e.target.classList.contains('modal') || $(e.target).is('.close-modal')) {
            $("#detailModal").removeClass("active").hide();
        }
    });

    // ���ڰ�ť����¼�
    $('.weekday-btn').click(function () {
        $('.weekday-btn').removeClass('active');
        $(this).addClass('active');
        loadActivities(1); // �л����ں����¼���
    });

    // ���̻س�����������
    $("#searchForm input").on("keypress", function (e) {
        if (e.key === "Enter") {
            $("#searchForm").trigger("submit");
        }
    });
    /**
     * ����������ť״̬
     * ���ݹؼ������롢ɸѡ����ѡ�������ѡ��̬����/����������ť
     */
    function updateSearchBtnStatus() {
        // ��ȡ������Ԫ��
        const $searchInput = $("input[name='keyword']");
        const $typeSelect = $("select[name='type']");
        const $activeWeekdayBtn = $('.weekday-btn.active');

        // ��ȡ����ֵ�������ֵ���
        const keyword = $searchInput.val()?.trim() || '';
        const type = $typeSelect.val();
        const hasActiveWeekday = $activeWeekdayBtn.length > 0;

        // ��ȡ������ť
        const $searchBtn = $(".search-btn");

        // ����Ƿ����κ���Ч��������
        const hasSearchCriteria = keyword.length > 0 ||
            (type && type !== 'all' && type !== '') ||
            hasActiveWeekday;

        // ���°�ť״̬
        $searchBtn.prop("disabled", !hasSearchCriteria);

        // Ϊ��Ԫ�����/�Ƴ��Ӿ�����
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

// �������������仯�¼�
    $(document).ready(function() {
        // ����������¼�
        $("input[name='keyword']").on('input', updateSearchBtnStatus);

        // ����ѡ���仯�¼�
        $("select[name='type']").on('change', updateSearchBtnStatus);

        // ���ڰ�ť����¼�
        $('.weekday-btn').on('click', updateSearchBtnStatus);

        // ��ʼ����ť״̬
        updateSearchBtnStatus();

        // ��ӱ��ύ����
        $("#searchForm").on('submit', function(e) {
            // �����ť����״̬���ύ����ֹĬ����Ϊ
            if ($(".search-btn").prop("disabled")) {
                e.preventDefault();
                return false;
            }
        });
    });
});