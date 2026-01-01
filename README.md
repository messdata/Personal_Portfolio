# MindTree Portfolio

A modern, interactive portfolio website built to showcase professional experience in Business Analytics alongside data visualization projects. This project serves as both a professional presentation platform and a hands-on learning journey into full-stack web development.

🌐 **Live Demo:** [Your Vercel URL]

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Learning Journey](#learning-journey)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 About the Project

MindTree is a personal portfolio platform designed to bridge the gap between business analytics and web development. As a Business Analytics graduate from Maynooth University with 6+ years of experience in e-commerce and FMCG sectors, I built this project to:

- **Showcase professional work:** Display Excel dashboards, Tableau visualizations, and PowerPoint presentations
- **Learn by doing:** Transition from business analytics to practical web development
- **Experiment openly:** Create a playground for testing new technologies and design patterns
- **Document progress:** Track both successes and failures transparently

This isn't just a static portfolio—it's a living testament to continuous learning and skill development.

---

## ✨ Features

### Visitor-Facing Features
- **Interactive Welcome Page** - WebGL particle effects creating an engaging first impression
- **Professional About Section** - Detailed background, skills, and experience overview
- **Dynamic CV/Resume** - Downloadable PDF with comprehensive professional history
- **Projects Showcase** - Embedded Google Slides presentations with downloadable resources
- **Contact Form** - Real-time message submission with validation
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop viewing

### Admin Panel Features
- **Secure Authentication** - PIN-based access control for admin operations
- **Project Management** - Full CRUD operations for portfolio projects
- **Message Management** - View and respond to contact form submissions
- **Analytics Dashboard** - Track visitor interactions and engagement metrics
- **Media Management** - Upload and organize images via Cloudinary integration
- **Real-time Updates** - Instant synchronization across all admin operations

### Design Highlights
- **Glassmorphic UI** - Modern frosted glass aesthetic with blur effects
- **Purple/Violet Theme** - Distinctive color scheme with neon accents
- **Smooth Animations** - Powered by Framer Motion and GSAP
- **Bento Grid Layout** - Organized, Pinterest-style admin interface

---

## 🛠️ Tech Stack

### Frontend
- **[Astro](https://astro.build/)** - Modern static site generator for optimal performance
- **[React](https://react.dev/)** - Component library for interactive UI elements
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript for fewer runtime errors
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework for rapid styling

### Backend & Database
- **[Supabase](https://supabase.com/)** - Open-source Firebase alternative
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication system
  - Row-level security

### Media & Storage
- **[Cloudinary](https://cloudinary.com/)** - Image optimization and delivery
- **[Google Drive](https://drive.google.com/)** - Document storage for downloadable resources
- **[Google Slides](https://slides.google.com/)** - Presentation embedding

### Animation & Effects
- **[Framer Motion](https://www.framer.com/motion/)** - React animation library
- **[GSAP](https://greensock.com/gsap/)** - Professional-grade animation platform
- **[Three.js](https://threejs.org/)** - 3D graphics and WebGL effects

### Deployment & DevOps
- **[Vercel](https://vercel.com/)** - Serverless deployment platform
- **[GitHub](https://github.com/)** - Version control and CI/CD integration

### UI Components
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon library
- **[Chart.js](https://www.chartjs.org/)** - Analytics visualization

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Supabase Account** (free tier available)
- **Cloudinary Account** (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mindtree-portfolio.git
   cd mindtree-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Supabase Configuration
   PUBLIC_SUPABASE_URL=your_supabase_project_url
   PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Admin Authentication
   ADMIN_PIN=your_secure_pin
   
   # Cloudinary Configuration
   PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email Configuration (Optional)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Set up Supabase Database**
   
   Run the following SQL in your Supabase SQL Editor:
   ```sql
   -- Projects Table
   CREATE TABLE projects (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT,
     category TEXT,
     slides_url TEXT,
     download_url TEXT,
     image_url TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Messages Table
   CREATE TABLE messages (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT NOT NULL,
     message TEXT NOT NULL,
     read BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Analytics Table
   CREATE TABLE analytics (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     page_view TEXT,
     action TEXT,
     timestamp TIMESTAMP DEFAULT NOW()
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:4321`

---

## 📁 Project Structure

```
mindtree-portfolio/
├── public/                    # Static assets
│   ├── images/               # Image files
│   └── cv/                   # Downloadable CV PDFs
├── src/
│   ├── components/           # React components
│   │   ├── Welcome.tsx       # WebGL particle welcome page
│   │   ├── About.tsx         # About section
│   │   ├── Projects.tsx      # Projects showcase
│   │   ├── Contact.tsx       # Contact form
│   │   └── Admin/            # Admin panel components
│   │       ├── AdminPanel.tsx
│   │       ├── ProjectsManager.tsx
│   │       ├── MessagesManager.tsx
│   │       └── Analytics.tsx
│   ├── layouts/              # Page layouts
│   │   └── Layout.astro      # Base layout template
│   ├── pages/                # Astro pages (file-based routing)
│   │   ├── index.astro       # Homepage
│   │   ├── about.astro       # About page
│   │   ├── projects.astro    # Projects page
│   │   ├── contact.astro     # Contact page
│   │   └── admin.astro       # Admin panel
│   ├── lib/                  # Utility functions
│   │   └── supabase.ts       # Supabase client setup
│   └── styles/               # Global styles
│       └── global.css        # Custom CSS and Tailwind
├── .env                      # Environment variables (not in git)
├── astro.config.mjs          # Astro configuration
├── tailwind.config.mjs       # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `ADMIN_PIN` | Secure PIN for admin access | Yes |
| `PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `EMAIL_USER` | Gmail address for contact form | Optional |
| `EMAIL_PASS` | Gmail app password | Optional |

**Security Note:** Never commit `.env` files to version control. Add `.env` to `.gitignore`.

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env`
   - Click "Deploy"

3. **Automatic Deployments**
   - Every push to `main` branch triggers automatic deployment
   - Preview deployments created for pull requests

### Manual Deployment

```bash
npm run build
npm run preview
```

The build output is in the `dist/` directory and can be deployed to any static hosting service.

---

## 📚 Learning Journey

### Key Learnings

**Framework Selection**
- Initially started with Next.js but faced persistent build issues
- Pivoted to Astro for better static site generation and simpler deployment
- **Lesson:** Choose the right tool for the job; don't fight the framework

**Development Approach**
- File-by-file development enables faster iteration and troubleshooting
- Systematic debugging with screenshots and console logs
- Test pages to isolate issues before implementing in main codebase
- **Lesson:** Break complex problems into smaller, manageable pieces

**Design Consistency**
- Unified glassmorphic design system across all pages
- Purple/violet theme with consistent neon accents
- Mobile-first responsive design principles
- **Lesson:** Visual consistency enhances professional presentation

**Database & Real-time Features**
- Supabase provides powerful real-time synchronization
- Row-level security for protecting admin operations
- Direct Cloudinary URLs more reliable than Google Drive for images
- **Lesson:** Real-time updates create engaging user experiences

**Authentication Patterns**
- PIN-based authentication sufficient for single-user admin panels
- Environment variables keep sensitive data secure
- No localStorage dependency for better security
- **Lesson:** Match security complexity to actual requirements

### Technical Challenges Overcome

1. **Build Failures** - Resolved by switching from Next.js to Astro
2. **Image Loading** - Fixed by using Cloudinary instead of Google Drive conversions
3. **Mobile Responsiveness** - Implemented systematic testing across breakpoints
4. **Real-time Sync** - Leveraged Supabase subscriptions for instant updates
5. **Admin Panel UX** - Created intuitive bento grid layout for management

---

## 🗺️ Roadmap

### Planned Features

- [ ] Dark/Light theme toggle
- [ ] Blog section for technical writing
- [ ] Case studies for major projects
- [ ] Advanced analytics with visitor tracking
- [ ] Multi-language support
- [ ] Performance optimization with lazy loading
- [ ] Accessibility improvements (WCAG compliance)
- [ ] SEO optimization with meta tags and sitemaps

### Under Consideration

- [ ] Integration with GitHub for project showcasing
- [ ] Interactive data visualization playground
- [ ] API for third-party integrations
- [ ] Newsletter subscription system
- [ ] Comments section on projects

---

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are always welcome!

### How to Provide Feedback

1. **Open an Issue** - Report bugs or suggest features
2. **Submit a Pull Request** - Propose improvements or fixes
3. **Share Ideas** - Contact me directly with thoughts

### Development Guidelines

- Follow existing code structure and naming conventions
- Write meaningful commit messages
- Test thoroughly before submitting PRs
- Update documentation when adding features

---

## 📄 License

This project is open-source and available under the **MIT License**.

You're free to:
- Use the code for learning purposes
- Fork and modify for your own portfolio
- Share with others interested in learning

**Attribution appreciated but not required.**

---

## 📧 Contact

**Chinu** - Business Analytics Graduate | Data Enthusiast | Aspiring Developer

- **LinkedIn:** [Your LinkedIn Profile]
- **Email:** [Your Email]
- **Portfolio:** [Your Live Website URL]
- **GitHub:** [Your GitHub Profile]

---

## 🙏 Acknowledgments

**Claude (Anthropic AI)** - For acting as a patient technical mentor throughout this learning journey, explaining not just "how" but "why" and "why not" for every decision.

**Open Source Community** - For creating and maintaining the incredible tools that made this project possible.

**Maynooth University** - For providing the foundation in Business Analytics that sparked this technical exploration.

---
