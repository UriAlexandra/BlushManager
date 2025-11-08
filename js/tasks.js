// Feladatok kezelése
document.addEventListener('DOMContentLoaded', function() {
    initializeTasks();
});

function initializeTasks() {
    renderTasksTable();
    
    // Modal kezelés
    const newTaskBtn = document.getElementById('newTaskBtn');
    const taskModal = document.getElementById('taskModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelTask = document.getElementById('cancelTask');
    const taskForm = document.getElementById('taskForm');
    
    if (newTaskBtn) {
        newTaskBtn.addEventListener('click', () => {
            openTaskModal();
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closeTaskModal);
    }
    
    if (cancelTask) {
        cancelTask.addEventListener('click', closeTaskModal);
    }
    
    if (taskForm) {
        taskForm.addEventListener('submit', saveTask);
    }
    
    // URL paraméterek kezelése (szerkesztés)
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
        const task = storage.tasks.find(t => t.id == editId);
        if (task) {
            openTaskModal(task);
        }
    }
}

function openTaskModal(task = null) {
    const modal = document.getElementById('taskModal');
    document.getElementById('taskModalTitle').textContent = task ? 'Feladat szerkesztése' : 'Új feladat hozzáadása';
    document.getElementById('taskId').value = task ? task.id : '';
    document.getElementById('taskTitle').value = task ? task.title : '';
    document.getElementById('taskDescription').value = task ? task.description : '';
    document.getElementById('taskStatus').value = task ? task.status : 'Függőben';
    document.getElementById('taskAssignee').value = task ? task.assignee : 'Uri Alexandra';
    document.getElementById('taskDeadline').value = task ? task.deadline : '';
    
    // Projekt legördülő menü feltöltése
    const projectSelect = document.getElementById('taskProject');
    projectSelect.innerHTML = '<option value="">Válassz projektet</option>';
    storage.projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.name;
        option.textContent = project.name;
        if (task && task.project === project.name) {
            option.selected = true;
        }
        projectSelect.appendChild(option);
    });
    
    modal.style.display = 'flex';
}

function closeTaskModal() {
    const modal = document.getElementById('taskModal');
    modal.style.display = 'none';
    document.getElementById('taskForm').reset();
}

function saveTask(e) {
    e.preventDefault();
    
    const id = document.getElementById('taskId').value;
    const formData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        project: document.getElementById('taskProject').value,
        assignee: document.getElementById('taskAssignee').value,
        status: document.getElementById('taskStatus').value,
        deadline: document.getElementById('taskDeadline').value
    };

    if (!formData.title) {
        showNotification('Kérlek töltsd ki az összes kötelező mezőt!', 'error');
        return;
    }

    let savedTask;
    if (id) {
        savedTask = storage.updateTask(parseInt(id), formData);
        if (savedTask) {
            storage.addActivity({
                title: 'Feladat módosítva',
                description: `Feladat: ${formData.title}`,
                icon: 'edit'
            });
            showNotification('Feladat sikeresen módosítva!', 'success');
        }
    } else {
        savedTask = storage.addTask(formData);
        storage.addActivity({
            title: 'Új feladat hozzáadva',
            description: `Feladat: ${formData.title}`,
            icon: 'tasks'
        });
        showNotification('Feladat sikeresen hozzáadva!', 'success');
    }
    
    closeTaskModal();
    renderTasksTable();
}

function renderTasksTable() {
    const tbody = document.getElementById('tasksTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    storage.tasks.forEach(task => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div>
                    <div style="font-weight: 600;">${task.title}</div>
                    <div style="font-size: 12px; color: var(--gray);">${task.description || 'Nincs leírás'}</div>
                </div>
            </td>
            <td>${task.project || '-'}</td>
            <td>${task.assignee || '-'}</td>
            <td>${task.deadline || '-'}</td>
            <td>
                <span style="background: ${getStatusColor(task.status)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                    ${task.status}
                </span>
            </td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="openTaskModal(${JSON.stringify(task).replace(/"/g, '&quot;')})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-secondary btn-sm" onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    if (storage.tasks.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--gray);">Nincsenek feladatok</td></tr>`;
    }
}

function getStatusColor(status) {
    const colors = {
        'Függőben': '#6c757d',
        'Folyamatban': '#17a2b8',
        'Befejezve': '#28a745',
        'Aktív': '#28a745',
        'Tervezés': '#ffc107',
        'Befejezett': '#6c757d'
    };
    return colors[status] || '#6c757d';
}

function deleteTask(id) {
    if (confirm('Biztosan törölni szeretnéd ezt a feladatot?')) {
        if (storage.deleteTask(id)) {
            storage.addActivity({
                title: 'Feladat törölve',
                description: `Feladat ID: ${id}`,
                icon: 'trash'
            });
            showNotification('Feladat sikeresen törölve!', 'success');
            renderTasksTable();
        }
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}