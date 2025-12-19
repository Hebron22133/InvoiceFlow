# InvoiceFlow - Invoice Management Web Application

A modern, full-featured invoice management application built with Next.js 15, React 19, and Tailwind CSS.

## Features

- **Dashboard** - Overview of revenue, invoices, and client statistics
- **Invoice Management** - Create, edit, view, and delete invoices
- **Client Management** - Manage client information and track client-specific invoices
- **Multi-Currency Support** - Switch between USD ($) and Nigerian Naira (₦)
- **Dark/Light Mode** - Theme toggle for user preference
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **State Management**: Zustand
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── dashboard/
│   │   ├── clients/        # Client management
│   │   ├── invoices/       # Invoice CRUD operations
│   │   └── settings/       # App settings & preferences
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Landing page
├── components/
│   ├── invoices/           # Invoice-specific components
│   ├── layout/             # Layout components (sidebar, header)
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── utils/              # Utility functions (calculations, etc.)
│   ├── currency-context.tsx # Currency selection context
│   ├── store.ts            # Zustand store
│   ├── types.ts            # TypeScript types
│   └── mock-data.ts        # Sample data
└── hooks/                  # Custom React hooks
```

## Currency Settings

Users can switch between currencies in **Settings > Invoice Defaults**:
- **USD** - United States Dollar ($)
- **NGN** - Nigerian Naira (₦)

The selected currency persists in localStorage and applies across all invoice displays.

## License

MIT License
