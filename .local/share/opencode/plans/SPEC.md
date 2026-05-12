# RecipeVault - Specification Document

## 1. Project Overview

**Project Name:** RecipeVault  
**Type:** Cross-platform Mobile + Web Application (Expo)  
**Core Functionality:** A recipe management app that allows users to create, organize, and share recipes while generating smart grocery lists from selected recipes.  
**Target Users:** Home cooks, meal planners, families, and food enthusiasts.

---

## 2. Technology Stack

| Component        | Technology                           |
| ---------------- | ------------------------------------ |
| Framework        | Expo SDK 52 (React Native + Web)     |
| Language         | TypeScript                           |
| Backend          | Supabase (PostgreSQL, Auth, Storage) |
| State Management | Zustand                              |
| Navigation       | Expo Router                          |
| UI Components    | React Native Paper                   |
| OCR              | expo-ml-kit (local)                  |
| Image Picker     | expo-image-picker                    |
| Sharing          | expo-sharing / expo-web-browser      |

---

## 3. Database Schema (Supabase)

### Tables

**profiles**

```sql
id: uuid (PK, references auth.users)
username: text
avatar_url: text
created_at: timestamptz
updated_at: timestamptz
```

**recipes**

```sql
id: uuid (PK)
user_id: uuid (FK → profiles.id)
title: text
description: text
image_url: text
servings: integer
prep_time: integer (minutes)
cook_time: integer (minutes)
source_type: enum ('manual', 'url', 'social', 'ocr')
source_url: text
ingredients: jsonb (array of ingredient objects)
instructions: jsonb (array of steps)
tags: text[]
is_public: boolean
created_at: timestamptz
updated_at: timestamptz
```

**grocery_lists**

```sql
id: uuid (PK)
user_id: uuid (FK → profiles.id)
name: text
status: enum ('active', 'completed')
created_at: timestamptz
updated_at: timestamptz
```

**grocery_items**

```sql
id: uuid (PK)
list_id: uuid (FK → grocery_lists.id)
ingredient: text (normalized ingredient name)
quantity: numeric
unit: text
recipe_id: uuid (FK → recipes.id, nullable)
is_checked: boolean
created_at: timestamptz
```

### Row Level Security (RLS)

- All tables: Users can only access their own data (auth.uid() = user_id)
- recipes: Allow public recipes to be readable by all authenticated users

---

## 4. UI/UX Specification

### Color Palette

| Role            | Color       | Hex     |
| --------------- | ----------- | ------- |
| Primary         | Fresh Green | #2E7D32 |
| Primary Variant | Dark Green  | #1B5E20 |
| Secondary       | Warm Orange | #FF6F00 |
| Background      | Off-White   | #FAFAFA |
| Surface         | White       | #FFFFFF |
| Error           | Red         | #D32F2F |
| Text Primary    | Dark Gray   | #212121 |
| Text Secondary  | Medium Gray | #757575 |

### Typography

| Element | Font   | Size | Weight   |
| ------- | ------ | ---- | -------- |
| H1      | System | 28px | Bold     |
| H2      | System | 24px | SemiBold |
| H3      | System | 20px | SemiBold |
| Body    | System | 16px | Regular  |
| Caption | System | 14px | Regular  |

### Spacing System (8pt Grid)

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

### Screen Structure (Tab Navigation)

```
┌─────────────────────────────────────┐
│              App Shell              │
├─────────────────────────────────────┤
│  [Recipes]  [Grocery]  [Settings]    │
│     Tab 1     Tab 2     Tab 3       │
└─────────────────────────────────────┘
```

### Screen 1: Recipes List (Tab 1)

- **Header:** "My Recipes" + Search icon + Add button (FAB)
- **Search Bar:** Expandable search with filters (tags, time, source)
- **Recipe Cards:** Grid or list view toggle
  - Card: Image (square thumbnail), Title, Time, Servings, Tags
- **Empty State:** Illustration + "Add your first recipe" CTA
- **FAB:** Add new recipe (+)

### Screen 2: Recipe Detail

- **Hero Image:** Full-width, with back button overlay
- **Title Section:** Title, Description, Prep/Cook time, Servings
- **Source Badge:** Icon showing source (manual/URL/OCR/Social)
- **Ingredients Section:** Checkable list with quantities
- **Instructions Section:** Numbered steps
- **Actions:** Edit, Share, Delete, "Add to Grocery List"

### Screen 3: Add/Edit Recipe

- **Form Sections:**
  1. Image: Camera/Gallery picker or URL input
  2. Basic Info: Title (required), Description, Servings, Prep/Cook time
  3. Source: Auto-detected or manual selection
  4. Ingredients: Dynamic list (name, qty, unit, add/remove)
  5. Instructions: Dynamic list (step text, add/remove)
  6. Tags: Multi-select chips
- **Actions:** Save, Cancel

### Screen 4: Import Recipe

- **Import Options:**
  1. Manual: Empty form
  2. From URL: Paste URL → Fetch & parse
  3. From Image: Camera/Gallery → OCR extract
  4. From Social: Instagram URL → Fetch & parse
- **Preview:** Parsed recipe with editable fields

### Screen 5: Grocery List (Tab 2)

- **Header:** List name + Date + Actions (Clear, Archive)
- **Grouped Items:** By category (Produce, Dairy, Meat, Pantry, etc.)
- **Item Row:** Checkbox, Ingredient, Quantity, Source recipe badge
- **Quick Add:** Manual item input
- **Actions:** Add selected recipe ingredients, Share list

### Screen 6: Settings (Tab 3)

- **Profile:** Avatar, Username, Edit
- **Preferences:** Default servings, Measurement units
- **Data:** Export recipes, Import backup
- **About:** Version, Privacy Policy, Terms

---

## 5. Functionality Specification

### Core Features

#### Recipe Management

1. **Create Recipe**
   - Manual entry with all fields
   - Import from URL (web scraping)
   - Import from image (OCR)
   - Duplicate existing recipe

2. **Read Recipes**
   - List view (grid/list toggle)
   - Search by title, ingredients, tags
   - Filter by: source, prep time, tags, has image
   - Sort by: date created, title, alphabetical

3. **Update Recipe**
   - Edit any field
   - Replace image
   - Add/remove ingredients/instructions

4. **Delete Recipe**
   - Soft delete with confirmation
   - Bulk delete in selection mode

#### Grocery List

1. **Create List**
   - Name it
   - Add items manually
   - Add from recipe (all or selected ingredients)

2. **Manage Items**
   - Check/uncheck items
   - Edit quantities
   - Remove items
   - Group by category

3. **Share List**
   - Export as text
   - Share via system share sheet

#### Recipe Import

1. **URL Import**
   - Paste recipe URL
   - Extract: title, ingredients, instructions, image
   - Edit before saving

2. **OCR Import**
   - Capture or select image
   - Extract text via ML Kit
   - Parse into structured recipe
   - Manual correction

3. **Manual Entry**
   - Empty form
   - Template suggestions

---

## 6. Responsive Layout (Web)

| Breakpoint | Layout                            |
| ---------- | --------------------------------- |
| < 640px    | Single column, bottom tabs        |
| 640-1024px | Two columns, sidebar nav          |
| > 1024px   | Three columns (nav, list, detail) |

---

## 7. Animations & Transitions

- **Screen transitions:** Slide from right (stack), fade (tabs)
- **List items:** Fade in on load
- **Cards:** Scale press (0.98)
- **FAB:** Rotate on press
- **Delete:** Slide out left with fade

---

## 8. Error Handling

- **Network errors:** Toast with retry option
- **Validation errors:** Inline field errors
- **Import failures:** Alert with manual entry fallback
- **Offline mode:** Queue operations, sync on reconnect

---

## 9. Success Metrics

- Recipe CRUD operations complete
- Grocery list generation works
- URL import parses at least title + ingredients
- OCR extracts readable text
- Web responsive at all breakpoints

---

## 10. File Structure

```
app/
├── tabs
│   ├── _layout.tsx
│   ├── index.tsx        (Recipes list)
│   ├── grocery.tsx     (Grocery list)
│   └── settings.tsx   (Settings)
├── recipe/
│   ├── [id].tsx       (Detail)
│   ├── add.tsx        (Add new)
│   ├── edit/[id].tsx  (Edit)
│   └── import.tsx     (Import wizard)
├── auth/
│   └── login.tsx
├── components/
│   ├── RecipeCard.tsx
│   ├── IngredientInput.tsx
│   ├── InstructionInput.tsx
│   ├── GroceryItem.tsx
│   └── ...
├── lib/
│   ├── supabase.ts
│   ├── store.ts
│   └── utils.ts
├── hooks/
├── types/
└── constants/
```
