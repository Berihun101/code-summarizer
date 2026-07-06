// ============================================================
//  CONFIGURATION
// ============================================================
// Change this to your API URL when deployed
const API_URL = 'http://localhost:8000';

// ============================================================
//  DOM REFS
// ============================================================
const codeInput = document.getElementById('codeInput');
const summarizeBtn = document.getElementById('summarizeBtn');
const clearBtn = document.getElementById('clearBtn');
const exampleBtn = document.getElementById('exampleBtn');
const resultBox = document.getElementById('resultBox');
const statusDiv = document.getElementById('status');
const statusBadge = document.getElementById('statusBadge');

// ============================================================
//  HELPERS
// ============================================================
function setStatus(message, type = 'loading') {
    statusDiv.className = `status ${type}`;
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';
}

function hideStatus() {
    statusDiv.style.display = 'none';
}

function setLoading(isLoading) {
    if (isLoading) {
        summarizeBtn.disabled = true;
        document.getElementById('btnIcon').innerHTML = '<span class="spinner"></span>';
        document.getElementById('btnText').textContent = 'Summarizing...';
    } else {
        summarizeBtn.disabled = false;
        document.getElementById('btnIcon').textContent = '✨';
        document.getElementById('btnText').textContent = 'Summarize';
    }
}

function displayResult(text) {
    if (text && text.trim()) {
        resultBox.innerHTML = text.trim();
    } else {
        resultBox.innerHTML = '<span class="placeholder">No summary generated.</span>';
    }
}

// ============================================================
//  API CALLS
// ============================================================
async function summarizeCode(code) {
    if (!code || !code.trim()) {
        setStatus('Please enter some code to summarize.', 'error');
        return;
    }

    hideStatus();
    setLoading(true);
    displayResult('⏳ Generating summary...');

    try {
        const response = await fetch(`${API_URL}/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code.trim() }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP ${response.status}`);
        }

        const data = await response.json();
        displayResult(data.summary);
        setStatus('✅ Summary generated successfully!', 'success');
        setTimeout(hideStatus, 3000);

    } catch (error) {
        console.error('Summarize error:', error);
        displayResult('❌ Error: ' + error.message);
        setStatus('Error: ' + error.message, 'error');
    } finally {
        setLoading(false);
    }
}

async function checkHealth() {
    setStatus('Checking API health...', 'loading');
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        if (data.status === 'ok' && data.model_loaded) {
            statusBadge.className = 'badge';
            statusBadge.textContent = '● Online';
            setStatus('✅ API is healthy! Model is loaded.', 'success');
        } else if (data.status === 'ok' && !data.model_loaded) {
            statusBadge.className = 'badge offline';
            statusBadge.textContent = '● Model Not Loaded';
            setStatus('⚠️ API is running but model is not loaded.', 'error');
        } else {
            statusBadge.className = 'badge offline';
            statusBadge.textContent = '● Offline';
            setStatus('⚠️ API is running but returned unexpected status.', 'error');
        }
        setTimeout(hideStatus, 3000);
    } catch (error) {
        console.error('Health check error:', error);
        statusBadge.className = 'badge offline';
        statusBadge.textContent = '● Offline';
        setStatus('❌ Cannot connect to API. Make sure the server is running.', 'error');
    }
}

// ============================================================
//  EVENT LISTENERS
// ============================================================
// Summarize button
summarizeBtn.addEventListener('click', () => {
    summarizeCode(codeInput.value);
});

// Ctrl+Enter shortcut
codeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        summarizeCode(codeInput.value);
    }
});

// Clear button
clearBtn.addEventListener('click', () => {
    codeInput.value = '';
    displayResult('Your summary will appear here...');
    hideStatus();
});

// Example button - loads a random example
exampleBtn.addEventListener('click', () => {
    const examples = [
        'def add(a, b):\n    return a + b',
        'def multiply(x, y):\n    return x * y',
        'def is_even(n):\n    return n % 2 == 0',
        'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n-1)',
        'def reverse_string(s):\n    return s[::-1]',
        'def square(n):\n    return n * n',
        'def get_length(arr):\n    return len(arr)',
    ];
    const random = examples[Math.floor(Math.random() * examples.length)];
    codeInput.value = random;
    displayResult('📝 Try clicking "Summarize" to see the result.');
    hideStatus();
});

// Example chips
document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
        codeInput.value = chip.dataset.code;
        displayResult('📝 Click "Summarize" to generate summary.');
        hideStatus();
    });
});

// ============================================================
//  AUTO-RUN ON PAGE LOAD
// ============================================================
// Check health on load
setTimeout(checkHealth, 500);

console.log('🚀 Code Summarization frontend loaded!');
console.log(`📡 API URL: ${API_URL}`);
console.log('💡 Press Ctrl+Enter to summarize.');