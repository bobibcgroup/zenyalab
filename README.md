# Zenya Lab - Premium Landing Page

A production-ready, single-fold "Coming Soon" landing page for **Zenya Lab** — a premium longevity, biohacking, and human optimization brand.

## Features

- 🎨 **Premium Design**: Sophisticated dark theme with Zenya brand colors
- ✨ **3D Background**: Spline scene integration with smooth loading states
- 🎭 **Micro-animations**: Choreographed fade-ins, floating elements, and hover states
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop
- ⚡ **Performance Optimized**: Fast loading with lazy loading and optimizations
- 🧬 **AI-Powered Assessment**: ChatGPT integration for personalized longevity analysis
- 📄 **PDF Export**: Branded PDF export with assessment results
- 📝 **Step-by-Step Form**: Multi-step lifestyle assessment wizard

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: TailwindCSS with custom Zenya color palette
- **3D**: @splinetool/react-spline
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **AI Analysis**: OpenAI GPT-4 API
- **PDF Export**: jsPDF
- **Fonts**: Next.js font optimization (Inter)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- OpenAI API key (for ChatGPT analysis)

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SITE_URL=https://zenyalab.com
NEXT_PUBLIC_CONTACT_EMAIL=contact@zenyalab.com
```

Get your OpenAI API key from: https://platform.openai.com/api-keys

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles and animations
├── app/
│   └── api/
│       └── analyze/
│           └── route.ts        # API route for ChatGPT analysis
├── components/
│   ├── SplineBackground.tsx    # 3D Spline scene component
│   ├── HeroSection.tsx          # Hero content with animations
│   ├── QuestionModal.tsx        # Step-by-step assessment form
│   ├── AssessmentResults.tsx    # Results display and PDF export
│   └── FloatingParticles.tsx    # Background particle effects
├── lib/
│   └── utils.ts            # Utility functions
├── tailwind.config.ts      # Tailwind config with Zenya colors
└── package.json
```

## Brand Colors

- **Zenya Black**: `#0C0C0D` (primary background)
- **Deep Space Teal**: `#0F2F3A` (secondary backgrounds, cards)
- **Longevity Cyan**: `#00D1C7` (primary accents, CTAs)
- **Electric Mint**: `#A3FFE4` (highlights, glows, hover states)

## Customization

### Waitlist Form Submission

To connect the waitlist form to your backend API, update the `onSubmit` function in `components/WaitlistForm.tsx`:

```typescript
const onSubmit = async (data: FormData) => {
  try {
    await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setIsSubmitted(true)
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}
```

### Spline Scene

The Spline scene URL is configured in `components/SplineBackground.tsx`. To use a different scene, update the `scene` prop:

```typescript
<Spline
  scene="YOUR_SPLINE_SCENE_URL"
  // ...
/>
```

## Build for Production

```bash
npm run build
npm start
```

## Performance Notes

- Spline scene is lazy-loaded for optimal performance
- Animations use GPU-accelerated CSS transforms
- Fonts are optimized via Next.js font system
- All assets are optimized for fast loading

## Browser Support

- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)

## Deployment

### Quick Deploy to Vercel (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Go to [Vercel](https://vercel.com/new) and import your repository**

3. **Add Environment Variables:**
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `NEXT_PUBLIC_SITE_URL` - Your website URL
   - `NEXT_PUBLIC_CONTACT_EMAIL` - Contact email

4. **Click Deploy** - Your site will be live in minutes!

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## License

Private - Zenya Lab

