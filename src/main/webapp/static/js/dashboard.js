// ȫ�ֱ���
const baseUrl = window.BASE_URL;

// �������غ���
function loadActivities() {
    // ���õ�������״̬
    setActiveNav('activity');

    fetch(`${baseUrl}/admin/activity/list`)
        .then(resp => resp.json())
        .then(data => renderActivityTable(data));
}
function renderActivityTable(activities) {
    console.log(activities);
    let html = `
        <div class="dashboard-table-container">
            <table class="dashboard-table">
                <thead>
                    <tr>
                        <th>ID</th>                    
                        <th>����</th>                                        
                        <th>�ص�</th>                                                              
                        <th>������</th>                       
                        <th>״̬</th>
                        <th>Ҫ��</th>
                        <th>��ϵ��ʽ</th>
                        <th>����</th>
                    </tr>
                </thead>
                <tbody>
    `;

    activities.forEach(act => {
        console.log(act)
        html += `
            <tr>
                <td>${act.id}</td>             
                <td><input class="dashboard-input" value="${act.name}" data-id="${act.id}" data-field="name" onchange="updateActivityField(this)"/></td>                             
                <td><input class="dashboard-input" value="${act.location}" data-id="${act.id}" data-field="location" onchange="updateActivityField(this)"/></td>
                <td><input class="dashboard-input" type="number" value="${act.capacity}" data-id="${act.id}" data-field="capacity" onchange="updateActivityField(this)"/></td>            
                <td><input class="dashboard-input" value="${act.status}" data-id="${act.id}" data-field="status" onchange="updateActivityField(this)"/></td>
                <td><textarea class="dashboard-textarea" data-id="${act.id}" data-field="requirement" onchange="updateActivityField(this)">${act.requirement}</textarea></td>
                <td><input class="dashboard-input" value="${act.contact}" data-id="${act.id}" data-field="contact" onchange="updateActivityField(this)"/></td>
                <td>
                    <button class="dashboard-button delete" onclick="deleteActivity(${act.id})">ɾ��</button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table></div>

        <div class="dashboard-form">
            <h4>�����»</h4>
            <form id="addActivityForm" onsubmit="addActivity(event)">
                <div class="form-group">
                    <label>�ͼƬ:</label>
                    <input type="file" accept="image/*" class="dashboard-input" name="coverFile" required onchange="previewImage(this)" />
                    <div class="image-preview" id="imagePreview">
                        <span>Ԥ��ͼƬ</span>
                    </div>
                </div>
                <div class="form-group">
                    <label>����:</label>
                    <input class="dashboard-input" name="name" required />
                </div>
                <div class="form-group">
                    <label>����:</label>
                    <input class="dashboard-input" name="type" required />
                </div>
                <div class="form-group">
                    <label>����:</label>
                    <textarea class="dashboard-textarea" name="description" required></textarea>
                </div>
                <div class="form-group">
                    <label>�ص�:</label>
                    <input class="dashboard-input" name="location" required />
                </div>
                <div class="form-group">
                    <label>��ʼʱ��:</label>
                    <input class="dashboard-input" name="startTime" type="datetime-local" required />
                </div>
                <div class="form-group">
                    <label>����ʱ��:</label>
                    <input class="dashboard-input" name="endTime" type="datetime-local" required />
                </div>
                <div class="form-group">
                    <label>ʱ��(Сʱ):</label>
                    <input class="dashboard-input" name="duration" type="number" step="0.5" required />
                </div>
                <div class="form-group">
                    <label>����:</label>
                    <input class="dashboard-input" name="capacity" type="number" required />
                </div>
                <div class="form-group">
                    <label>Ҫ��:</label>
                    <textarea class="dashboard-textarea" name="requirement" required></textarea>
                </div>
                <div class="form-group">
                    <label>��ϵ��ʽ:</label>
                    <input class="dashboard-input" name="contact" required />
                </div>
                <button type="submit" class="dashboard-button">����</button>
            </form>
        </div>
    `;

    document.getElementById('adminModule').innerHTML = html;
}
// ͼƬԤ������
function previewImage(input) {
    const preview = document.getElementById('imagePreview');
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Ԥ��ͼƬ">`;
        }
        reader.readAsDataURL(file);
    }
}


function updateActivityField(input) {
    fetch(`${baseUrl}/admin/activity/update`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: input.getAttribute('data-id'),
            field: input.getAttribute('data-field'),
            value: input.value
        })
    })
        .then(resp => resp.json())
        .then(data => {
            if (data.success) {
                showToast('�޸ĳɹ�');
            } else {
                showToast('�޸�ʧ��', 'error');
            }
        });
}

function deleteActivity(id) {
    if (!confirm('ȷ��ɾ���?')) return;

    fetch(`${baseUrl}/admin/activity/delete?id=` + id, { method: 'POST' })
        .then(resp => resp.json())
        .then(data => {
            if (data.success) {
                loadActivities();
                showToast('ɾ���ɹ�');
            } else {
                showToast('ɾ��ʧ��', 'error');
            }
        });
}
function addActivity(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    // ֱ�ӹ������ݣ������ļ���
    const activityData = {
        name: formData.get('name'),
        type: formData.get('type'),
        description: formData.get('description'),
        location: formData.get('location'),
        startTime: formData.get('startTime'),
        endTime: formData.get('endTime'),
        duration: formData.get('duration'),
        capacity: formData.get('capacity'),
        requirement: formData.get('requirement'),
        contact: formData.get('contact'),
        coverUrl: formData.get('coverFile').name  // ֱ��ʹ���ļ���
    };

    // ֱ�ӵ�����ӻ�ӿ�
    fetch(`${baseUrl}/admin/activity/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(activityData)
    })
        .then(resp => resp.json())
        .then(data => {
            if (data.code===200) {
                loadActivities();
                form.reset();
                showToast('��ӳɹ�');
            } else {
                showToast('���ʧ��', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('���ʧ��: ' + error.msg, 'error');
        });
}

// ���������غ���
function loadEnrollments() {
    // ���õ�������״̬
    setActiveNav('enroll');

    fetch(`${baseUrl}/admin/enroll/list`)
        .then(resp => resp.json())
        .then(data => renderEnrollmentTable(data));
}

// ���±�����˱����Ⱦ����
function renderEnrollmentTable(enrollments) {
    console.log(enrollments);
    let html = `
        <div class="dashboard-table-container">
            <table class="dashboard-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ѧ��</th>
                        <th>����</th>
                        <th>����</th>
                        <th>�</th>
                        <th>״̬</th>
                        <th>˵��</th>
                    </tr>
                </thead>
                <tbody>
    `;

    enrollments.forEach(e => {
        console.log(e);
        html += `
            <tr>
                <td>${e.id}</td>
                <td>${e.userNo}</td>
                <td>${e.userName}</td>
                <td>${e.userEmail}</td>
                <td>${e.activityName}</td>
                <td>
                    <select class="dashboard-select" data-id="${e.id}" onchange="updateEnrollmentStatus(this)">
                        <option value="1" ${e.status==1?'selected':''}>�����</option>
                        <option value="2" ${e.status==2?'selected':''}>ͨ��</option>
                        <option value="3" ${e.status==3?'selected':''}>�ܾ�</option>
                    </select>
                </td>
                <td>
                    <textarea class="dashboard-textarea" data-id="${e.id}" onchange="updateEnrollmentExplanation(this)">${e.explanation||''}</textarea>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table></div>`;

    document.getElementById('adminModule').innerHTML = html;
}

function updateEnrollmentStatus(select) {
    fetch(`${baseUrl}/admin/enroll/status`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: select.getAttribute('data-id'),
            status: select.value
        })
    })
        .then(resp => resp.json())
        .then(data => {
            if (data.success) {
                showToast('���״̬���޸�');
            } else {
                showToast('�޸�ʧ��', 'error');
            }
        });
}

// ��Ӹ���˵���ĺ���
function updateEnrollmentExplanation(textarea) {
    fetch(`${baseUrl}/admin/enroll/explanation`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: textarea.getAttribute('data-id'),
            explanation: textarea.value
        })
    })
        .then(resp => resp.json())
        .then(data => {
            if (data.success) {
                showToast('˵���Ѹ���');
            } else {
                showToast('����ʧ��', 'error');
            }
        });
}

// ��������
function setActiveNav(type) {
    document.querySelectorAll('.dashboard-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[href="#${type}"]`).classList.add('active');
}

function showToast(message, type = 'success') {
    // �򵥵���ʾʵ�֣������ʹ�ø����ӵ���ʾ��
    alert(message);
}

// ҳ�������ɺ��Զ����ػ�б�
document.addEventListener('DOMContentLoaded', () => {
    loadActivities();
});