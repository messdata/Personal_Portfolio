# Phase I: Welcome Page

**Status:** 🔨 In Progress  
**Goal:** Create an engaging, animated welcome page with Three.js effects

---

## 📋 Components to Build

### ✅ Completed
- [x] Project setup
- [x] Base layout
- [x] Global styles
- [x] Welcome page structure

### 🔨 In Progress
- [ ] FloatingLines background (Three.js shader)
- [ ] Typewriter hero text animation
- [ ] Animated Orb component
- [ ] FlippingButton (Welcome → Explore)
- [ ] NavigationNodes with glassmorphism

### ⏳ Pending
- [ ] Final polish & debugging
- [ ] Performance optimization
- [ ] Responsive design testing

---

## 🎯 Components Breakdown

### 1. FloatingLines (Background)
- **Tech:** Three.js + custom shaders
- **Purpose:** Animated background effect
- **File:** `src/components/welcome/FloatingLines.tsx`

### 2. TypewriterText
- **Tech:** Framer Motion or custom JS
- **Purpose:** Animated hero text
- **File:** `src/components/welcome/TypewriterText.tsx`

### 3. Orb
- **Tech:** React + animations
- **Purpose:** Interactive floating orb
- **File:** `src/components/welcome/Orb.tsx`

### 4. FlippingButton
- **Tech:** Framer Motion
- **Purpose:** Animated CTA button
- **File:** `src/components/welcome/FlippingButton.tsx`

### 5. NavigationNodes
- **Tech:** React + Tailwind (glassmorphism)
- **Purpose:** Navigate to other pages
- **File:** `src/components/welcome/NavigationNodes.tsx`

---

## 🐛 Known Issues
- None yet!

---

## 📝 Notes
- Building one component at a time
- Testing each component before moving to next
- Focus on z-index layering from the start