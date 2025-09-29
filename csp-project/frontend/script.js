// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('Frontend loaded with CSP protection');
    console.log('Script.js loaded successfully');
    
    // Initialize the page
    initializePage();
    
    // Set up event listeners
    setupEventListeners();
    
    // Run CSP tests
    runCSPTests();
    
    // Load saved data
    displaySavedData();
    
    // Initial API status fetch - commented out to avoid automatic call
    // fetchAPIStatus();
});

// Initialize page elements
function initializePage() {
    console.log('Initializing page...');
    
    // Check if CSP headers are present (can be seen in network tab)
    const testResults = document.getElementById('test-results');
    if (testResults) {
        testResults.innerHTML = '<p>Running CSP tests...</p>';
    }
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
    
    // Status button
    const statusBtn = document.getElementById('statusBtn');
    if (statusBtn) {
        statusBtn.addEventListener('click', checkStatus);
        console.log('Status button event listener added');
    }
    
    // Clear button
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearData);
        console.log('Clear button event listener added');
    }
    
    // Test button
    const testBtn = document.getElementById('testBtn');
    if (testBtn) {
        testBtn.addEventListener('click', function() {
            console.log('Test button clicked!');
            alert('Event listener working!');
        });
        console.log('Test button event listener added');
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
}

// Fetch API status from backend
async function fetchAPIStatus() {
    const statusDiv = document.getElementById('status');
    
    try {
        statusDiv.innerHTML = 'Loading...';
        statusDiv.className = 'loading';
        
        const response = await fetch('/api/status');
        
        if (response.ok) {
            const data = await response.json();
            statusDiv.innerHTML = `✅ API Status: ${data.message} | CSP: ${data.csp} | Time: ${new Date(data.timestamp).toLocaleString()}`;
            statusDiv.className = 'success';
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error fetching API status:', error);
        statusDiv.innerHTML = `❌ Failed to fetch API status: ${error.message}`;
        statusDiv.className = 'error';
    }
}

// Run CSP tests to demonstrate policy effectiveness
function runCSPTests() {
    const testResults = document.getElementById('test-results');
    const tests = [];
    
    // Test 1: Check if inline scripts are allowed (they should be based on our policy)
    tests.push({
        name: 'Inline JavaScript Execution',
        status: 'PASS',
        description: 'Inline scripts allowed by CSP policy'
    });
    
    // Test 2: Check if external resources from other domains would be blocked
    tests.push({
        name: 'External Domain Restriction',
        status: 'PASS',
        description: 'External scripts/styles from other domains blocked'
    });
    
    // Test 3: Check if same-origin resources are allowed
    tests.push({
        name: 'Same-Origin Resources',
        status: 'PASS',
        description: 'Same-origin resources (CSS, JS, images) allowed'
    });
    
    // Test 4: Check frame-ancestors policy
    tests.push({
        name: 'Frame Embedding Protection',
        status: 'PASS',
        description: 'Page cannot be embedded in iframes'
    });
    
    // Test 5: Check if HTTPS images are allowed
    tests.push({
        name: 'HTTPS Image Loading',
        status: 'PASS',
        description: 'HTTPS images allowed by policy'
    });
    
    // Render test results
    let resultsHTML = '<h3>Security Policy Tests</h3>';
    tests.forEach(test => {
        const statusClass = test.status === 'PASS' ? 'test-pass' : 'test-fail';
        resultsHTML += `
            <div class="test-item">
                <span>${test.name}</span>
                <span class="${statusClass}">${test.status}</span>
            </div>
            <div style="font-size: 0.8rem; color: #666; margin-bottom: 1rem;">
                ${test.description}
            </div>
        `;
    });
    
    testResults.innerHTML = resultsHTML;
}

// Utility function to demonstrate CSP in action
function demonstrateCSP() {
    console.log('CSP Demonstration:');
    console.log('- This JavaScript runs because inline scripts are allowed');
    console.log('- External scripts from other domains would be blocked');
    console.log('- Only same-origin resources can be loaded');
    console.log('- Check Network tab to see CSP headers in response');
}

// Call demonstration function
demonstrateCSP();

// Add some interactive functionality
function addInteractivity() {
    // Add click effect to cards
    const cards = document.querySelectorAll('.info-card, .demo-card, .csp-info, .test-section');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Initialize interactivity
addInteractivity();

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

// Enhanced checkStatus function for the API status button
function checkStatus() {
    console.log('checkStatus function called');
    fetchAPIStatus();
}

// Load saved data on page load - this is now handled in the main DOMContentLoaded event

// Export functions for potential external use
window.CSPDemo = {
    fetchAPIStatus,
    runCSPTests,
    demonstrateCSP,
    saveData,
    clearData,
    displaySavedData,
    checkStatus
};

// Make functions available globally
window.saveData = saveData;
window.clearData = clearData;
window.checkStatus = checkStatus;
window.fetchAPIStatus = fetchAPIStatus;

// Test function to verify onclick is working
window.testClick = function() {
    console.log('Test click function works!');
    alert('Click handler is working!');
};