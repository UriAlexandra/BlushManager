// Havonta egyszer futó statisztika frissítés
function checkAndUpdateMonthlyStats() {
    const lastUpdate = localStorage.getItem('lastMonthlyUpdate');
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    if (!lastUpdate) {
        // Első futtatás
        localStorage.setItem('lastMonthlyUpdate', JSON.stringify({
            month: currentMonth,
            year: currentYear
        }));
        return;
    }
    
    const lastUpdateData = JSON.parse(lastUpdate);
    const lastMonth = lastUpdateData.month;
    const lastYear = lastUpdateData.year;
    
    // Ha új hónap van
    if (currentYear > lastYear || (currentYear === lastYear && currentMonth > lastMonth)) {
        // Múlt havi statisztikák mentése
        storage.updateLastMonthStats();
        // Új havi statisztikák inicializálása
        storage.saveCurrentMonthStats();
        
        // Utolsó frissítés dátuma mentése
        localStorage.setItem('lastMonthlyUpdate', JSON.stringify({
            month: currentMonth,
            year: currentYear
        }));
    }
}

// Oldal betöltésekor ellenőrizzük
document.addEventListener('DOMContentLoaded', function() {
    checkAndUpdateMonthlyStats();
});