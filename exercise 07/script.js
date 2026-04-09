// ========================================
// DATA MANAGEMENT SYSTEM - EXERCISE 07
// ========================================

// Global State
let dataStorage = [];
const STORAGE_KEY = 'exercise07_data';

// ========================================
// 1. INITIALIZE THE APPLICATION
// ========================================
function initApp() {
  // Load data from localStorage
  loadFromLocalStorage();
  
  // Inject the form
  injectForm();
  
  // Setup event listeners
  setupEventListeners();
  
  // Render initial table
  renderTable();
  
  // Update stats
  updateStats();
}

// ========================================
// 2. FORM INJECTION
// ========================================
function injectForm() {
  const formContainer = document.getElementById('form-container');
  
  formContainer.innerHTML = `
    <form id="dataForm">
      <h2>📝 Data Entry Form</h2>

      <div class="form-group">
        <label for="fullname">Full Name</label>
        <input type="text" id="fullname" name="fullname" placeholder="Sahashradh" required>
      </div>

      <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" id="email" name="email" placeholder="sahashradh@example.com" required>
      </div>

      <fieldset>
        <legend>📌 Position</legend>
        <label><input type="radio" name="position" value="Senior Developer" required> Senior Developer</label>
        <label><input type="radio" name="position" value="Junior Developer"> Junior Developer</label>
        <label><input type="radio" name="position" value="Full Stack Engineer"> Full Stack Engineer</label>
        <label><input type="radio" name="position" value="DevOps Engineer"> DevOps Engineer</label>
      </fieldset>

      <fieldset>
        <legend>🛠️ Technical Skills (Select all that apply)</legend>
        <label><input type="checkbox" name="skills" value="React"> React</label>
        <label><input type="checkbox" name="skills" value="Node.js"> Node.js</label>
        <label><input type="checkbox" name="skills" value="Python"> Python</label>
        <label><input type="checkbox" name="skills" value="Docker"> Docker</label>
        <label><input type="checkbox" name="skills" value="AWS"> AWS</label>
        <label><input type="checkbox" name="skills" value="JavaScript"> JavaScript</label>
      </fieldset>

      <div class="form-group">
        <label for="experience">Years of Experience</label>
        <select id="experience" name="experience" required>
          <option value="">-- Select --</option>
          <option value="0-2 years">0-2 years</option>
          <option value="2-5 years">2-5 years</option>
          <option value="5-10 years">5-10 years</option>
          <option value="10+ years">10+ years</option>
        </select>
      </div>

      <div class="form-group">
        <label for="notes">Additional Notes</label>
        <textarea id="notes" name="notes" placeholder="Tell us more about yourself..." rows="4"></textarea>
      </div>

      <button type="submit">✅ Submit & Store Data</button>
    </form>
  `;

  // Add form submission handler
  const form = document.getElementById('dataForm');
  form.addEventListener('submit', handleFormSubmit);
}

// ========================================
// 3. FORM SUBMISSION HANDLER
// ========================================
function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  
  const formObj = {
    id: generateId(),
    fullname: formData.get('fullname'),
    email: formData.get('email'),
    position: formData.get('position'),
    skills: getSelectedCheckboxes('skills'),
    experience: formData.get('experience'),
    notes: formData.get('notes'),
    timestamp: new Date().toLocaleString()
  };

  // Add to storage
  dataStorage.push(formObj);
  
  // Save to localStorage
  saveToLocalStorage();
  
  // Clear form
  form.reset();
  
  // Update UI
  renderTable();
  updateStats();
  
  // Show success message
  showToast('✅ Data submitted successfully!', 'success');
}

// ========================================
// 4. TABLE RENDERING
// ========================================
function renderTable() {
  const tableBody = document.getElementById('table-body');

  if (dataStorage.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-message">No data yet. Submit the form above to add records.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = dataStorage.map((item, index) => `
    <tr>
      <td>${escapeHtml(item.fullname)}</td>
      <td>${escapeHtml(item.email)}</td>
      <td>${escapeHtml(item.position)}</td>
      <td>${item.skills.join(', ') || 'None'}</td>
      <td>${escapeHtml(item.experience)}</td>
      <td>${escapeHtml(item.notes.substring(0, 30) + (item.notes.length > 30 ? '...' : ''))}</td>
      <td>${escapeHtml(item.timestamp)}</td>
      <td>
        <button class="btn-delete" onclick="deleteRow('${item.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

// ========================================
// 5. DELETE ROW FUNCTIONALITY
// ========================================
function deleteRow(id) {
  if (confirm('Are you sure you want to delete this record?')) {
    dataStorage = dataStorage.filter(item => item.id !== id);
    saveToLocalStorage();
    renderTable();
    updateStats();
    showToast('🗑️ Record deleted successfully!', 'success');
  }
}

// ========================================
// 6. CSV DOWNLOAD FUNCTIONALITY
// ========================================
function downloadCSV() {
  if (dataStorage.length === 0) {
    showToast('⚠️ No data to download!', 'warning');
    return;
  }

  const headers = ['Full Name', 'Email', 'Position', 'Skills', 'Experience', 'Notes', 'Submitted'];
  
  const csvContent = [
    headers.join(','),
    ...dataStorage.map(item => [
      `"${escapeForCSV(item.fullname)}"`,
      `"${escapeForCSV(item.email)}"`,
      `"${escapeForCSV(item.position)}"`,
      `"${escapeForCSV(item.skills.join('; '))}"`,
      `"${escapeForCSV(item.experience)}"`,
      `"${escapeForCSV(item.notes)}"`,
      `"${escapeForCSV(item.timestamp)}"`
    ].join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `data_export_${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('📥 CSV downloaded successfully!', 'success');
}

// ========================================
// 7. CLIPBOARD COPY FUNCTIONALITY
// ========================================
function copyToClipboard() {
  if (dataStorage.length === 0) {
    showToast('⚠️ No data to copy!', 'warning');
    return;
  }

  const headers = ['Full Name', 'Email', 'Position', 'Skills', 'Experience', 'Notes', 'Submitted'];
  
  const tsvContent = [
    headers.join('\t'),
    ...dataStorage.map(item => [
      item.fullname,
      item.email,
      item.position,
      item.skills.join('; '),
      item.experience,
      item.notes,
      item.timestamp
    ].join('\t'))
  ].join('\n');

  navigator.clipboard.writeText(tsvContent).then(() => {
    showToast('📋 Data copied to clipboard! Paste in Excel, Google Sheets, etc.', 'success');
  }).catch(err => {
    showToast('❌ Failed to copy to clipboard!', 'error');
    console.error('Clipboard error:', err);
  });
}

// ========================================
// 8. CLEAR ALL DATA FUNCTIONALITY
// ========================================
function clearAllData() {
  if (dataStorage.length === 0) {
    showToast('⚠️ No data to clear!', 'warning');
    return;
  }

  if (confirm(`Are you sure you want to delete all ${dataStorage.length} records? This cannot be undone.`)) {
    dataStorage = [];
    saveToLocalStorage();
    renderTable();
    updateStats();
    showToast('🗑️ All data cleared successfully!', 'success');
  }
}

// ========================================
// 9. UPDATE STATS
// ========================================
function updateStats() {
  const recordCount = document.getElementById('record-count');
  const lastUpdated = document.getElementById('last-updated');

  recordCount.textContent = dataStorage.length;
  
  if (dataStorage.length > 0) {
    lastUpdated.textContent = dataStorage[dataStorage.length - 1].timestamp;
  } else {
    lastUpdated.textContent = 'Never';
  }
}

// ========================================
// 10. LOCAL STORAGE MANAGEMENT
// ========================================
function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataStorage));
}

function loadFromLocalStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      dataStorage = JSON.parse(stored);
    } catch (e) {
      console.error('Error loading from localStorage:', e);
      dataStorage = [];
    }
  }
}

// ========================================
// 11. TOAST NOTIFICATION SYSTEM
// ========================================
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;

  // Remove the hide animation class if it exists
  setTimeout(() => {
    toast.classList.remove('hide');
  }, 100);

  // Auto-hide after 3 seconds
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => {
      toast.classList.remove('show', 'hide');
    }, 300);
  }, 3000);
}

// ========================================
// 12. EVENT LISTENERS SETUP
// ========================================
function setupEventListeners() {
  const csvBtn = document.getElementById('csv-download-btn');
  const copyBtn = document.getElementById('copy-clipboard-btn');
  const clearBtn = document.getElementById('clear-all-btn');

  csvBtn.addEventListener('click', downloadCSV);
  copyBtn.addEventListener('click', copyToClipboard);
  clearBtn.addEventListener('click', clearAllData);
}

// ========================================
// 13. UTILITY FUNCTIONS
// ========================================

function generateId() {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getSelectedCheckboxes(name) {
  const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
  return Array.from(checkboxes).map(cb => cb.value);
}

function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function escapeForCSV(text) {
  if (!text) return '';
  // Double any double quotes and escape problematic characters
  return text.replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, ' ');
}

// ========================================
// 14. START APPLICATION ON PAGE LOAD
// ========================================
document.addEventListener('DOMContentLoaded', initApp);
