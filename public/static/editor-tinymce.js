// Global variables
let tinymceEditor;
let token = localStorage.getItem('poetry_token');
let currentUser = null;
let currentLanguage = 'en';
let transliterationControl = null;
const API_BASE = '/api';

// Initialize Google Input Tools
function initGoogleInputTools() {
    if (typeof google !== 'undefined' && google.load) {
        google.load("elements", "1", {
            packages: "transliteration",
            callback: function() {
                console.log('Google Transliteration loaded successfully');
            }
        });
    } else {
        console.warn('Google Input Tools not loaded. Install browser extension for best experience.');
    }
}

// Initialize TinyMCE editor
function initTinyMCE() {
    if (tinymceEditor) {
        tinymce.remove(tinymceEditor);
    }
    
    tinymce.init({
        selector: '#poemContent',
        height: 500,
        menubar: false,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
            'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'table', 'help', 'wordcount', 'directionality'
        ],
        toolbar: 'undo redo | blocks | ' +
            'bold italic underline | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'ltr rtl | removeformat | code fullscreen | help',
        content_style: `
            body { 
                font-family: 'Noto Sans', 'Noto Sans Devanagari', sans-serif;
                font-size: 16px;
                line-height: 1.8;
                padding: 10px;
            }
            body.lang-hi, body.lang-mr {
                font-family: 'Noto Sans Devanagari', 'Noto Sans', sans-serif;
            }
        `,
        setup: function(editor) {
            tinymceEditor = editor;
            
            editor.on('init', function() {
                // Set initial language class
                updateEditorContentLanguage();
            });
        },
        font_size_formats: '12pt 14pt 16pt 18pt 20pt 24pt',
        line_height_formats: '1 1.2 1.4 1.6 1.8 2',
        block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3',
    });
}

// Update editor content language class
function updateEditorContentLanguage() {
    if (tinymceEditor) {
        const lang = document.getElementById('poemLanguage').value;
        const body = tinymceEditor.getBody();
        body.className = 'lang-' + lang;
    }
}

// Enable Hindi keyboard using Google Input Tools
function enableHindiKeyboard() {
    currentLanguage = 'hi';
    document.getElementById('poemLanguage').value = 'hi';
    updateEditorLanguage();
    showLanguageIndicator('हिंदी (Hindi) - Type in English, get Hindi!');
    
    // Initialize Google Transliteration
    if (typeof google !== 'undefined' && google.elements && google.elements.transliteration) {
        if (transliterationControl) {
            transliterationControl.dispose();
        }
        
        var options = {
            sourceLanguage: google.elements.transliteration.LanguageCode.ENGLISH,
            destinationLanguage: [google.elements.transliteration.LanguageCode.HINDI],
            shortcutKey: 'ctrl+g',
            transliterationEnabled: true
        };
        
        transliterationControl = new google.elements.transliteration.TransliterationControl(options);
        
        // Make TinyMCE content editable
        if (tinymceEditor) {
            var editorIframe = tinymceEditor.getDoc();
            transliterationControl.makeTransliteratable([editorIframe.body]);
            console.log('Hindi transliteration enabled in TinyMCE');
        }
    } else {
        // Fallback: Detailed typing guide
        showTypingGuide('hindi');
    }
}

// Enable Marathi keyboard
function enableMarathiKeyboard() {
    currentLanguage = 'mr';
    document.getElementById('poemLanguage').value = 'mr';
    updateEditorLanguage();
    showLanguageIndicator('मराठी (Marathi) - Type in English, get Marathi!');
    
    // Initialize Google Transliteration
    if (typeof google !== 'undefined' && google.elements && google.elements.transliteration) {
        if (transliterationControl) {
            transliterationControl.dispose();
        }
        
        var options = {
            sourceLanguage: google.elements.transliteration.LanguageCode.ENGLISH,
            destinationLanguage: [google.elements.transliteration.LanguageCode.MARATHI],
            shortcutKey: 'ctrl+g',
            transliterationEnabled: true
        };
        
        transliterationControl = new google.elements.transliteration.TransliterationControl(options);
        
        // Make TinyMCE content editable
        if (tinymceEditor) {
            var editorIframe = tinymceEditor.getDoc();
            transliterationControl.makeTransliteratable([editorIframe.body]);
            console.log('Marathi transliteration enabled in TinyMCE');
        }
    } else {
        // Fallback: Detailed typing guide
        showTypingGuide('marathi');
    }
}

// Show detailed typing guide
function showTypingGuide(language) {
    const guides = {
        hindi: `
📝 Hindi Typing Guide

🌐 OPTION 1: Browser Extension (RECOMMENDED)
Install "Google Input Tools" Chrome extension:
https://chrome.google.com/webstore/detail/google-input-tools/mclkkofklkfljcocdinagocijmpgbhab

After installation, refresh this page.

⌨️ OPTION 2: Phonetic Typing Examples
Type these English words → Press Space → Get Hindi:

• namaste → नमस्ते
• kavita → कविता  
• zindagi → ज़िंदगी
• dil → दिल
• pyaar → प्यार
• sapne → सपने
• raat → रात
• khushbu → खुशबू
• aashiqui → आशिकी

🎯 Common Letter Combinations:
• aa → आ | ai → ऐ | au → औ
• ka → क | kha → ख | ga → ग | gha → घ
• cha → च | chha → छ | ja → ज | jha → झ
• ta → त | tha → थ | da → द | dha → ध
• na → न | pa → प | pha → फ | ba → ब
• ma → म | ya → य | ra → र | la → ल
• va → व | sha → श | sa → स | ha → ह

🔧 OPTION 3: Pramukh IME Plugin
Visit: https://www.pramukh.org/ime/
Download plugin for your browser.

💡 TIP: Practice by typing simple words first!
        `,
        marathi: `
📝 Marathi Typing Guide

🌐 OPTION 1: Browser Extension (RECOMMENDED)
Install "Google Input Tools" Chrome extension:
https://chrome.google.com/webstore/detail/google-input-tools/mclkkofklkfljcocdinagocijmpgbhab

After installation, refresh this page.

⌨️ OPTION 2: Phonetic Typing Examples
Type these English words → Press Space → Get Marathi:

• namaste → नमस्ते
• kavita → कविता
• aathavan → आठवण
• preet → प्रीत
• jeevan → जीवन
• swapna → स्वप्न
• premaat → प्रेमात
• majhi → माझी
• tujhi → तुझी

🎯 Common Letter Combinations:
• aa → आ | ai → ऐ | au → औ
• ka → क | kha → ख | ga → ग | gha → घ
• cha → च | chha → छ | ja → ज | jha → झ
• ta → त | tha → थ | da → द | dha → ध
• na → न | pa → प | pha → फ | ba → ब
• ma → म | ya → य | ra → र | la → ल
• va → व | sha → श | sa → स | ha → ह
• jna → ज्ञ | ksha → क्ष | tra → त्र

🔧 OPTION 3: Pramukh IME Plugin
Visit: https://www.pramukh.org/ime/
Download Marathi plugin for your browser.

💡 TIP: Marathi uses same Devanagari script as Hindi!
        `
    };

    alert(guides[language]);
}

// Show language indicator
function showLanguageIndicator(text) {
    const indicator = document.getElementById('langIndicator');
    const indicatorText = document.getElementById('langIndicatorText');
    indicatorText.textContent = text;
    indicator.classList.add('active');
    
    setTimeout(() => {
        indicator.classList.remove('active');
    }, 3000);
}

// Update editor language
function updateEditorLanguage() {
    const lang = document.getElementById('poemLanguage').value;
    updateEditorContentLanguage();
    
    // Disable transliteration for English
    if (lang === 'en' && transliterationControl) {
        transliterationControl.dispose();
        transliterationControl = null;
    }
}

// Check authentication
async function checkAuth() {
    if (!token) {
        showLoginForm();
        return false;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            document.getElementById('userInfo').textContent = 
                `Logged in as: ${currentUser.display_name || currentUser.username} (${currentUser.role})`;
            showMyPoems();
            return true;
        } else {
            token = null;
            localStorage.removeItem('poetry_token');
            showLoginForm();
            return false;
        }
    } catch (error) {
        console.error('Auth check error:', error);
        showLoginForm();
        return false;
    }
}

// Login
async function login(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            token = data.token;
            localStorage.setItem('poetry_token', token);
            await checkAuth();
        } else {
            errorDiv.textContent = data.error || 'Login failed';
            errorDiv.classList.remove('hidden');
        }
    } catch (error) {
        errorDiv.textContent = 'Login error. Please try again.';
        errorDiv.classList.remove('hidden');
    }
}

// Logout
function logout() {
    token = null;
    currentUser = null;
    localStorage.removeItem('poetry_token');
    showLoginForm();
}

// Show login form
function showLoginForm() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('poemList').classList.add('hidden');
    document.getElementById('editorContainer').classList.add('hidden');
}

// Show poem list
async function showMyPoems() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('editorContainer').classList.add('hidden');
    document.getElementById('poemList').classList.remove('hidden');
    await loadMyPoems();
}

// Load my poems
async function loadMyPoems() {
    const container = document.getElementById('poemsContainer');
    container.innerHTML = '<div class="col-span-3 text-center py-8">Loading poems...</div>';

    try {
        const response = await fetch(`${API_BASE}/poems/user/my-poems`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to load poems');

        const data = await response.json();
        const poems = data.poems || [];

        // Filter by language if selected
        const filterLang = document.getElementById('filterLanguage').value;
        const filteredPoems = filterLang 
            ? poems.filter(p => p.language === filterLang)
            : poems;

        if (filteredPoems.length === 0) {
            container.innerHTML = `
                <div class="col-span-3 text-center py-12">
                    <i class="fas fa-feather-alt text-6xl text-gray-300 mb-4"></i>
                    <p class="text-gray-600">No poems found. Create your first poem!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredPoems.map(poem => `
            <div class="poem-card bg-white rounded-lg shadow p-4">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-lg text-gray-800">${escapeHtml(poem.title)}</h3>
                    <span class="px-2 py-1 rounded text-xs ${
                        poem.language === 'en' ? 'bg-blue-100 text-blue-800' :
                        poem.language === 'hi' ? 'bg-amber-100 text-amber-800' :
                        'bg-pink-100 text-pink-800'
                    }">
                        ${poem.language === 'en' ? 'EN' : poem.language === 'hi' ? 'हिं' : 'मरा'}
                    </span>
                </div>
                <div class="text-sm text-gray-600 mb-3 line-clamp-3" style="white-space: pre-wrap;">
                    ${escapeHtml(poem.content.substring(0, 150))}...
                </div>
                <div class="flex justify-between items-center text-sm text-gray-500 mb-3">
                    <span><i class="fas fa-eye"></i> ${poem.view_count || 0}</span>
                    <span><i class="fas fa-heart"></i> ${poem.like_count || 0}</span>
                    <span><i class="fas fa-star"></i> ${(poem.average_rating || 0).toFixed(1)}</span>
                </div>
                <div class="flex gap-2">
                    <button onclick="editPoem(${poem.id})" class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                        <i class="fas fa-edit mr-1"></i>Edit
                    </button>
                    <button onclick="deletePoem(${poem.id})" class="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                        <i class="fas fa-trash mr-1"></i>Delete
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = `
            <div class="col-span-3 text-center py-8 text-red-600">
                Error loading poems. Please try again.
            </div>
        `;
    }
}

// Show editor
function showEditor(poemData = null) {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('poemList').classList.add('hidden');
    document.getElementById('editorContainer').classList.remove('hidden');

    // Initialize TinyMCE if not already initialized
    setTimeout(() => {
        initTinyMCE();
        
        setTimeout(() => {
            if (poemData) {
                document.getElementById('editorTitle').textContent = 'Edit Poem';
                document.getElementById('poemTitle').value = poemData.title;
                document.getElementById('poemLanguage').value = poemData.language;
                document.getElementById('poemStatus').value = poemData.status;
                document.getElementById('editingPoemId').value = poemData.id;
                
                if (tinymceEditor) {
                    tinymceEditor.setContent(poemData.content.replace(/\n/g, '<br>'));
                }
                updateEditorLanguage();
            } else {
                document.getElementById('editorTitle').textContent = 'Create New Poem';
                document.getElementById('poemTitle').value = '';
                document.getElementById('poemLanguage').value = '';
                document.getElementById('poemStatus').value = 'published';
                document.getElementById('editingPoemId').value = '';
                
                if (tinymceEditor) {
                    tinymceEditor.setContent('');
                }
            }
        }, 500);
    }, 100);
}

// Edit poem
async function editPoem(id) {
    try {
        const response = await fetch(`${API_BASE}/poems/${id}`);
        if (!response.ok) throw new Error('Failed to load poem');
        
        const data = await response.json();
        showEditor(data.poem);
    } catch (error) {
        alert('Error loading poem for editing');
    }
}

// Save poem
async function savePoem(event) {
    event.preventDefault();

    const title = document.getElementById('poemTitle').value;
    const language = document.getElementById('poemLanguage').value;
    const status = document.getElementById('poemStatus').value;
    const poemId = document.getElementById('editingPoemId').value;
    
    // Get content from TinyMCE
    let content = '';
    if (tinymceEditor) {
        // Get plain text content, preserving line breaks
        const htmlContent = tinymceEditor.getContent();
        content = htmlContent
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .trim();
    }

    if (!content) {
        alert('Please write some content for your poem');
        return;
    }

    try {
        const method = poemId ? 'PUT' : 'POST';
        const url = poemId ? `${API_BASE}/poems/${poemId}` : `${API_BASE}/poems`;

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content, language, status })
        });

        if (response.ok) {
            alert(poemId ? 'Poem updated successfully!' : 'Poem created successfully!');
            showMyPoems();
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to save poem');
        }
    } catch (error) {
        alert('Error saving poem. Please try again.');
    }
}

// Delete poem
async function deletePoem(id) {
    if (!confirm('Are you sure you want to delete this poem?')) return;

    try {
        const response = await fetch(`${API_BASE}/poems/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Poem deleted successfully');
            await loadMyPoems();
        } else {
            alert('Failed to delete poem');
        }
    } catch (error) {
        alert('Error deleting poem');
    }
}

// Utility function
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initGoogleInputTools();
    checkAuth();
});
