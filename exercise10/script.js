// Scientific Calculator Frontend - JavaScript
// This file handles the UI and communicates with the PHP backend

let display = document.getElementById('display');
let history = document.getElementById('history');

// Initialize - when page loads
document.addEventListener('DOMContentLoaded', () => {
    setupButtonListeners();
});

// Setup all button click listeners
function setupButtonListeners() {
    const allButtons = document.querySelectorAll('.btn');
    
    allButtons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });
}

// Handle button clicks
function handleButtonClick(e) {
    const btn = e.target;
    
    // Check if it's an action button (clear, delete, equals)
    if (btn.hasAttribute('data-action')) {
        const action = btn.getAttribute('data-action');
        handleAction(action);
    }
    // Otherwise it's a value button (number, operator, function)
    else if (btn.hasAttribute('data-val')) {
        const value = btn.getAttribute('data-val');
        appendToDisplay(value);
    }
}

// Handle action buttons
function handleAction(action) {
    if (action === 'clear') {
        // AC - All Clear
        display.textContent = '0';
        history.textContent = '';
    } 
    else if (action === 'delete') {
        // DEL - Delete last character
        let current = display.textContent;
        if (current.length > 1) {
            display.textContent = current.slice(0, -1);
        } else {
            display.textContent = '0';
        }
    } 
    else if (action === 'equals') {
        // = - Calculate result
        calculateResult();
    }
}

// Append value to display
function appendToDisplay(value) {
    let current = display.textContent;
    
    // Replace 0 with the new value (unless it's a decimal)
    if (current === '0' && value !== '.') {
        display.textContent = value;
    } else {
        display.textContent += value;
    }
}

// Calculate result by sending to PHP backend
async function calculateResult() {
    const expression = display.textContent;
    
    // Don't calculate if it's just "0"
    if (expression === '0') return;
    
    try {
        // Send to PHP backend via POST
        const response = await fetch('index.php?calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ expression: expression })
        });
        
        const data = await response.json();
        
        if (data.error) {
            // Show error
            display.textContent = 'Error: ' + data.error;
            history.textContent = expression;
        } else {
            // Show result
            history.textContent = expression;
            display.textContent = formatResult(data.result);
        }
    } catch (error) {
        display.textContent = 'Error';
        console.error('Calculation error:', error);
    }
}

// Format the result nicely
function formatResult(result) {
    // Round to 10 decimal places to avoid floating point errors
    if (typeof result === 'number') {
        return Math.round(result * 10000000000) / 10000000000;
    }
    return result;
}
