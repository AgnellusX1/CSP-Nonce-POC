// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('Frontend loaded with CSP protection');
    console.log('Script.js loaded successfully');
    
    // Initialize the page
    initializePage();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load saved data
    displaySavedData();
});

// Initialize page elements
function initializePage() {
    console.log('Initializing page...');
}

// Setup event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Save button
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveData);
        console.log('Save button event listener added');
    }
    
    // Clear button
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearData);
        console.log('Clear button event listener added');
    }
    
    // Add enter key support for input
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                saveData();
            }
        });
        console.log('Enter key listener added to input');
    }
    
    // Reflected XSS test button
    const reflectBtn = document.getElementById('reflectBtn');
    if (reflectBtn) {
        reflectBtn.addEventListener('click', testReflectedXSS);
        console.log('Reflect button event listener added');
    }
    
    // Add enter key support for reflection inputs
    const reflectInput = document.getElementById('reflectInput');
    const nameInput = document.getElementById('nameInput');
    if (reflectInput && nameInput) {
        reflectInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                testReflectedXSS();
            }
        });
        nameInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                testReflectedXSS();
            }
        });
        console.log('Enter key listeners added to reflection inputs');
    }
}

// Data Storage Functions
function saveData() {
    console.log('saveData function called');
    const input = document.getElementById('userInput');
    const savedValuesDiv = document.getElementById('savedValues');
    const statusDiv = document.getElementById('status');
    
    console.log('Elements found:', {input, savedValuesDiv, statusDiv});
    
    const value = input.value.trim();
    
    if (!value) {
        showStatus('Please enter some text to save.', 'error');
        return;
    }
    
    try {
        // Get existing saved data
        let savedData = JSON.parse(localStorage.getItem('cspDemoData') || '[]');
        
        // Add new data with timestamp
        const newItem = {
            id: Date.now(),
            text: value,
            timestamp: new Date().toLocaleString()
        };
        
        savedData.push(newItem);
        
        // Save to localStorage
        localStorage.setItem('cspDemoData', JSON.stringify(savedData));
        
        // Clear input
        input.value = '';
        
        // Update display
        displaySavedData();
        showStatus('Data saved successfully!', 'success');
        
        console.log('Data saved:', newItem);
        
    } catch (error) {
        console.error('Error saving data:', error);
        showStatus('Error saving data. Please try again.', 'error');
    }
}

function displaySavedData() {
    const savedValuesDiv = document.getElementById('savedValues');
    
    try {
        const savedData = JSON.parse(localStorage.getItem('cspDemoData') || '[]');
        
        if (savedData.length === 0) {
            savedValuesDiv.innerHTML = 'No data saved yet';
            return;
        }
        
        // Sort by timestamp (newest first)
        savedData.sort((a, b) => b.id - a.id);
        
        const html = savedData.map(item => `
            <div class="saved-item">
                <span>${item.text}</span>
                <span class="timestamp">${item.timestamp}</span>
            </div>
        `).join('');
        
        savedValuesDiv.innerHTML = html;
        
    } catch (error) {
        console.error('Error displaying saved data:', error);
        savedValuesDiv.innerHTML = 'Error loading saved data';
    }
}

function clearData() {
    console.log('clearData function called');
    if (confirm('Are you sure you want to clear all saved data?')) {
        try {
            localStorage.removeItem('cspDemoData');
            displaySavedData();
            showStatus('All data cleared successfully!', 'success');
            console.log('All data cleared');
        } catch (error) {
            console.error('Error clearing data:', error);
            showStatus('Error clearing data. Please try again.', 'error');
        }
    }
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = type;
    
    // Clear status after 3 seconds
    setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = '';
    }, 3000);
}

// Make functions available globally
window.saveData = saveData;
window.clearData = clearData;

// Reflected XSS Testing Function
function testReflectedXSS() {
    console.log('testReflectedXSS function called');
    
    const reflectInput = document.getElementById('reflectInput');
    const nameInput = document.getElementById('nameInput');
    
    if (!reflectInput || !nameInput) {
        console.error('Reflection input elements not found');
        return;
    }
    
    const inputValue = reflectInput.value.trim();
    const nameValue = nameInput.value.trim();
    
    if (!inputValue) {
        alert('Please enter some text to reflect');
        return;
    }
    
    // Construct URL with query parameters for reflected XSS test
    const baseUrl = window.location.origin + '/reflect';
    const params = new URLSearchParams({
        input: inputValue,
        name: nameValue || 'Anonymous'
    });
    
    const testUrl = `${baseUrl}?${params.toString()}`;
    
    console.log('Opening reflected XSS test URL:', testUrl);
    
    // Open in new tab/window to test reflection
    window.open(testUrl, '_blank');
    
    // Show confirmation message
    alert(`Reflected XSS test initiated!\n\nInput: "${inputValue}"\nName: "${nameValue || 'Anonymous'}"\n\nCheck the new tab to see if the content is reflected without sanitization.`);
}

// Make reflected XSS function available globally
window.testReflectedXSS = testReflectedXSS;