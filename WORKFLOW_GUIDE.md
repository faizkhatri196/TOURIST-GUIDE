# 🌐 Multi-Language Workflow Guide

## Overview
This guide explains how to work with the multi-language WanderWorld project efficiently.

---

## 📋 File Organization by Role

### For Content Creators (Translators)
```
Your Focus: Language-specific folders
├── /en/ → English content
├── /fr/ → French content (Français)
├── /es/ → Spanish content (Español)
├── /de/ → German content (Deutsch)
├── /zh/ → Chinese content (中文)
└── /ja/ → Japanese content (日本語)
```

**Task Flow:**
1. Get English version from `/en/index.html`
2. Translate all text content
3. Save as `/[lang-code]/index.html`
4. Test links and functionality

### For Designers
```
Your Focus: Shared Assets
├── /assets/
│   ├── /images/    → Destination photos (shared across all languages)
│   ├── /fonts/     → Font files
│   └── /icons/     → Flag icons, emojis
└── Updates reflect across all languages
```

### For Developers
```
Your Focus: Template & Core
├── Root /index.html    → Language selector (entry point)
├── /en/index.html      → Base template (reference)
├── Version control     → Keep consistent structure
└── Testing            → Test all 6 language versions
```

---

## 🔄 Common Workflows

### Workflow 1: Add New Destination
**Step 1:** Update main template
- Edit `/en/index.html` → Add destination data

**Step 2:** Replicate to other languages
```
Copy destination structure from English version
↓
/fr/index.html → Translate destination details
/es/index.html → Translate destination details
/de/index.html → Translate destination details
/zh/index.html → Translate destination details
/ja/index.html → Translate destination details
```

**Step 3:** Test
- Open each language and verify destination appears
- Check image paths (should be `../assets/images/...`)

---

### Workflow 2: Fix a Bug
**Step 1:** Identify the bug
- Example: "Modal not opening in Spanish version"

**Step 2:** Fix in all versions
```PowerShell
# If it's a structural issue, fix in all:
- /en/index.html
- /fr/index.html
- /es/index.html
- /de/index.html
- /zh/index.html
- /ja/index.html

# If it's language-specific, fix only that version:
- /es/index.html
```

**Step 3:** Test across languages

---

### Workflow 3: Update Navigation or Layout
**Step 1:** Update master/template
- Edit `/en/index.html` (the template)

**Step 2:** Copy to others
```
Copy the changed section
↓
Paste to /fr/, /es/, /de/, /zh/, /ja/
↓
Preserve translated content
```

**Step 3:** Re-translate if needed

---

## 📝 Translation Guidelines

### Folder Structure for Each Language
```
/[lang-code]/
  ├── index.html          ← Main page
  └── world-tourist-guide.html  ← Secondary page (if needed)
```

### Content to Translate

#### Navigation & UI Elements
```html
<!-- English Example -->
<div class="logo">Wander<span>World</span></div>
<a href="#destinations">Destinations</a>

<!-- Spanish Translation -->
<div class="logo">Wander<span>World</span></div>
<a href="#destinations">Destinos</a>
```

#### Section Headers & Descriptions
```html
<!-- English -->
<h2 class="section-title">Places That Will<br>Change You Forever</h2>

<!-- French -->
<h2 class="section-title">Des lieux qui vous<br>changeront à jamais</h2>
```

#### Destination Data
```javascript
// English
{name:"Paris",country:"France",desc:"The City of Light..."}

// French
{name:"Paris",country:"France",desc:"La Ville de la Lumière..."}
```

#### Metadata
```html
<!-- Update language attribute -->
<html lang="en">  <!-- English -->
<html lang="fr">  <!-- French -->
<html lang="es">  <!-- Spanish -->
<html lang="de">  <!-- German -->
<html lang="zh">  <!-- Chinese -->
<html lang="ja">  <!-- Japanese -->
```

---

## 🔗 Linking Between Languages

### From Language Selector (Root)
```html
<!-- Root /index.html -->
<a href="en/index.html">English</a>
<a href="fr/index.html">Français</a>
<a href="es/index.html">Español</a>
```

### Within a Language Folder
```html
<!-- Internal links stay the same -->
<a href="#destinations">Go to Destinations</a>
<a href="#india">India Section</a>

<!-- Links to assets (shared) -->
<img src="../assets/images/paris.jpg" alt="Paris">
```

### Back to Language Selector
```html
<!-- Optional: Add language switcher -->
<a href="../index.html">← Choose Language</a>
```

---

## 💾 Best Practices

### ✅ DO:
- ✅ Keep HTML structure identical across languages
- ✅ Use language codes (en, fr, es, de, zh, ja) in folder names
- ✅ Store shared images in `/assets/images/`
- ✅ Use relative paths for assets: `../assets/images/file.jpg`
- ✅ Test each language version independently
- ✅ Keep translations consistent (create glossary)
- ✅ Document any language-specific variations

### ❌ DON'T:
- ❌ Don't change HTML structure per language
- ❌ Don't duplicate assets across folders
- ❌ Don't use hardcoded image paths
- ❌ Don't forget to update metadata language codes
- ❌ Don't mix languages in single file
- ❌ Don't ignore right-to-left (RTL) languages if added

---

## 🧪 Testing Checklist

Before publishing each language version:

### Navigation
- [ ] Home link works
- [ ] All anchor links work (#destinations, #india, etc.)
- [ ] External links open correctly
- [ ] Back to language selector works

### Content
- [ ] All text is translated (no English left)
- [ ] Special characters display correctly
- [ ] Numbers and dates format per locale
- [ ] Currency symbols are correct

### Images & Assets
- [ ] All images load (check network tab)
- [ ] Responsive on mobile
- [ ] Image paths use relative references

### Functionality
- [ ] Search works
- [ ] Filter chips respond
- [ ] Modal opens and closes
- [ ] Chatbot initializes
- [ ] Tabs switch content

---

## 📊 Translation Priority

### Phase 1 (Core)
1. English ✅ (Done)
2. Spanish 📝 (Highest demand)
3. French 📝 (European market)

### Phase 2 (Expansion)
4. German 📝 (European market)
5. Chinese 📝 (Asian market)
6. Japanese 📝 (Asian market)

---

## 🚀 Performance Tips

### Keep URLs Clean
```
✅ Good: domain.com/en/index.html
✅ Good: domain.com/fr/index.html
❌ Bad: domain.com/english/main.html
```

### Asset Optimization
- Store images once in `/assets/images/`
- Reference from all languages
- Use responsive image sizes
- Compress images before uploading

### Loading Strategy
```
Root index.html (light - language selector only)
  ↓
/en/index.html (full features - English)
/fr/index.html (full features - French)
... etc
```

---

## 📞 Support

### Common Issues

**Issue:** Images not loading in non-English versions
```
Solution: Use relative paths ../assets/images/photo.jpg
```

**Issue:** Search doesn't work in translated version
```
Solution: Destination data arrays might need translation
Check: const destinations = [{name: "Paris", ...}]
```

**Issue:** Modal displays wrong content
```
Solution: Ensure destination IDs match across languages
```

---

**Last Updated:** 2025  
**Version:** 1.0  
**Status:** Active Multi-Language Deployment
