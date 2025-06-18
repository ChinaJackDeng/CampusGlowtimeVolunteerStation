// ��ȫ�ֱ�����ȡbaseUrl
const baseUrl = window.BASE_URL;
$(function() {
    // ״̬������ʾ�ı���ӳ��
    const statusTextMap = {
        "1": "�ȴ����",
        "2": "���ͨ��",
        "3": "����ʧ��"
    };

    // ״̬��ʽ��ӳ��
    const statusClassMap = {
        "1": "status-pending",
        "2": "status-passed",
        "3": "status-rejected"
    };

    // ���ر����б�
    function loadEnrollments(status) {
        $.get(`${baseUrl}/activity/enrollments/list`, { status: status }, function(result) {
            console.log(result);
            if (result.code===200) {
                renderEnrollmentList(result.data, status);
            } else {
                $("#enrollList").html(`<div class='enrollments-empty'>${result.msg || '��ȡ����ʧ��'}</div>`);
            }
        }).fail(function(xhr, status, error) {
            console.error("���ر����б�ʧ��:", error);
            $("#enrollList").html("<div class='enrollments-empty'>����ʧ�ܣ�������</div>");
        });
    }

    // ��Ⱦ�����б�
    function renderEnrollmentList(activities, currentStatus) {
        $("#enrollList").empty();

        if (!activities || activities.length === 0) {
            $("#enrollList").html(`<div class='enrollments-empty'>����${statusTextMap[currentStatus]}�ı�����¼</div>`);
            return;
        }
        const showExplanation = currentStatus === 3;
        // �������
        let tableHtml = `
            <table class="enrollments-table">
                <thead>
                    <tr>
                        <th>�����</th>
                        <th>ʱ��</th>
                        <th>�ص�</th>
                        <th>��ϵ��</th>
                        <th>״̬</th>
                          ${showExplanation ? '<th>˵��</th>' : ''}
                        <th>����</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // ��ӱ������
        $.each(activities, function(i, activity) {
            // �������ڲ���ȡ���ڼ�
            const startTime = new Date(activity.startTime);
            const weekDays = ["����", "��һ", "�ܶ�", "����", "����", "����", "����"];
            const weekDay = weekDays[startTime.getDay()];

            // ��ʽ�����ں�ʱ��
            const formattedDate = formatDate(activity.startTime);
            const formattedTime = formatTime(activity.startTime) + " - " + formatTime(activity.endTime);

            // ����״̬��ǩ
            const statusTag = `<span class="status-tag ${statusClassMap[activity.enrollStatus]}">${statusTextMap[activity.enrollStatus]}</span>`;

            // ����������ť
            let actionHtml = "";
            if (activity.enrollStatus === 1) {
                // �ȴ����״̬����ʾȡ��������ť
                actionHtml = `<button class="btn btn-cancel" data-id="${activity.id}">ȡ������</button>`;
            }
            else if (activity.enrollStatus === 2||activity.enrollStatus===3) {
                // ͨ����ʧ��״̬����ʾ��ɾ������ť
                actionHtml = `<button class="btn btn-delete" data-id="${activity.id}">ɾ����¼</button>`;
            }
            // ��ӱ����
            tableHtml += `
                <tr>
                    <td>${activity.name}</td>
                    <td>${formattedDate} ${weekDay}<br>${formattedTime}</td>
                    <td>${activity.location}</td>
                    <td>${activity.contact}</td>
                    <td>${statusTag}</td>
                     ${showExplanation ? `<td>${activity.explanation || '��'}</td>` : ''}
                    <td>${actionHtml}</td>
                </tr>
            `;
        });

        // �������
        tableHtml += `
                </tbody>
            </table>
        `;

        $("#enrollList").append(tableHtml);

        // ��ȡ��������ť�¼�
        bindCancelEvents();

        // ��ɾ����ť�¼�
        bindDeleteEvents();
    }

    // ��ȡ��������ť�¼�
    function bindCancelEvents() {
        $("#enrollList").on("click", ".btn-cancel", function() {
            const id = $(this).data("id");
            if (confirm("ȷ��Ҫȡ���û�ı�����")) {
                cancelEnrollment(id);
            }
        });
    }

    // ��ɾ����ť�¼�
    function bindDeleteEvents() {
        $("#enrollList").on("click", ".btn-delete", function() {
            const id = $(this).data("id");
            if (confirm("ȷ��Ҫɾ���ñ�����¼�𣿴˲������ɻָ���")) {
                deleteEnrollment(id);
            }
        });
    }
    // ȡ������
    function cancelEnrollment(enrollmentId) {
        $.post(`${baseUrl}/activity/enrollments/cancel`, { id: enrollmentId }, function(result) {
            if (result.code===200) {
                alert("ȡ�������ɹ�");
                const currentStatus = $(".enrollments-tabs li.on").data("status");
                loadEnrollments(currentStatus);
            } else {
                alert(result.msg || "ȡ������ʧ�ܣ�������");
            }
        }).fail(function() {
            alert("�������ȡ������ʧ��");
        });
    }

    // ɾ��������¼
    function deleteEnrollment(enrollmentId) {
        $.post(`${baseUrl}/activity/enrollments/delete`, { id: enrollmentId }, function(result) {
            if (result.code === 200) {
                alert("ɾ����¼�ɹ�");
                const currentStatus = $(".enrollments-tabs li.on").data("status");
                loadEnrollments(currentStatus);
            } else {
                alert(result.msg || "ɾ����¼ʧ�ܣ�������");
            }
        }).fail(function() {
            alert("�������ɾ����¼ʧ��");
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

    // ��ʼ�����صȴ���˵ı���
    let initialStatus = $(".enrollments-tabs li.on").data("status");
    loadEnrollments(initialStatus);

    // ѡ�����¼�
    $(".enrollments-tabs li").click(function() {
        $(".enrollments-tabs li").removeClass("on");
        $(this).addClass("on");
        const status = $(this).data("status");
        loadEnrollments(status);
    });
});