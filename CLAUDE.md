# EzDarta — Project Context for Claude Code

## What is EzDarta?
EzDarta (ezdarta.np) is a Nepal-focused business registration platform — similar to Bizee or Tailor Brands in the US. Users fill a simple form online and EzDarta handles the entire registration process on their behalf: OCR filing, PAN/VAT registration, and compliance.

**Target users:** Nepali entrepreneurs, small business owners, and diaspora Nepalis abroad wanting to register a business in Nepal.

---

## Tech Stack
 -**Frontend**
  - Next.js 16 (App Router) — React framework
  - React 19 — UI library
  - TypeScript 5 — Type safety
  - Tailwind CSS 3 — Styling
  - Framer Motion 12 — Animations
  - Radix UI — Headless UI components (Checkbox, Select, Tabs, Toast, etc.)
  - Lucide React — Icons
  - React Hook Form — Form management
  - shadcn/ui conventions — clsx, tailwind-merge, class-variance-authority

 -**Backend / Auth**
  - Next.js API Routes / Server Actions — Backend logic
  - NextAuth v5 (beta) — Authentication
  - bcryptjs — Password hashing
  - Resend — Transactional email

 -**Database**
  - PostgreSQL — Database
  - Prisma 5 — ORM & schema management

 -**Tooling**
  - ESLint 9 — Linting
  - PostCSS / Autoprefixer — CSS processing

> ⚠️ Update this section if the stack changes.

---

## Brand & Design

### Colors (use these — do not invent new ones)
```css
--blue: #2D9CDB;          /* Primary — CTAs, links, active states */
--blue-dark: #1A6FA3;     /* Hover states, gradients */
--blue-light: #E8F5FD;    /* Blue backgrounds, badges */
--green: #34D399;         /* Success, completion, growth */
--green-dark: #059669;    /* Green hover states */
--green-light: #ECFDF5;   /* Success backgrounds */
--crimson: #DC143C;       /* Nepal accent — use SPARINGLY */
--crimson-light: #FFF0F3; /* Crimson backgrounds only */
--white: #FFFFFF;
--gray-50: #F8FAFC;       /* Page background */
--gray-100: #F1F5F9;      /* Card borders, dividers */
--gray-200: #E2E8F0;
--gray-400: #94A3B8;      /* Placeholder text, labels */
--gray-600: #475569;      /* Body text */
--gray-800: #1E293B;      /* Headings */
--gray-900: #0F172A;      /* Dark backgrounds, footer */
```

### Typography
- **Headings / Logo:** `Sora` (Google Fonts) — bold, modern, geometric
- **Body / UI:** `Plus Jakarta Sans` (Google Fonts) — friendly, legible
- Import in layout: `https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap`

### Logo
- "Ez" in `#2D9CDB` (blue), "Darta" in dark or white depending on background
- Logo icon: rounded square with blue→green gradient, "Ez" text in white
- Never distort or recolor the logo

### Design Tone
- Clean, modern, trustworthy — NOT corporate or stiff
- Lots of white space, soft shadows, rounded corners (12–20px)
- Blue + green gradient accents on key elements
- Nepal Crimson (`#DC143C`) used only as a subtle national identity accent (badges, flag emoji, etc.) — never as a primary color
- Mix Nepali and English naturally in copy (e.g., "Nepal को business दर्ता")

### UI Patterns
- Primary buttons: blue gradient with shadow `0 4px 16px rgba(45,156,219,0.35)`
- Success/approval states: green (`#34D399`)
- Status badges: pill-shaped, color-coded (blue = pending, green = approved)
- Cards: white background, `border-radius: 16px`, subtle `box-shadow`

---

## Taglines & Copy Tone
- Primary tagline: *"Register Smart. Start Fast."*
- Nepali tagline: *"Nepal को Business Registration, सजिलो बनाउँदै"*
- Tone: approachable, confident, no legal jargon
- Always write for someone who has never registered a business before

---

## Core Features (build context)
1. **Online registration form** — collects business details, owner info, documents
2. **Status dashboard** — users track their registration progress
3. **PAN/VAT registration** — bundled into the flow
4. **Document upload** — citizenship, photos, etc.
5. **Email/SMS notifications** — status updates
6. **Admin panel** — EzDarta team processes applications

---

## Folder Structure
```
/app                  # Next.js App Router pages
  /dashboard          # User dashboard
  /register           # Registration flow
  /admin              # Admin panel
/components
  /ui                 # Reusable UI components
  /forms              # Form components
/lib
  /firebase.ts        # Firebase config
  /utils.ts           # Helpers
/styles
  /globals.css        # CSS variables (use brand colors above)
```

---

## Key Rules for Claude Code
1. **Always use brand colors** — never use arbitrary hex values or Tailwind defaults for primary UI
2. **Use Sora for headings, Plus Jakarta Sans for body** — always import both fonts
3. **Mobile-first** — most Nepali users will be on mobile
4. **Keep forms simple** — one question per screen where possible, reduce overwhelm
5. **Nepali language support** — UI should gracefully handle Nepali Unicode text
6. **No dark mode for now** — light theme only until v2
7. **Accessibility** — sufficient color contrast, focus states on all interactive elements
8. **Don't add unnecessary dependencies** — keep the bundle lean

---

## Notes
- OCR = Office of Company Registrar (Nepal's business registration authority)
- PAN = Permanent Account Number (Nepal's tax ID, equivalent to US EIN)
- VAT = Value Added Tax registration
- The registration process in Nepal typically takes days/weeks manually — EzDarta's value prop is speed + simplicity
