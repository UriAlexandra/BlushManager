// Dashboard funkcionalitás
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    updateStats();
    renderDashboardProducts();
    renderDashboardProjects();
    renderDashboardTasks();
    renderRecentActivities();
}

// dashboard.js fájlban

function updateStats() {
    // Termék statisztika
    const totalProducts = storage.products.length;
    document.getElementById('totalProducts').textContent = totalProducts;
    updateTrend('products', totalProducts);
    
    // Aktív projektek statisztika
    const activeProjects = storage.getActiveProjectsCount();
    document.getElementById('activeProjects').textContent = activeProjects;
    updateTrend('projects', activeProjects);
    
    // Rendelések statisztika
    const activeOrders = storage.getActiveOrdersCount();
    document.getElementById('activeOrders').textContent = activeOrders;
    updateTrend('orders', activeOrders);
}

// Trend számítás
function updateTrend(type, currentValue) {
    const lastMonthStats = storage.getLastMonthStats();
    const lastMonthValue = lastMonthStats[type] || 0;
    
    const trendElement = document.getElementById(`${type}Trend`);
    const trendValueElement = document.getElementById(`${type}TrendValue`);
    const trendIcon = trendElement.querySelector('i');
    
    let trendPercentage = 0;
    if (lastMonthValue > 0) {
        trendPercentage = Math.round(((currentValue - lastMonthValue) / lastMonthValue) * 100);
    }
    
    // Trend ikon és szín beállítása
    if (trendPercentage > 0) {
        trendIcon.className = 'fas fa-arrow-up';
        trendElement.className = 'trend up';
    } else if (trendPercentage < 0) {
        trendIcon.className = 'fas fa-arrow-down';
        trendElement.className = 'trend down';
        trendPercentage = Math.abs(trendPercentage);
    } else {
        trendIcon.className = 'fas fa-minus';
        trendElement.className = 'trend neutral';
    }
    
    trendValueElement.textContent = `${trendPercentage}%`;
}

// Havi statisztikák mentése (meghívni havonta)
function saveMonthlyStats() {
    storage.saveCurrentMonthStats();
}

// Dashboard inicializálás frissítése
function initializeDashboard() {
    updateStats();
    renderDashboardProducts();
    renderDashboardProjects();
    renderDashboardTasks();
    renderRecentActivities();
    
    // Kezdeti statisztikák beállítása, ha még nincsenek
    if (!localStorage.getItem('currentMonthStats')) {
        storage.saveCurrentMonthStats();
    }
}

function renderDashboardProducts() {
    const list = document.getElementById('dashboardProducts');
    list.innerHTML = '';
    
    const latestProducts = storage.getLatestProducts(3);
    
    latestProducts.forEach(product => {
        const li = document.createElement('li');
        li.className = 'dashboard-item';
        li.innerHTML = `
            <div class="dashboard-item-info">
                <h4>${product.name}</h4>
                <p>${product.category} • ${product.price.toLocaleString('hu-HU')} Ft</p>
            </div>
            <div class="dashboard-item-actions">
                <button class="btn btn-secondary btn-sm" onclick="editProduct(${product.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-secondary btn-sm" onclick="deleteProduct(${product.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        list.appendChild(li);
    });
    
    if (latestProducts.length === 0) {
        list.innerHTML = `<li class="dashboard-item" style="justify-content: center; color: var(--gray);">Nincsenek termékek</li>`;
    }
}

function renderDashboardProjects() {
    const list = document.getElementById('dashboardProjects');
    list.innerHTML = '';
    
    const latestProjects = storage.getLatestProjects(3);
    
    latestProjects.forEach(project => {
        const li = document.createElement('li');
        li.className = 'dashboard-item';
        li.innerHTML = `
            <div class="dashboard-item-info">
                <h4>${project.name}</h4>
                <p>${project.status} • ${project.deadline || 'Nincs határidő'}</p>
            </div>
            <div class="dashboard-item-actions">
                <button class="btn btn-secondary btn-sm" onclick="editProject(${project.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-secondary btn-sm" onclick="deleteProject(${project.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        list.appendChild(li);
    });
    
    if (latestProjects.length === 0) {
        list.innerHTML = `<li class="dashboard-item" style="justify-content: center; color: var(--gray);">Nincsenek projektek</li>`;
    }
}

function renderDashboardTasks() {
    const list = document.getElementById('dashboardTasks');
    list.innerHTML = '';
    
    const latestTasks = storage.getLatestTasks(3);
    
    latestTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'dashboard-item';
        li.innerHTML = `
            <div class="dashboard-item-info">
                <h4>${task.title}</h4>
                <p>${task.assignee} • ${task.status}</p>
            </div>
            <div class="dashboard-item-actions">
                <button class="btn btn-secondary btn-sm" onclick="editTask(${task.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-secondary btn-sm" onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        list.appendChild(li);
    });
    
    if (latestTasks.length === 0) {
        list.innerHTML = `<li class="dashboard-item" style="justify-content: center; color: var(--gray);">Nincsenek feladatok</li>`;
    }
}

function renderRecentActivities() {
    const list = document.getElementById('recentActivities');
    list.innerHTML = '';
    
    const recentActivities = storage.getRecentActivities(4);
    
    recentActivities.forEach(activity => {
        const li = document.createElement('li');
        li.className = 'activity-item';
        li.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-${activity.icon || 'bell'}"></i>
            </div>
            <div class="activity-details">
                <h4>${activity.title}</h4>
                <p>${activity.description || ''}</p>
            </div>
            <div class="activity-time">${formatTime(activity.timestamp)}</div>
        `;
        list.appendChild(li);
    });
    
    if (recentActivities.length === 0) {
        list.innerHTML = `<li class="activity-item" style="justify-content: center; color: var(--gray);">Nincs tevékenység</li>`;
    }
}

function formatTime(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'épp most';
    if (minutes < 60) return `${minutes} perce`;
    if (hours < 24) return `${hours} órája`;
    if (days < 7) return `${days} napja`;
    return new Date(timestamp).toLocaleDateString('hu-HU');
}

function editProduct(id) {
    window.location.href = `products.html?edit=${id}`;
}

function deleteProduct(id) {
    if (confirm('Biztosan törölni szeretnéd ezt a terméket?')) {
        if (storage.deleteProduct(id)) {
            storage.addActivity({
                title: 'Termék törölve',
                description: `Termék ID: ${id}`,
                icon: 'trash'
            });
            showNotification('Termék sikeresen törölve!', 'success');
            initializeDashboard();
        }
    }
}

function editProject(id) {
    window.location.href = `projects.html?edit=${id}`;
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
            initializeDashboard();
        }
    }
}

function editTask(id) {
    window.location.href = `tasks.html?edit=${id}`;
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
            initializeDashboard();
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