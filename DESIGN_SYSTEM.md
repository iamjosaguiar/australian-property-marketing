# Design System Documentation

Your design system is **fully configured at the file/system level** using Tailwind CSS.

## 📂 Configuration Files

### 1. `tailwind.config.ts` (Primary Design System)
Main configuration file where all design tokens are defined.

### 2. `app/globals.css` (CSS Variables)
Additional styles and CSS custom properties.

---

## 🎨 Color System

All colors are configured and ready to use via Tailwind classes:

### Brand Colors
```typescript
primary: "#F05C3E"      // Coral/Orange (your logo color)
secondary: "#000000"    // Pure Black
```

**Usage in code:**
```tsx
<button className="bg-primary text-white">Click Me</button>
<div className="bg-secondary text-white">Content</div>
```

### Neutral Colors
```typescript
"soft-grey": "#f8f9fa"
"charcoal": "#1a1a1a"
"navy-deep": "#000000"
"navy-800": "#1a1a1a"
```

**Usage:**
```tsx
<div className="bg-soft-grey">Light background</div>
<p className="text-charcoal">Dark text</p>
```

### UI Colors
```typescript
"background-main": "#f8fafc"
"border-light": "#e5e7eb"
"sidebar-bg": "#ffffff"
```

**Usage:**
```tsx
<div className="border border-border-light">Card</div>
```

---

## 🔤 Typography

### Font Family
**Inter** - Google Font loaded globally

**Usage:**
```tsx
<h1 className="font-display">Heading</h1>
```

### Font Sizes (Tailwind defaults)
```tsx
text-xs    // 12px
text-sm    // 14px
text-base  // 16px
text-lg    // 18px
text-xl    // 20px
text-2xl   // 24px
text-3xl   // 30px
text-4xl   // 36px
text-5xl   // 48px
text-6xl   // 60px
text-7xl   // 72px
```

### Font Weights
```tsx
font-light   // 300
font-normal  // 400
font-medium  // 500
font-semibold // 600
font-bold    // 700
font-black   // 900
```

---

## 📐 Spacing

Tailwind's spacing scale (based on 0.25rem = 4px):

```tsx
p-1   // padding: 4px
p-2   // padding: 8px
p-3   // padding: 12px
p-4   // padding: 16px
p-6   // padding: 24px
p-8   // padding: 32px
p-10  // padding: 40px
p-12  // padding: 48px
// etc...

m-1, m-2, m-3... // margins
gap-1, gap-2... // flexbox gaps
```

---

## 🔘 Border Radius

Custom border radius tokens:

```typescript
DEFAULT: "0.25rem"  // 4px
lg: "0.5rem"        // 8px
xl: "0.75rem"       // 12px
"2xl": "1rem"       // 16px
full: "9999px"      // fully rounded
```

**Usage:**
```tsx
<button className="rounded-lg">Standard button</button>
<div className="rounded-xl">Card</div>
<img className="rounded-full">Avatar</img>
```

---

## 🌑 Shadows

Custom shadow tokens:

```typescript
shadow-subtle   // Soft, subtle shadow
shadow-hover    // Elevated hover state
```

**Usage:**
```tsx
<div className="shadow-subtle">Card</div>
<button className="hover:shadow-hover">Button</button>
```

Also available (Tailwind defaults):
```tsx
shadow-sm
shadow
shadow-md
shadow-lg
shadow-xl
shadow-2xl
```

---

## 🎯 How to Use the Design System

### Example Component:
```tsx
export default function Card() {
  return (
    <div className="
      bg-white
      border border-border-light
      rounded-xl
      p-6
      shadow-subtle
      hover:shadow-hover
      transition-all
    ">
      <h3 className="text-2xl font-bold text-navy-deep mb-4">
        Card Title
      </h3>
      <p className="text-slate-600 mb-6">
        Card description text
      </p>
      <button className="
        bg-primary
        hover:bg-primary/90
        text-white
        font-semibold
        px-6
        py-3
        rounded-lg
        transition-colors
      ">
        Learn More
      </button>
    </div>
  );
}
```

---

## 🔄 Updating the Design System

### To Change Colors:
1. Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: "#YOUR_NEW_COLOR",
}
```

2. The change applies **everywhere** automatically!

### To Add New Colors:
```typescript
colors: {
  primary: "#F05C3E",
  "brand-blue": "#1E40AF",  // Add new color
}
```

**Usage:**
```tsx
<div className="bg-brand-blue">Content</div>
```

---

## ✅ Benefits of System-Level Configuration

1. **Single Source of Truth** - All design tokens in one place
2. **Automatic IntelliSense** - VS Code autocompletes all classes
3. **Type Safety** - TypeScript ensures valid colors/values
4. **Easy Updates** - Change once, applies everywhere
5. **Consistent Design** - Everyone uses the same values
6. **No Magic Numbers** - No hardcoded colors/sizes in components

---

## 🚀 Quick Reference

### Common Patterns:

**Primary Button:**
```tsx
className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-lg"
```

**Card:**
```tsx
className="bg-white border border-border-light rounded-xl p-6 shadow-subtle"
```

**Heading:**
```tsx
className="text-4xl font-black text-navy-deep"
```

**Link:**
```tsx
className="text-primary hover:underline"
```

**Input:**
```tsx
className="border border-border-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
```

---

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Color Palette Tool](https://tailwindcss.com/docs/customizing-colors)
- [Spacing Scale](https://tailwindcss.com/docs/customizing-spacing)

---

**Your design system is production-ready!** 🎉

All colors, typography, spacing, and styles are configured at the system level. Just use Tailwind classes in your components.
