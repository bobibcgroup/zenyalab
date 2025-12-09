# Zenya Lab - Premium Landing Page Build Instructions

## PROJECT OVERVIEW
Build a production-ready, single-fold "Coming Soon" landing page for **Zenya Lab** — a premium longevity, biohacking, and human optimization brand. This must feel like a luxury experience: modern, fast, mesmerizing, and built to convert.

---

## CORE REQUIREMENTS

### Visual Experience
- **Premium, not flashy**: Subtle sophistication over loud effects
- **Mesmerizing 3D background**: Spline scene integration that enhances without overwhelming
- **Micro-animations throughout**: Smooth fade-ins, floating elements, subtle glows, and hover states
- **Fast loading**: Optimize all assets, lazy load where appropriate
- **Production-ready**: Fully responsive, tested on mobile/tablet/desktop

### Brand Identity - Zenya Lab Color Palette
```
Zenya Black: #0C0C0D (primary background)
Deep Space Teal: #0F2F3A (secondary backgrounds, cards)
Longevity Cyan: #00D1C7 (primary accents, CTAs)
Electric Mint: #A3FFE4 (highlights, glows, hover states)
```

---

## PAGE STRUCTURE & CONTENT

### Header Section
- Small, elegant logo/wordmark: **"ZENYA LAB"**
- Subtle letter-spacing and fade-in animation on load
- Position: top-left or center, floating above the scene

### Hero Content (Center-focused)
1. **Main Headline**: 
   ```
   "Precision Longevity, Coming Soon."
   ```
   - Ultra-bold, large typography
   - Gradient text effect using Longevity Cyan to Electric Mint
   - Subtle text glow/shadow for depth
   - Staggered fade-in animation (word by word or letter by letter)

2. **Subheadline**:
   ```
   "A new standard in elite biohacking and human optimization."
   ```
   - Clean, lighter weight font
   - Soft cyan color (#00D1C7 at 80% opacity)
   - Fade-in with slight upward drift animation

3. **Waitlist Form** (Optional but recommended):
   - Glassmorphic input field for email
   - Elegant "Notify Me" or "Join Waitlist" button
   - Button should have:
     - Longevity Cyan background (#00D1C7)
     - Hover state: Electric Mint glow effect
     - Smooth scale and glow transition on hover
     - Success state animation after submission
   - Input field design:
     - Dark background with subtle border
     - Placeholder: "Enter your email"
     - Focus state: Electric Mint border glow

### Footer
- Tiny, subtle text at bottom:
  ```
  "Zenya Lab · Advanced human optimization & longevity."
  ```
- Low opacity (30-40%)
- Fade-in on load

---

## ANIMATION SPECIFICATIONS

### On Page Load (Choreographed sequence)
1. Spline scene fades in (0.8s)
2. "ZENYA LAB" wordmark fades in (0.6s delay)
3. Main headline animates in with stagger effect (1s delay)
4. Subheadline fades up (1.4s delay)
5. Waitlist form slides up gently (1.8s delay)
6. Footer fades in (2.2s delay)

### Micro-Animations (Continuous)
- **Headline**: Subtle breathing glow effect (very gentle pulse on gradient)
- **Input field**: Soft border glow on focus
- **Button**: 
  - Hover: Scale to 1.05, add Electric Mint shadow
  - Active: Slight press-down effect
  - Post-submit: Success checkmark with smooth transition
- **Background particles** (optional): Floating subtle dots/motes in Electric Mint, very low opacity

### Hover States
- All interactive elements should respond with smooth 200-300ms transitions
- Never use instant state changes — everything should feel fluid

---

## DESIGN SYSTEM

### Typography
Use modern, clean sans-serif fonts:
- **Primary**: Inter, Söhne, Neue Haas Grotesk Display, or SF Pro Display
- **Headline**: 700-900 weight, 3.5rem-5rem size (responsive)
- **Subheadline**: 400-500 weight, 1.125rem-1.5rem size
- **Body/Form**: 400-500 weight, 1rem size
- **Footer**: 300-400 weight, 0.875rem size
- Letter-spacing: Slightly increased for headlines (+0.02em)

### Glassmorphism Elements
Apply to form container:
```
- Background: rgba(15, 47, 58, 0.3) [Deep Space Teal with transparency]
- Backdrop blur: 12px
- Border: 1px solid rgba(0, 209, 199, 0.2)
- Border radius: 12-16px
- Box shadow: 0 8px 32px rgba(0, 0, 0, 0.3)
```

### Spacing & Layout
- **Generous negative space**: Content should breathe
- **Vertical rhythm**: Use consistent spacing scale (8px base)
- **Max content width**: 600-800px for readability
- **Padding**: Ample padding around all elements (min 20px mobile, 40px desktop)

---

## SPLINE 3D BACKGROUND

### Integration Details
- **Scene URL**: `https://prod.spline.design/OU98m3jtpI1f2IZC/scene.splinecode`
- Must be full-screen, positioned absolutely behind content
- Add dark gradient overlay (radial from center) to ensure text readability:
  ```
  Gradient: radial-gradient(circle at center, transparent 0%, rgba(12, 12, 13, 0.7) 100%)
  ```
- Scene should be subtle — if it competes with text, reduce its opacity to 60-80%
- Ensure it doesn't impact performance (monitor FPS, add loading state if needed)

### Loading Strategy
- Show elegant loading spinner/animation while Spline loads
- Fade in the scene smoothly once ready
- Fallback: Dark gradient background if Spline fails to load

---

## TECHNICAL IMPLEMENTATION

### Tech Stack (Required)
- **Framework**: Next.js 14+ (App Router)
- **Styling**: TailwindCSS with custom config for Zenya colors
- **3D**: @splinetool/react-spline (or @splinetool/react-spline/next)
- **Animations**: Framer Motion for advanced animations (optional but recommended)
- **Forms**: React Hook Form + basic validation
- **Fonts**: Next.js font optimization (next/font)

### File Structure
```
/app
  /page.tsx (main landing page)
  /layout.tsx (root layout with fonts)
  /globals.css (custom styles, animations)
/components
  /HeroSection.tsx
  /WaitlistForm.tsx
  /SplineBackground.tsx
  /LoadingState.tsx (optional)
/lib
  /utils.ts (helper functions)
/public
  (any static assets)
tailwind.config.ts (custom Zenya colors)
```

### Tailwind Configuration
Extend the config with Zenya brand colors:
```typescript
colors: {
  zenya: {
    black: '#0C0C0D',
    teal: '#0F2F3A',
    cyan: '#00D1C7',
    mint: '#A3FFE4',
  }
}
```

Add custom animations:
```typescript
animation: {
  'fade-in': 'fadeIn 0.8s ease-out',
  'slide-up': 'slideUp 0.6s ease-out',
  'glow-pulse': 'glowPulse 3s ease-in-out infinite',
}
```

### Responsive Behavior
- **Mobile (< 640px)**:
  - Stack all elements vertically
  - Reduce headline size (2.5rem)
  - Smaller padding (20px)
  - Full-width form elements
  - Reduce Spline scene complexity if possible

- **Tablet (640px - 1024px)**:
  - Balanced sizing
  - Comfortable padding (32px)

- **Desktop (> 1024px)**:
  - Full hero layout
  - Maximum visual impact
  - Optimal Spline scene visibility

### Performance Optimization
- Lazy load Spline component
- Use Next.js Image component for any images
- Minimize bundle size
- Use CSS transforms for animations (GPU-accelerated)
- Add meta tags for SEO (even for coming soon page)
- Implement proper loading states

---

## QUALITY CHECKLIST

### Visual Quality
- [ ] Colors match exact brand palette
- [ ] Typography is crisp and premium
- [ ] Animations are smooth (60fps)
- [ ] Glassmorphism effects render correctly
- [ ] Text is always readable against background
- [ ] Hover states feel responsive and polished

### Technical Quality
- [ ] Page loads fast (< 3s on 4G)
- [ ] No console errors or warnings
- [ ] Fully responsive on all devices
- [ ] Accessibility: proper semantic HTML, ARIA labels
- [ ] Form validation works
- [ ] Spline scene has fallback
- [ ] Works on Chrome, Safari, Firefox, Edge

### Premium Feel
- [ ] Feels luxurious, not generic
- [ ] Animations enhance, not distract
- [ ] Spacing feels generous and intentional
- [ ] Color usage is sophisticated
- [ ] Overall vibe matches "elite longevity lab"

---

## DELIVERABLES

Generate a complete, production-ready Next.js project including:

1. All component files with clean, commented code
2. Tailwind config with Zenya brand colors
3. Global CSS with custom animations
4. Fully functional waitlist form (with client-side validation)
5. Spline integration with loading states
6. Responsive design tested across viewports
7. README with setup instructions
8. Environment variables template (if needed for form submission)

---

## FINAL NOTES

This landing page must feel like you're stepping into the future of human optimization. Every pixel, every animation, every color choice should communicate:

**"This is premium. This is precision. This is the future of longevity."**

The experience should be so polished that visitors feel compelled to join the waitlist immediately. Make it **mesmerizing but minimal**, **powerful but elegant**, **futuristic but trustworthy**.

Build something that Zenya Lab's elite clientele would expect — nothing less than extraordinary.