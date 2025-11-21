# Club Semilla

Website for Club Semilla - A talent agency representing actors, actresses, scriptwriters, and directors.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Material UI v7**
- **Supabase** (Database, Auth, Storage)
- **React Query** (Data fetching)
- **Zod** (Schema validation)
- **React Hook Form** (Form management)

## Features

- 🎭 Public pages for actors, actresses, scriptwriters, and directors
- 📝 Contact form for proposals
- 📤 Material submission form
- 🔐 Admin dashboard with authentication
- 🖼️ Image management for talent profiles and slider
- 📊 Dashboard with statistics
- 🔄 Drag and drop for reordering talents and slider images

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone git@github.com:rodrigoBruno1986/club-semilla.git
cd club-semilla
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Run database migrations:
```bash
# Make sure you have Supabase CLI installed
supabase db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── actores/           # Actors public pages
│   ├── actrices/          # Actresses public pages
│   ├── guionistas/        # Scriptwriters public pages
│   ├── directores/        # Directors public pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   └── ...
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── schemas/               # Zod validation schemas
├── supabase/              # Supabase migrations
└── types/                 # TypeScript type definitions
```

## Deployment

The easiest way to deploy this Next.js app is using [Vercel](https://vercel.com).

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Environment Variables

Make sure to set these environment variables in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (server-side only)

## License

Private project
