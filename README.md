# Selenium Documentation Website

A modern, responsive documentation website for Selenium WebDriver properties built with Next.js and Tailwind CSS.

## Features

- 📱 Fully responsive design
- 🎨 Clean and modern UI
- 💡 Live code examples
- 🔍 Easy navigation with sidebar
- ⚡ Fast performance (Next.js)
- 🚀 Ready for Vercel deployment
- 🌙 Dark-friendly color scheme

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Deployment to Vercel

### Option 1: Using Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your repository
5. Click "Deploy"

## Project Structure

```
docs-website/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── DocSection.tsx
│   │   ├── CodeBlock.tsx
│   │   └── Navigation.tsx
│   └── data/
│       └── documentation.ts
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Documentation Content

The documentation includes:

- **WebDriver Properties**
  - Implicit Wait
  - Explicit Wait
  - Window & Frame Management
  - Cookies Management

- **Element Properties**
  - Locator Strategies
  - Element Interaction
  - Multiple Elements Selection

- **Wait Properties**
  - Page Load Wait
  - Expected Conditions

- **Browser Capabilities**
  - Chrome Options

- **Logging & Reporting**
  - Extent Reports

- **Advanced Topics**
  - Dropdown/Select Elements
  - Alert Handling
  - Frame/IFrame Handling
  - Keyboard Actions

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## License

MIT

