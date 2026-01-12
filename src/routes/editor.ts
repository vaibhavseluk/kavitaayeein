import { Hono } from 'hono';
import type { Env } from '../lib/types';

const editorRoute = new Hono<{ Bindings: Env }>();

// Editor HTML page
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
    <link href="https://cdn.quilljs.com/1.3.7/quill.snow.css" rel="stylesheet">
    <script src="https://cdn.quilljs.com/1.3.7/quill.min.js"></script>
    <style>
        .ql-container { min-height: 400px; font-family: 'Noto Sans', 'Noto Sans Devanagari', sans-serif; font-size: 1.1rem; line-height: 1.8; }
        .ql-editor { white-space: pre-wrap; direction: ltr; }
        .lang-hi .ql-editor, .lang-mr .ql-editor { font-family: 'Noto Sans Devanagari', 'Noto Sans', sans-serif; }
        .lang-en .ql-editor { font-family: 'Noto Sans', 'Georgia', serif; }
        .poem-card { transition: all 0.3s ease; }
        .poem-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    </style>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <header class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">
                        <i class="fas fa-feather-alt text-purple-600 mr-2"></i>Poem Editor
                    </h1>
                    <p class="text-sm text-gray-600" id="userInfo">Loading...</p>
                </div>
                <div class="flex gap-3">
                    <button onclick="showMyPoems()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <i class="fas fa-list mr-2"></i>My Poems
                    </button>
                    <button onclick="showEditor()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        <i class="fas fa-plus mr-2"></i>New Poem
                    </button>
                    <button onclick="logout()" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                        <i class="fas fa-sign-out-alt mr-2"></i>Logout
                    </button>
                </div>
            </div>
        </header>

        <main class="max-w-7xl mx-auto px-4 py-8">
            <div id="loginForm" class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold mb-6 text-center">Login to Edit Poems</h2>
                <form onsubmit="login(event)">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input type="text" id="loginUsername" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="varu">
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input type="password" id="loginPassword" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Enter password">
                    </div>
                    <button type="submit" class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
                        <i class="fas fa-sign-in-alt mr-2"></i>Login
                    </button>
                </form>
                <div id="loginError" class="mt-4 text-red-600 text-sm text-center hidden"></div>
            </div>

            <div id="poemList" class="hidden">
                <div class="mb-6 flex justify-between items-center">
                    <h2 class="text-2xl font-bold">My Poems</h2>
                    <select id="filterLanguage" onchange="loadMyPoems()" class="px-4 py-2 border rounded-lg">
                        <option value="">All Languages</option>
                        <option value="en">English</option>
                        <option value="hi">हिंदी</option>
                        <option value="mr">मराठी</option>
                    </select>
                </div>
                <div id="poemsContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
            </div>

            <div id="editorContainer" class="hidden">
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h2 class="text-2xl font-bold mb-6" id="editorTitle">Create New Poem</h2>
                    <form onsubmit="savePoem(event)">
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Poem Title *</label>
                            <input type="text" id="poemTitle" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Enter poem title">
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Language *</label>
                            <select id="poemLanguage" required onchange="updateEditorLanguage()" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
                                <option value="">Select Language</option>
                                <option value="en">English</option>
                                <option value="hi">हिंदी (Hindi)</option>
                                <option value="mr">मराठी (Marathi)</option>
                            </select>
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Poem Content *</label>
                            <div id="editor" class="bg-white border rounded-lg"></div>
                            <input type="hidden" id="poemContent">
                            <input type="hidden" id="editingPoemId">
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select id="poemStatus" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                        <div class="flex gap-3 justify-end">
                            <button type="button" onclick="showMyPoems()" class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                                <i class="fas fa-times mr-2"></i>Cancel
                            </button>
                            <button type="submit" class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                <i class="fas fa-save mr-2"></i>Save Poem
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>

    <script src="/static/editor.js"></script>
</body>
</html>
  `);
});

export default editorRoute;
