# AI Studio Architecture

This document outlines the technical architecture of **AI Studio**, clearly distinguishing between the **Current Active Architecture (V1)** and the **Future Planned Architecture**.

---

## 1. Current Active Architecture (V1)

The current V1 implementation is a robust local-first development system optimized for rapid prototyping and offline-ready workflow for RetroRide children's helmets.

### Core Tech Stack
* **Framework:** Next.js 16 (App Router) with React Server & Client Components
* **Language:** TypeScript (Strict typing enabled)
* **Styling:** Tailwind CSS & custom styling in `app/globals.css`
* **Icons:** `lucide-react`
* **ORM:** Prisma ORM (`@prisma/client`)
* **Database:** SQLite (`prisma/dev.db`) managed via Prisma migrations
* **Storage (Reference Images):** Local filesystem (`public/uploads/products/`) paired with local browser state fallback (`localStorage`)

### System & Directory Structure
```text
ai-studio/
├── app/                  # Next.js App Router pages and API routes
│   ├── api/products/     # REST API endpoints for product CRUD and images
│   ├── dashboard/        # Overview dashboard
│   ├── products/         # Product workspace and detail views ([id])
│   ├── prompt-factory/   # AI Prompt Builder for Google Flow/Veo
│   ├── assets/           # Asset management stub
│   ├── content/          # Content scheduling stub
│   └── settings/         # Settings stub
├── components/           # Reusable UI components (PromptBuilder, ReferenceImageCard, etc.)
├── lib/                  # Shared utilities, Prisma client instance, and demo data
├── prisma/               # Prisma schema, migrations, and SQLite dev database
├── public/               # Static assets and local product upload directories
└── supabase/             # SQL schema templates for future cloud migration
```

### Database Schema (Prisma / SQLite)
* **`Product` Model:** Stores core product DNA identifiers (`id`, `code`, `name`, `brand`, `category`, `theme`, `targetAge`, `shellMaterial`, `visor`, `buckle`, `status`, `description`, timestamps).
* **`ProductImage` Model:** Relational storage for 7-slot reference images linked by `productId`, `slot`, `filename`, and local file `path`.

---

## 2. Future Planned Architecture

The following components and infrastructure are part of the roadmap and are not yet active in the V1 runtime:

* **Database Migration:** Transition from local SQLite (`prisma/dev.db`) to **Supabase PostgreSQL** for robust multi-user relational data.
* **Cloud Storage:** Migration of reference images from local filesystem storage (`public/uploads/`) to **Supabase Storage** buckets with secure signed URLs.
* **Cloud Deployment:** Production hosting on Vercel / Supabase cloud infrastructure with edge caching.
* **Authentication & Multi-User Support:** Role-based access control (RBAC) via Supabase Auth.
