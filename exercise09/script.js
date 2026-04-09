// =====================================================
// Exercise 09 - Data Manager JavaScript
// =====================================================

const API_URL = 'handler.php';
const form = document.getElementById('dataForm');
const tableBody = document.getElementById('tableBody');
const totalRecordsSpan = document.getElementById('totalRecords');
const lastUpdatedSpan = document.getElementById('lastUpdated');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const toastEl = document.getElementById('toast');

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
});

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    form.addEventListener('submit', handleFormSubmit);
    downloadBtn.addEventListener('click', downloadCSV);
    copyBtn.addEventListener('click', copyData);
    clearBtn.addEventListener('click', clearAllData);
}

// ========== FORM SUBMISSION ==========
async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(form);
    formData.append('action', 'submit');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showToast('✓ Data submitted successfully!', 'success');
            form.reset();
            loadData();
        } else {
            showToast('✗ ' + result.message, 'error');
        }
    } catch (error) {
        showToast('✗ Error submitting data: ' + error.message, 'error');
        console.error('Submit error:', error);
    }
}

// ========== LOAD DATA FROM DATABASE ==========
async function loadData() {
    try {
        const response = await fetch(`${API_URL}?action=fetch`);
        const result = await response.json();

        if (result.success && result.data) {
            renderTable(result.data);
            updateStats(result.count);
        } else {
            renderEmptyTable();
            updateStats(0);
        }
    } catch (error) {
        showToast('✗ Error loading data: ' + error.message, 'error');
        console.error('Load error:', error);
    }
}

// ========== RENDER TABLE ==========
function renderTable(data) {
    if (data.length === 0) {
        renderEmptyTable();
        return;
    }

    tableBody.innerHTML = data.map((row, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${escapeHtml(row.fullname)}</strong></td>
            <td><a href="mailto:${escapeHtml(row.email)}">${escapeHtml(row.email)}</a></td>
            <td>${escapeHtml(row.position)}</td>
            <td>${escapeHtml(row.skills || '-')}</td>
            <td>${escapeHtml(row.notes || '-').substring(0, 50)}${(row.notes || '').length > 50 ? '...' : ''}</td>
            <td>${formatDate(row.submitted_at)}</td>
            <td><button class="delete-btn" onclick="deleteRow(${row.id})">Delete</button></td>
        </tr>
    `).join('');
}

// ========== RENDER EMPTY TABLE ==========
function renderEmptyTable() {
    tableBody.innerHTML = `
        <tr class="empty-row">
            <td colspan="8">No data yet. Submit the form to get started!</td>
        </tr>
    `;
}

// ========== DELETE SINGLE ROW ==========
async function deleteRow(id) {
    if (!confirm('Are you sure you want to delete this record?')) {
        return;
    }

    try {
        const formData = new FormData();
        formData.append('action', 'delete');
        formData.append('id', id);

        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showToast('✓ Record deleted!', 'success');
            loadData();
        } else {
            showToast('✗ ' + result.message, 'error');
        }
    } catch (error) {
        showToast('✗ Error deleting record: ' + error.message, 'error');
        console.error('Delete error:', error);
    }
}

// ========== CLEAR ALL DATA ==========
async function clearAllData() {
    if (!confirm('⚠️ Are you sure you want to delete ALL records? This cannot be undone!')) {
        return;
    }

    if (!confirm('🔴 LAST WARNING: This will permanently delete all data. Continue?')) {
        return;
    }

    try {
        const formData = new FormData();
        formData.append('action', 'clear');

        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showToast('✓ All records cleared!', 'success');
            loadData();
        } else {
            showToast('✗ ' + result.message, 'error');
        }
    } catch (error) {
        showToast('✗ Error clearing data: ' + error.message, 'error');
        console.error('Clear error:', error);
    }
}

// ========== DOWNLOAD CSV ==========
function downloadCSV() {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const link = document.createElement('a');
    link.href = `${API_URL}?action=csv`;
    link.download = `data_${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ CSV downloaded!', 'success');
}

// ========== COPY DATA TO CLIPBOARD ==========
async function copyData() {
    try {
        const response = await fetch(`${API_URL}?action=copy`);
        const text = await response.text();
        
        await navigator.clipboard.writeText(text);
        showToast('✓ Data copied to clipboard!', 'success');
    } catch (error) {
        showToast('✗ Error copying data: ' + error.message, 'error');
        console.error('Copy error:', error);
    }
}

// ========== UPDATE STATISTICS ==========
function updateStats(count) {
    totalRecordsSpan.textContent = count;
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
    });
    lastUpdatedSpan.textContent = `Last updated: ${timeString}`;
}

// ========== TOAST NOTIFICATION ==========
function showToast(message, type = 'success') {
    toastEl.textContent = message;
    toastEl.className = `toast show ${type}`;

    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}

// ========== UTILITY: HTML ESCAPE ==========
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, char => map[char]);
}

// ========== UTILITY: FORMAT DATE ==========
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}
