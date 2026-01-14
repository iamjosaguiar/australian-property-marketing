# Color Scheme Documentation

## Updated Color Palette

### Primary Colors
- **Primary**: `#F05C3E` - Vibrant coral/orange used for:
  - Call-to-action buttons
  - Active navigation states
  - Links and interactive elements
  - Brand accents throughout the site

- **Secondary/Black**: `#000000` - Pure black used for:
  - Main headings and text
  - Navigation backgrounds
  - Dark UI elements
  - Logo icon backgrounds

### Supporting Colors
- **Soft Grey**: `#f8f9fa` - Light backgrounds
- **Charcoal**: `#1a1a1a` - Secondary dark elements
- **Border Light**: `#e5e7eb` - Subtle borders and dividers
- **Background Main**: `#f8fafc` - Page backgrounds

## Tailwind CSS Configuration

The color system is configured in two places:

1. **tailwind.config.ts** - Main Tailwind configuration
2. **app/globals.css** - CSS custom properties with `@theme inline`

## Usage Examples

```tsx
// Primary button
<button className="bg-primary hover:bg-primary/90 text-white">
  Click me
</button>

// Secondary button with black background
<button className="bg-secondary text-white hover:bg-charcoal">
  Secondary
</button>

// Text with primary color
<span className="text-primary">Highlighted text</span>

// Primary colored icon
<span className="material-symbols-outlined text-primary">
  check_circle
</span>
```

## Brand Guidelines

### When to Use Primary Color (#F05C3E)
- Primary CTAs (Book Now, Get Started)
- Active navigation items
- Important icons and badges
- Hover states on interactive elements
- Accent elements that need attention

### When to Use Black (#000000)
- Logo backgrounds
- Main navigation bars
- Primary headings
- Dark theme elements
- Footer backgrounds

### Accessibility
- Primary color (#F05C3E) on white backgrounds meets WCAG AA for large text
- Always use white text on primary or black backgrounds for maximum contrast
- Ensure sufficient color contrast for all interactive elements
