# EduVerse 2050 – AI-Powered Education

**Gemini Webverse Challenge 2026**

> Education Without Boundaries, Powered by AI.

## Overview

EduVerse 2050 is an immersive storytelling website that envisions the future of education through artificial intelligence. Built with cutting-edge frontend technologies, it delivers a premium, cinematic experience showcasing how AI mentors, virtual reality classrooms, and adaptive intelligence will transform learning by 2050.

## Features

- **Loading Screen** — Animated gradient loading experience
- **Hero Section** — Full-screen particle canvas with parallax and dynamic CTAs
- **AI Poster** — Interactive 3D tilt poster with fullscreen modal preview
- **Soundtrack Player** — Custom audio player with equalizer, progress, volume, and loop controls
- **Story Timeline** — Animated timeline tracking education's evolution from 2030–2050
- **Feature Cards** — Glassmorphism cards with hover tilt and glow effects
- **Future Classroom** — Parallax scrolling poster section
- **Impact Counters** — Scroll-triggered animated statistics
- **Team Section** — Glassmorphism team cards with social links
- **Quote Section** — Animated gradient typography
- **Responsive Design** — Optimized for 320px to 1440px+

## Tech Stack

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties, glassmorphism, keyframe animations, responsive breakpoints
- **Vanilla JavaScript** — Intersection Observer, Canvas API, Audio API
- **Google Fonts** — Inter typeface

## Design System

| Token | Value |
|-------|-------|
| Primary Dark | `#0B1120` |
| Primary Mid | `#111827` |
| Primary Light | `#1E293B` |
| Accent Cyan | `#00E5FF` |
| Accent Purple | `#7C3AED` |
| Accent Blue | `#38BDF8` |
| Text White | `#FFFFFF` |
| Text Muted | `#CBD5E1` |

## Project Structure

```
/
├── index.html          # Main HTML document
├── style.css           # All styles and animations
├── script.js           # All interactive functionality
├── assets/
│   ├── poster-main.png       # Main AI poster image
│   ├── poster-classroom.png  # Classroom poster image
│   ├── music/
│   │   └── First_Light_of_day.mp3  # Soundtrack audio file
│   └── favicon.ico           # Favicon
└── README.md
```

## Setup

1. Clone or download the repository
2. Add your poster images to `assets/`:
   - `poster-main.png` (16:9 recommended)
   - `poster-classroom.png` (16:9 recommended)
3. Add your soundtrack to `assets/music/First_Light_of_day.mp3`
4. Open `index.html` in a browser — no build step required

## Deployment

### Deploy on Render (Static Site)

1. Push the repository to GitHub
2. On Render, create a new **Static Site**
3. Connect your GitHub repository
4. Set:
   - **Build Command:** *(leave empty)*
   - **Publish Directory:** `.`
5. Deploy

### Deploy on Netlify

1. Drag and drop the project folder onto Netlify Drop
2. Or connect your GitHub repository and deploy

## Performance

- Canvas-based particle system (GPU accelerated)
- Intersection Observer for scroll animations and counters
- Lazy-loaded images
- Debounced resize handlers
- RequestAnimationFrame for smooth animations
- Minimal DOM operations
- CSS transforms for animations (GPU composited)

## Accessibility

- Semantic HTML5 landmarks
- ARIA attributes on interactive elements
- Keyboard navigation support
- Reduced motion media query
- Focus-visible outlines
- Screen reader friendly labels

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+
- Opera 75+

## License

MIT — Free for personal and commercial use.

---

*Designed for the future. Built with AI.*
