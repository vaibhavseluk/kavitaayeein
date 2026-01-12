import { Hono } from 'hono';
import type { Env } from '../lib/types';

const editorRoute = new Hono<{ Bindings: Env }>();

// Editor HTML page with TinyMCE and multilingual support
editorRoute.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Poem Editor - Poetry Platform</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    
    <!-- TinyMCE Editor -->
    <script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
    
    <!-- Google Input Tools for Hindi/Marathi typing -->
    <script src="https://www.google.com/jsapi"></script>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;600;700&family=Noto+Sans:wght@300;400;600;700&display=swap');
        
        body {
            font-family: 'Noto Sans', 'Noto Sans Devanagari', sans-serif;
        }
        
        .poem-card {
            transition: all 0.3s ease;
        }
        
        .poem-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .tox-tinymce {
            border-radius: 0.5rem;
        }
        
        .lang-indicator {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 8px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            display: none;
            animation: slideIn 0.3s ease;
        }
        
        .lang-indicator.active {
            display: block;
        }
        
        @keyframes slideIn {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .keyboard-btn {
            position: relative;
            overflow: hidden;
        }
        
        .keyboard-btn:hover::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.2);
            border-radius: 0.5rem;
            transform: translate(-50%, -50%);
        }
    </style>
</head>
<body class="bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="min-h-screen">
        <header class="bg-white shadow-sm border-b sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">
                        <i class="fas fa-feather-alt text-purple-600 mr-2"></i>
                        Poem Editor
                    </h1>
                    <p class="text-sm text-gray-600 mt-1" id="userInfo">Loading...</p>
                </div>
                <div class="flex gap-3">
                    <button onclick="showMyPoems()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
                        <i class="fas fa-list mr-2"></i>My Poems
                    </button>
                    <button onclick="showEditor()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-sm hover:shadow-md">
                        <i class="fas fa-plus mr-2"></i>New Poem
                    </button>
                    <button onclick="logout()" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all shadow-sm hover:shadow-md">
                        <i class="fas fa-sign-out-alt mr-2"></i>Logout
                    </button>
                </div>
            </div>
        </header>

        <main class="max-w-7xl mx-auto px-4 py-8">
            <!-- Login Form -->
            <div id="loginForm" class="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
                <div class="text-center mb-6">
                    <i class="fas fa-user-circle text-6xl text-purple-600 mb-4"></i>
                    <h2 class="text-2xl font-bold">Login to Edit Poems</h2>
                    <p class="text-sm text-gray-600 mt-2">Access the WYSIWYG editor</p>
                </div>
                <form onsubmit="login(event)">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input type="text" id="loginUsername" required 
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                               placeholder="varu">
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input type="password" id="loginPassword" required 
                               class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                               placeholder="Enter password">
                    </div>
                    <button type="submit" 
                            class="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-all shadow-md hover:shadow-lg font-semibold">
                        <i class="fas fa-sign-in-alt mr-2"></i>Login
                    </button>
                </form>
                <div id="loginError" class="mt-4 text-red-600 text-sm text-center hidden"></div>
            </div>

            <!-- Poem List -->
            <div id="poemList" class="hidden">
                <div class="mb-6 flex justify-between items-center">
                    <div>
                        <h2 class="text-3xl font-bold text-gray-800">My Poems</h2>
                        <p class="text-gray-600 mt-1">Manage your poetry collection</p>
                    </div>
                    <select id="filterLanguage" onchange="loadMyPoems()" 
                            class="px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <option value="">All Languages (सभी भाषाएँ)</option>
                        <option value="en">🇬🇧 English</option>
                        <option value="hi">🇮🇳 हिंदी (Hindi)</option>
                        <option value="mr">🇮🇳 मराठी (Marathi)</option>
                    </select>
                </div>
                <div id="poemsContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
            </div>

            <!-- Editor Container -->
            <div id="editorContainer" class="hidden">
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h2 class="text-3xl font-bold mb-6 text-gray-800" id="editorTitle">
                        <i class="fas fa-pen-fancy text-purple-600 mr-2"></i>
                        Create New Poem
                    </h2>
                    <form onsubmit="savePoem(event)">
                        <!-- Title -->
                        <div class="mb-5">
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-heading mr-1"></i>Poem Title *
                            </label>
                            <input type="text" id="poemTitle" required 
                                   class="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg" 
                                   placeholder="Enter a captivating title">
                        </div>
                        
                        <!-- Language Selection with Keyboard Buttons -->
                        <div class="mb-5">
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-language mr-1"></i>Language *
                            </label>
                            <div class="flex gap-4">
                                <select id="poemLanguage" required onchange="updateEditorLanguage()" 
                                        class="flex-1 px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                    <option value="">Select Language</option>
                                    <option value="en">🇬🇧 English</option>
                                    <option value="hi">🇮🇳 हिंदी (Hindi)</option>
                                    <option value="mr">🇮🇳 मराठी (Marathi)</option>
                                </select>
                                <div class="flex gap-2">
                                    <button type="button" onclick="enableHindiKeyboard()" 
                                            class="keyboard-btn px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all shadow-md hover:shadow-lg font-semibold"
                                            title="Enable Hindi typing (Ctrl+G to toggle)">
                                        <i class="fas fa-keyboard mr-2"></i>हिंदी
                                    </button>
                                    <button type="button" onclick="enableMarathiKeyboard()" 
                                            class="keyboard-btn px-5 py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all shadow-md hover:shadow-lg font-semibold"
                                            title="Enable Marathi typing (Ctrl+G to toggle)">
                                        <i class="fas fa-keyboard mr-2"></i>मराठी
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Multilingual Typing Instructions -->
                            <div class="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg">
                                <p class="text-sm text-blue-900 font-semibold mb-2">
                                    <i class="fas fa-info-circle mr-2"></i>
                                    Easy Multilingual Typing
                                </p>
                                <p class="text-xs text-blue-800 mb-1">
                                    <strong>Step 1:</strong> Click <span class="px-2 py-1 bg-amber-200 rounded">हिंदी</span> or 
                                    <span class="px-2 py-1 bg-pink-200 rounded">मराठी</span> button above
                                </p>
                                <p class="text-xs text-blue-800 mb-2">
                                    <strong>Step 2:</strong> Type in English → Automatically converts to Hindi/Marathi!
                                </p>
                                <div class="flex gap-4 text-xs text-blue-700 mt-2">
                                    <div class="flex-1 bg-white p-2 rounded">
                                        <strong>Examples:</strong><br>
                                        "namaste" → नमस्ते<br>
                                        "kavita" → कविता
                                    </div>
                                    <div class="flex-1 bg-white p-2 rounded">
                                        <strong>Install:</strong><br>
                                        <a href="https://chrome.google.com/webstore/detail/google-input-tools/mclkkofklkfljcocdinagocijmpgbhab" 
                                           target="_blank" class="text-blue-600 hover:underline">Google Input Tools</a><br>
                                        <a href="https://www.pramukh.org/ime/" 
                                           target="_blank" class="text-blue-600 hover:underline">Pramukh IME</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Content Editor -->
                        <div class="mb-5">
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-feather mr-1"></i>Poem Content *
                                <span class="text-xs font-normal text-gray-500 ml-2">
                                    (Rich text editor with Hindi/Marathi support)
                                </span>
                            </label>
                            <textarea id="poemContent"></textarea>
                            <input type="hidden" id="editingPoemId">
                        </div>
                        
                        <!-- Status -->
                        <div class="mb-6">
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-toggle-on mr-1"></i>Publishing Status
                            </label>
                            <select id="poemStatus" 
                                    class="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="published">✅ Published (Visible to all)</option>
                                <option value="draft">📝 Draft (Private)</option>
                            </select>
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="flex gap-3 justify-end">
                            <button type="button" onclick="showMyPoems()" 
                                    class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all shadow-md hover:shadow-lg font-semibold">
                                <i class="fas fa-times mr-2"></i>Cancel
                            </button>
                            <button type="submit" 
                                    class="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-semibold">
                                <i class="fas fa-save mr-2"></i>Save Poem
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
        
        <!-- Language Indicator (floating notification) -->
        <div id="langIndicator" class="lang-indicator">
            <i class="fas fa-keyboard mr-2"></i>
            <span id="langIndicatorText">English</span>
        </div>
    </div>

    <script src="/static/editor-tinymce.js"></script>
</body>
</html>
  `);
});

export default editorRoute;
