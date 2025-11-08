// Projektek kezelése
document.addEventListener('DOMContentLoaded', function() {
    initializeProjects();
});

function initializeProjects() {
    renderProjectsGrid();
    
    // Modal kezelés
    const newProjectBtn = document.getElementById('newProjectBtn');
    const projectModal = document.getElementById('projectModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelProject = document.getElementById('cancelProject');
    const projectForm = document.getElementById('projectForm');
    
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', () => {
            openProjectModal();
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closeProjectModal);
    }
    
    if (cancelProject) {
        cancelProject.addEventListener('click', closeProjectModal);
    }
    
    if (projectForm) {
        projectForm.addEventListener('submit', saveProject);
    }
    
    // URL paraméterek kezelése (szerkesztés)
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
        const project = storage.projects.find(p => p.id == editId);
        if (project) {
            openProjectModal(project);
        }
    }
}

function openProjectModal(project = null) {
    const modal = document.getElementById('projectModal');
    document.getElementById('projectModalTitle').textContent = project ? 'Projekt szerkesztése' : 'Új projekt hozzáadása';
    document.getElementById('projectId').value = project ? project.id : '';
    document.getElementById('projectName').value = project ? project.name : '';
    document.getElementById('projectDescription').value = project ? project.description : '';
    document.getElementById('projectStatus').value = project ? project.status : 'Aktív';
    document.getElementById('projectDeadline').value = project ? project.deadline : '';
    
    modal.style.display = 'flex';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.style.display = 'none';
    document.getElementById('projectForm').reset();
}

function saveProject(e) {
    e.preventDefault();
    
    const id = document.getElementById('projectId').value;
    const formData = {
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDescription').value,
        status: document.getElementById('projectStatus').value,
        deadline: document.getElementById('projectDeadline').value
    };

    if (!formData.name) {
        showNotification('Kérlek töltsd ki az összes kötelező mezőt!', 'error');
        return;
    }

    let savedProject;
    if (id) {
        savedProject = storage.updateProject(parseInt(id), formData);
        if (savedProject) {
            storage.addActivity({
                title: 'Projekt módosítva',
                description: `Projekt: ${formData.name}`,
                icon: 'edit'
            });
            showNotification('Projekt sikeresen módosítva!', 'success');
        }
    } else {
        savedProject = storage.addProject(formData);
        storage.addActivity({
            title: 'Új projekt hozzáadva',
            description: `Projekt: ${formData.name}`,
            icon: 'project-diagram'
        });
        showNotification('Projekt sikeresen hozzáadva!', 'success');
    }
    
    closeProjectModal();
    renderProjectsGrid();
    
    // STATISZTIKÁK FRISSÍTÉSE - ÚJ SOR HOZZÁADVA
    if (typeof updateStats === 'function') {
        updateStats();
    }
}

function renderProjectsGrid() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    storage.projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <i class="fas fa-project-diagram fa-3x" style="color: white;"></i>
            </div>
            <div class="product-info">
                <span class="product-category">${project.status}</span>
                <h3 class="product-name">${project.name}</h3>
                <div class="product-price">${project.deadline || 'Nincs határidő'}</div>
                <div class="product-meta">
                    <span>${project.description || 'Nincs leírás'}</span>
                </div>
                <div class="form-actions" style="margin-top: 16px; justify-content: flex-start;">
                    <button class="btn btn-secondary btn-sm" onclick="openProjectModal(${JSON.stringify(project).replace(/"/g, '&quot;')})"><i class="fas fa-edit"></i> Szerkesztés</button>
                    <button class="btn btn-secondary btn-sm" onclick="deleteProject(${project.id})"><i class="fas fa-trash"></i> Törlés</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    
    if (storage.projects.length === 0) {
        grid.innerHTML = `<div style="text-align: center; color: var(--gray); grid-column: 1 / -1;">Nincsenek projektek</div>`;
    }
}

function deleteProject(id) {
    if (confirm('Biztosan törölni szeretnéd ezt a projektet?')) {
        if (storage.deleteProject(id)) {
            storage.addActivity({
                title: 'Projekt törölve',
                description: `Projekt ID: ${id}`,
                icon: 'trash'
            });
            showNotification('Projekt sikeresen törölve!', 'success');
            renderProjectsGrid();
            
            // STATISZTIKÁK FRISSÍTÉSE - ÚJ SOR HOZZÁADVA
            if (typeof updateStats === 'function') {
                updateStats();
            }
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