# Multilingual Typing Support - Poetry Platform

## 📋 Overview
The Poetry Platform WYSIWYG editor now has **comprehensive multilingual support** for typing Hindi (हिंदी) and Marathi (मराठी) poems using phonetic English input.

## 🎯 Editor Technology
- **Editor**: TinyMCE 6 (rich text WYSIWYG editor)
- **Transliteration**: Google Input Tools API
- **Alternative**: Pramukh IME (browser plugin)
- **Font Support**: Noto Sans Devanagari for perfect Hindi/Marathi rendering

## ⌨️ How to Use Multilingual Typing

### Method 1: Built-in Transliteration (RECOMMENDED)

1. **Open the Editor**: https://3000-i50h0iu6uof9fu9t33zaw-5c13a017.sandbox.novita.ai/editor
2. **Login**: Username: `varu`, Password: `varu123`
3. **Click Language Button**:
   - Click **हिंदी** button for Hindi typing
   - Click **मराठी** button for Marathi typing
4. **Start Typing**: Type in English, and it will automatically convert!

### Examples

#### Hindi (हिंदी) Examples:
```
Type: "namaste" → Get: नमस्ते
Type: "kavita" → Get: कविता
Type: "zindagi" → Get: ज़िंदगी
Type: "dil" → Get: दिल
Type: "pyaar" → Get: प्यार
Type: "sapne" → Get: सपने
Type: "raat" → Get: रात
Type: "khushbu" → Get: खुशबू
Type: "aashiqui" → Get: आशिकी
Type: "mohabbat" → Get: मोहब्बत
```

#### Marathi (मराठी) Examples:
```
Type: "namaste" → Get: नमस्ते
Type: "kavita" → Get: कविता
Type: "aathavan" → Get: आठवण
Type: "preet" → Get: प्रीत
Type: "jeevan" → Get: जीवन
Type: "swapna" → Get: स्वप्न
Type: "premaat" → Get: प्रेमात
Type: "majhi" → Get: माझी
Type: "tujhi" → Get: तुझी
Type: "aaple" → Get: आपले
```

### Method 2: Browser Extensions (Best Experience)

For the most seamless typing experience, install one of these browser extensions:

#### Option A: Google Input Tools (RECOMMENDED)
1. **Install Extension**: [Google Input Tools for Chrome](https://chrome.google.com/webstore/detail/google-input-tools/mclkkofklkfljcocdinagocijmpgbhab)
2. **Enable Languages**: Enable Hindi and/or Marathi
3. **Use Shortcut**: Press `Ctrl+G` to toggle transliteration on/off
4. **Type Naturally**: Type in English, see suggestions in real-time

#### Option B: Pramukh IME
1. **Visit**: https://www.pramukh.org/ime/
2. **Download**: Plugin for your browser
3. **Install**: Follow installation instructions
4. **Configure**: Set up Hindi/Marathi keyboard layouts

## 🎨 Editor Features

### Rich Text Editing
- **Formatting**: Bold, Italic, Underline
- **Alignment**: Left, Center, Right, Justify
- **Lists**: Numbered lists, Bullet points
- **Structure**: Headings (H1, H2, H3), Paragraphs
- **Code View**: View and edit HTML source
- **Fullscreen**: Distraction-free writing mode

### Multilingual Features
- **Font Support**: Devanagari script with Noto Sans
- **RTL/LTR**: Right-to-left and left-to-right text direction
- **Language Classes**: Automatic font styling based on language
- **Visual Indicator**: Floating notification shows active language

### Keyboard Shortcuts
- **Ctrl+G**: Toggle transliteration (with Google Input Tools)
- **Ctrl+B**: Bold
- **Ctrl+I**: Italic
- **Ctrl+U**: Underline
- **Ctrl+Z**: Undo
- **Ctrl+Y**: Redo

## 📝 Devanagari Letter Combinations

### Vowels (स्वर)
```
a → अ     aa → आ    i → इ     ii → ई
u → उ     uu → ऊ    e → ए     ai → ऐ
o → ओ     au → औ    am → अं   ah → अः
```

### Consonants (व्यंजन)
```
Gutturals (कंठ्य):
ka → क    kha → ख   ga → ग    gha → घ   nga → ङ

Palatals (तालव्य):
cha → च   chha → छ  ja → ज    jha → झ   nya → ञ

Cerebrals (मूर्धन्य):
ta → ट    tha → ठ   da → ड    dha → ढ   na → ण

Dentals (दन्त्य):
ta → त    tha → थ   da → द    dha → ध   na → न

Labials (ओष्ठ्य):
pa → प    pha → फ   ba → ब    bha → भ   ma → म

Semi-vowels (अन्तस्थ):
ya → य    ra → र    la → ल    va → व

Sibilants (ऊष्म):
sha → श   shha → ष  sa → स    ha → ह

Conjuncts (संयुक्त):
ksha → क्ष   tra → त्र    jna → ज्ञ
```

## 🎯 Usage Tips

### For Best Results:
1. **Type Phonetically**: Type words as they sound in English
2. **Use Space**: Press Space after each word to see transliteration
3. **Choose Suggestions**: Use arrow keys to select from multiple options
4. **Practice**: Common words get easier with practice

### Common Pitfalls:
- **Long Vowels**: Use double letters (aa, ii, uu) for long vowels
- **Aspirated**: Add 'h' after consonants (kh, gh, ch, th, etc.)
- **Anusvara**: Type 'n' or 'm' at word end for ं (anusvara)
- **Visarga**: Type 'h' at word end for ः (visarga)

## 🌟 Special Features

### Language Selection
The editor automatically applies:
- **Font Family**: Noto Sans Devanagari for hi/mr
- **Font Size**: Increased line-height for readability
- **Visual Badge**: Language indicator in poem cards

### Poem Management
- **Create**: New poems in English, Hindi, or Marathi
- **Edit**: Modify existing poems with full formatting
- **Delete**: Remove poems with confirmation
- **Filter**: View poems by language
- **Stats**: View count, likes, ratings for each poem

## 📊 Current Poem Collection
- **Total Poems**: 19 poems by user `varu`
- **Languages**: 17 Hindi, 2 English
- **Chapter**: Safar-e-Zindagi (The Journey of Life)
- **Status**: All published and featured

## 🔧 Technical Implementation

### TinyMCE Configuration
```javascript
tinymce.init({
    selector: '#poemContent',
    height: 500,
    plugins: [
        'advlist', 'autolink', 'lists', 'link', 'charmap',
        'preview', 'searchreplace', 'visualblocks', 'code',
        'fullscreen', 'insertdatetime', 'table', 'help',
        'wordcount', 'directionality'
    ],
    toolbar: 'undo redo | blocks | bold italic underline |
              alignleft aligncenter alignright alignjustify |
              bullist numlist outdent indent | ltr rtl |
              removeformat | code fullscreen | help',
    content_style: `
        body {
            font-family: 'Noto Sans', 'Noto Sans Devanagari', sans-serif;
            font-size: 16px;
            line-height: 1.8;
        }
        body.lang-hi, body.lang-mr {
            font-family: 'Noto Sans Devanagari', 'Noto Sans', sans-serif;
        }
    `
});
```

### Google Transliteration Integration
```javascript
google.load("elements", "1", {
    packages: "transliteration"
});

var options = {
    sourceLanguage: google.elements.transliteration.LanguageCode.ENGLISH,
    destinationLanguage: [google.elements.transliteration.LanguageCode.HINDI],
    shortcutKey: 'ctrl+g',
    transliterationEnabled: true
};

transliterationControl = new google.elements.transliteration.TransliterationControl(options);
transliterationControl.makeTransliteratable([editorIframe.body]);
```

## 📱 Responsive Design
- **Desktop**: Full-featured editor with all toolbars
- **Tablet**: Optimized toolbar layout
- **Mobile**: Touch-friendly interface with essential tools

## 🔐 Authentication
- **Required**: Login required to access editor
- **Test Account**: `varu` / `varu123`
- **Role**: Admin (full CRUD permissions)

## 📂 Files Modified
- `src/routes/editor.ts` - TinyMCE-based editor HTML
- `public/static/editor-tinymce.js` - Enhanced JavaScript with transliteration
- `src/routes/editor-quill-backup.ts` - Backup of Quill editor

## 🚀 Access URLs
- **Sandbox Editor**: https://3000-i50h0iu6uof9fu9t33zaw-5c13a017.sandbox.novita.ai/editor
- **Production (after deploy)**: https://poetry-platform.pages.dev/editor

## 🎓 Learning Resources
- **Google Input Tools**: https://www.google.com/inputtools/
- **Pramukh IME**: https://www.pramukh.org/ime/
- **Devanagari Script**: https://en.wikipedia.org/wiki/Devanagari
- **Hindi Typing**: https://www.hindi-typing.in/
- **Marathi Typing**: https://www.marathityping.com/

## 📞 Support
For issues or questions about multilingual typing:
1. Check browser console for Google API load status
2. Verify browser extension installation
3. Try alternative typing method (browser extension vs built-in)
4. Check network connectivity for Google API

---

**Note**: The built-in transliteration uses Google Input Tools API which requires internet connectivity. For offline typing, install browser extensions.