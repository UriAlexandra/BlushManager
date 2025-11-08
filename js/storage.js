// Adattárolás kezelése
class StorageManager {
    constructor() {
        this.storageKey = 'blushManagerData';
        this.loadData();
    }

    loadData() {
        const savedData = localStorage.getItem(this.storageKey);
        if (savedData) {
            const data = JSON.parse(savedData);
            this.products = data.products || [];
            this.projects = data.projects || [];
            this.tasks = data.tasks || [];
            this.activities = data.activities || [];
        } else {
            this.products = [];
            this.projects = [];
            this.tasks = [];
            this.activities = [];
            this.saveData();
        }
    }

    saveData() {
        const data = {
            products: this.products,
            projects: this.projects,
            tasks: this.tasks,
            activities: this.activities
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    addProduct(product) {
        product.id = Date.now();
        this.products.push(product);
        this.saveData();
        return product;
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = { ...updatedProduct, id };
            this.saveData();
            return this.products[index];
        }
        return null;
    }

    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    addProject(project) {
        project.id = Date.now();
        this.projects.push(project);
        this.saveData();
        return project;
    }

    updateProject(id, updatedProject) {
        const index = this.projects.findIndex(p => p.id === id);
        if (index !== -1) {
            this.projects[index] = { ...updatedProject, id };
            this.saveData();
            return this.projects[index];
        }
        return null;
    }

    deleteProject(id) {
        const index = this.projects.findIndex(p => p.id === id);
        if (index !== -1) {
            this.projects.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    addTask(task) {
        task.id = Date.now();
        this.tasks.push(task);
        this.saveData();
        return task;
    }

    updateTask(id, updatedTask) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            this.tasks[index] = { ...updatedTask, id };
            this.saveData();
            return this.tasks[index];
        }
        return null;
    }

    deleteTask(id) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    addActivity(activity) {
        activity.id = Date.now();
        activity.timestamp = new Date();
        this.activities.push(activity);
        this.saveData();
        return activity;
    }

    getRecentActivities(limit = 5) {
        return this.activities
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }

    getLatestProducts(limit = 3) {
        return this.products
            .sort((a, b) => b.id - a.id)
            .slice(0, limit);
    }

    getLatestProjects(limit = 3) {
        return this.projects
            .sort((a, b) => b.id - a.id)
            .slice(0, limit);
    }

    getLatestTasks(limit = 3) {
        return this.tasks
            .sort((a, b) => b.id - a.id)
            .slice(0, limit);
    }

    // Statisztikai adatok kezelése - EZEKET AZ OSZTÁLYON BELÜLRE TETTEM
    getLastMonthStats() {
        return JSON.parse(localStorage.getItem('lastMonthStats')) || {
            products: 0,
            projects: 0,
            orders: 0
        };
    }

    saveCurrentMonthStats() {
        const currentStats = {
            products: this.products.length,
            projects: this.projects.filter(p => p.status === 'Aktív').length,
            orders: 28, // Statikus érték, mert nincs rendelés modell
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('currentMonthStats', JSON.stringify(currentStats));
    }

    updateLastMonthStats() {
        const currentStats = JSON.parse(localStorage.getItem('currentMonthStats'));
        if (currentStats) {
            localStorage.setItem('lastMonthStats', JSON.stringify(currentStats));
        }
    }

    // Aktív projektek számolása
    getActiveProjectsCount() {
        return this.projects.filter(project => project.status === 'Aktív').length;
    }

    // Aktív rendelések (statikus, mert nincs rendelés modell)
    getActiveOrdersCount() {
        return 28; // Vagy számold valahogy, ha van rendelés adat
    }
}

// Globális storage manager
const storage = new StorageManager();