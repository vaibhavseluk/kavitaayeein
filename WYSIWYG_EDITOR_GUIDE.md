# WYSIWYG Poem Editor - User Guide

## Overview
Your poetry platform now includes a powerful **WYSIWYG (What You See Is What You Get) Editor** for creating and managing poems in English, Hindi, and Marathi languages.

---

## Features

### ✨ WYSIWYG Editor Features
- **Rich Text Formatting**: Bold, italic, underline
- **Headers**: Multiple heading levels
- **Lists**: Ordered and bullet lists
- **Text Alignment**: Left, center, right, justify
- **Multilingual Support**: Optimized fonts for Devanagari script (Hindi/Marathi)
- **Real-time Preview**: See exactly how your poem will look
- **Clean Interface**: Distraction-free writing experience

### 🔐 User Features
- **Secure Login**: JWT-based authentication
- **Personal Dashboard**: View all your poems
- **CRUD Operations**: Create, Read, Update, Delete poems
- **Draft Mode**: Save poems as drafts before publishing
- **Language Filter**: Filter poems by language
- **Statistics**: View counts, likes, ratings for each poem

---

## Access the Editor

### Development Server
**Local URL**: http://localhost:3000/editor.html

### Production (After Deployment)
**Live URL**: https://1e883418.poetry-platform.pages.dev/editor.html
**Permanent URL**: https://poetry-platform.pages.dev/editor.html

---

## Login Credentials

### Admin User: varu
- **Username**: `varu`
- **Password**: `varu123`
- **Role**: Admin
- **Display Name**: varu (pen name)
- **Pre-loaded Poems**: 19 poems from "Safar-e-Zindagi" (The Journey of Life)

---

## Pre-loaded Poems

### Chapter 1: Safar-e-Zindagi (The Journey of Life)
**Total: 19 Poems**

1. **वक्त का तकाझा** (Hindi) - Waqt ka Takaza
2. **रेत सी फिसल रही जिंदगी** (Hindi) - Ret si Fisal Rahi Zindagi ⭐ Featured
3. **Maximist - A Tribute** (English)
4. **जीवन का सार** (Hindi) - Jeevan ka Saar (Rap) ⭐ Featured
5. **उलझन** (Hindi) - Uljhan
6. **कुर्बानी - आज के लिए कल** (Hindi) - Kurbani
7. **ज़िंदगी ऐसा कब तक चलेगा?** (Hindi)
8. **अनदेखा विषाणु** (Hindi) - Anndekha Vishanu ⭐ Featured
9. **जिंदगी की सच्चाई** (Hindi) - Zindagi ki Sacchai
10. **समय से उलझी तारें** (Hindi) - Samay se Uljhi Taarein
11. **एक दिन - एक उंगली की वोट** (Hindi) - Ek Din
12. **हर मोड़ पर सीख** (Hindi) - Har Mod Par Seekh
13. **नदी हो या ज़िंदगी** (Hindi) - Nadi ho ya Zindagi
14. **गुज़ारिश - ज़िन्दगी से** (Hindi) - Guzarish to Life ⭐ Featured
15. **हंसना ज़रूरी है** (Hindi) - Hassna Zaroori Hai ⭐ Featured
16. **Take it for Granted** (English)
17. **रास्ते कमाल होते हैं** (Hindi) - Raaste Kamal Hote Hain
18. **आगाज़ - 2024** (Hindi) - Aagaz
19. **बदलता इंसान** (Hindi) - Badalta Insaan

**Featured Poems**: 5 poems marked as featured
**All Poems**: Eligible for anthology inclusion

---

## How to Use the Editor

### 1. Login
1. Open the editor URL
2. Enter username: `varu`
3. Enter password: `varu123`
4. Click "Login"

### 2. View Your Poems
- After login, you'll see "My Poems" dashboard
- Each poem shows:
  - Title and language badge
  - Preview of content
  - View, like, and rating statistics
  - Edit and Delete buttons
- Filter by language using the dropdown

### 3. Create New Poem
1. Click "New Poem" button in header
2. Fill in:
   - **Poem Title**: Enter your poem's title
   - **Language**: Select English/Hindi/Marathi
   - **Poem Content**: Use the WYSIWYG editor
3. Format your text:
   - Use toolbar for bold, italic, underline
   - Add headers for sections
   - Create lists if needed
   - Adjust text alignment
4. Choose status: Published or Draft
5. Click "Save Poem"

### 4. Edit Existing Poem
1. From "My Poems" list, click "Edit" on any poem
2. Modify title, content, language, or status
3. Click "Save Poem" to update

### 5. Delete Poem
1. From "My Poems" list, click "Delete" on any poem
2. Confirm deletion
3. Poem will be soft-deleted (status changed to 'deleted')

---

## WYSIWYG Editor Toolbar

### Formatting Options
- **Headers**: H1, H2, H3, or normal text
- **Bold** (Ctrl+B): Make text bold
- **Italic** (Ctrl+I): Italicize text
- **Underline** (Ctrl+U): Underline text
- **Lists**:
  - Ordered list (1, 2, 3...)
  - Bullet list (•)
- **Alignment**:
  - Left align
  - Center
  - Right align
  - Justify
- **Clean**: Remove all formatting

---

## Language-Specific Features

### English (en)
- Font: Noto Sans, Georgia
- Optimized for Latin script
- All standard formatting options

### Hindi (hi) - हिंदी
- Font: Noto Sans Devanagari
- Optimized for Devanagari script
- Full Unicode support
- Proper rendering of conjuncts

### Marathi (mr) - मराठी
- Font: Noto Sans Devanagari
- Optimized for Devanagari script
- Full Unicode support
- Proper rendering of conjuncts

---

## API Endpoints Used by Editor

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Poems Management
- `GET /api/poems/user/my-poems` - Get user's poems
- `GET /api/poems/:id` - Get single poem details
- `POST /api/poems` - Create new poem
- `PUT /api/poems/:id` - Update existing poem
- `DELETE /api/poems/:id` - Delete poem (soft delete)

---

## Tips for Best Results

### Writing Poems
1. **Use Line Breaks**: Press Enter to create new lines
2. **Preserve Formatting**: The editor maintains your spacing and line breaks
3. **Draft First**: Use draft mode to work on poems before publishing
4. **Preview**: The editor shows exactly how your poem will appear

### Multilingual Poems
1. **Select Correct Language**: Ensures proper font rendering
2. **Use Native Script**: Write Hindi in Devanagari, not transliteration
3. **Check Display**: Preview after saving to ensure proper rendering

### Best Practices
- Write poem title in the same language as content
- Use descriptive titles for better discoverability
- Mark poems as "Published" when ready for public viewing
- Keep drafts for work-in-progress poems

---

## Troubleshooting

### Login Issues
- **Error: "Invalid token"**: Re-login to refresh authentication
- **Error: "Not authenticated"**: Check that you're logged in

### Saving Issues
- **Error: "Title, content, and language are required"**: Fill all required fields
- **Error: "Invalid language"**: Select a valid language (en/hi/mr)

### Display Issues
- **Hindi/Marathi not showing correctly**: 
  - Ensure correct language is selected
  - Check that Noto Sans Devanagari font is loaded
- **Formatting not preserved**: 
  - Use the editor's formatting tools instead of copy-paste

---

## Database Information

### Varu User Details
```sql
Username: varu
Email: varu@poetry-platform.com
Role: admin
Display Name: varu
Language Preference: hi (Hindi)
Is Featured: Yes
```

### Poems Table Structure
```sql
- id: Unique identifier
- title: Poem title
- content: Full poem content (plain text with line breaks)
- language: en/hi/mr
- author_id: References users table
- status: published/draft/deleted
- is_featured: Boolean
- anthology_eligible: Boolean
- view_count, like_count, rating_sum, rating_count
- created_at, updated_at
```

---

## Next Steps

### For Development
1. Test all CRUD operations with varu account
2. Create more poems in different languages
3. Test the WYSIWYG formatting features
4. Verify mobile responsiveness

### For Production
1. Deploy to Cloudflare Pages (poems already in production DB)
2. Import poems to production database:
   ```bash
   npx wrangler d1 execute poetry-platform-production --remote --file=./seed_varu_poems.sql
   ```
3. Share editor URL with poets
4. Monitor usage and feedback

---

## Security Notes

### Password Security
- Default password for varu is `varu123`
- **IMPORTANT**: Change password after first login
- Use strong, unique passwords for all accounts

### Token Management
- Tokens stored in localStorage
- Tokens expire after configured duration
- Re-login if token expires

### Admin Privileges
- Varu has admin role
- Can moderate all content
- Can access admin dashboard
- Can manage other users

---

## Support

### Documentation
- **README.md**: Full project overview
- **DEPLOYMENT.md**: Deployment instructions
- **API Documentation**: Available in README.md

### Testing
```bash
# Test poems API
curl http://localhost:3000/api/poems

# Test varu's poems
curl http://localhost:3000/api/poems?author=varu

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"varu","password":"varu123"}'
```

---

## Summary

✅ **WYSIWYG Editor**: Fully functional with Quill.js
✅ **19 Poems Imported**: All from "Safar-e-Zindagi" chapter
✅ **Varu Account**: Admin user with pen name "varu"
✅ **Multilingual**: English, Hindi, Marathi support
✅ **Full CRUD**: Create, Read, Update, Delete poems
✅ **Rich Formatting**: Headers, bold, lists, alignment
✅ **Production Ready**: Can be deployed immediately

**Start writing and editing poems at: http://localhost:3000/editor.html**

Login with:
- Username: `varu`
- Password: `varu123`

🎉 Happy Poetry Writing! 📝✨
