// Termékek kezelése
document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
});

function initializeProducts() {
    renderProductsTable();
    
    // Modal kezelés
    const newProductBtn = document.getElementById('newProductBtn');
    const productModal = document.getElementById('productModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelProduct = document.getElementById('cancelProduct');
    const productForm = document.getElementById('productForm');
    
    if (newProductBtn) {
        newProductBtn.addEventListener('click', () => {
            openProductModal();
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closeProductModal);
    }
    
    if (cancelProduct) {
        cancelProduct.addEventListener('click', closeProductModal);
    }
    
    if (productForm) {
        productForm.addEventListener('submit', saveProduct);
    }
    
    // URL paraméterek kezelése (szerkesztés)
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
        const product = storage.products.find(p => p.id == editId);
        if (product) {
            openProductModal(product);
        }
    }
}

function openProductModal(product = null) {
    const modal = document.getElementById('productModal');
    document.getElementById('productModalTitle').textContent = product ? 'Termék szerkesztése' : 'Új termék hozzáadása';
    document.getElementById('productId').value = product ? product.id : '';
    document.getElementById('productName').value = product ? product.name : '';
    document.getElementById('productCategory').value = product ? product.category : '';
    document.getElementById('productPrice').value = product ? product.price : '';
    document.getElementById('productStock').value = product ? product.stock : '';
    document.getElementById('productDescription').value = product ? product.description : '';
    
    // Projekt legördülő menü feltöltése
    const projectSelect = document.getElementById('productProject');
    projectSelect.innerHTML = '<option value="">Válassz projektet</option>';
    storage.projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.name;
        option.textContent = project.name;
        if (product && product.project === project.name) {
            option.selected = true;
        }
        projectSelect.appendChild(option);
    });
    
    modal.style.display = 'flex';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
    document.getElementById('productForm').reset();
}

function saveProduct(e) {
    e.preventDefault();
    
    const id = document.getElementById('productId').value;
    const formData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value,
        project: document.getElementById('productProject').value
    };

    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
        showNotification('Kérlek töltsd ki az összes kötelező mezőt!', 'error');
        return;
    }

    let savedProduct;
    if (id) {
        savedProduct = storage.updateProduct(parseInt(id), formData);
        if (savedProduct) {
            storage.addActivity({
                title: 'Termék módosítva',
                description: `Termék: ${formData.name}`,
                icon: 'edit'
            });
            showNotification('Termék sikeresen módosítva!', 'success');
        }
    } else {
        savedProduct = storage.addProduct(formData);
        storage.addActivity({
            title: 'Új termék hozzáadva',
            description: `Termék: ${formData.name}`,
            icon: 'box'
        });
        showNotification('Termék sikeresen hozzáadva!', 'success');
    }
    
    closeProductModal();
    renderProductsTable();
    
    // STATISZTIKÁK FRISSÍTÉSE - ÚJ SOR HOZZÁADVA
    if (typeof updateStats === 'function') {
        updateStats();
    }
}

function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    storage.products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: #f5f7fa; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-${getProductIcon(product.category)}"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600;">${product.name}</div>
                        <div style="font-size: 12px; color: var(--gray);">#PRD-${product.id}</div>
                    </div>
                </div>
            </td>
            <td>${product.category}</td>
            <td>${product.price.toLocaleString('hu-HU')} Ft</td>
            <td>${product.stock}</td>
            <td>${product.project || '-'}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="openProductModal(${JSON.stringify(product).replace(/"/g, '&quot;')})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-secondary btn-sm" onclick="deleteProduct(${product.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    if (storage.products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--gray);">Nincsenek termékek</td></tr>`;
    }
}

function getProductIcon(category) {
    const icons = {
        'Szépségápolás': 'palette',
        'Ruha': 'tshirt',
        'Kiegészítő': 'gem'
    };
    return icons[category] || 'box';
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
            renderProductsTable();
            
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