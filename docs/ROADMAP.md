# AI Studio Product Roadmap

This roadmap defines the strategic evolution of **AI Studio** for RetroRide children's helmets and commercial AI content generation.

---

## Phase 1: V1 Foundation & Local-First Prototype (Completed)
* [x] Next.js 16 App Router setup with responsive dashboard and navigation sidebar.
* [x] Prisma ORM and SQLite local database integration.
* [x] Product CRUD workspace with status filtering and details.
* [x] 7-Slot Reference Images UI (Front, Front-Left, Left, Right, Back, Front-Right, Top with logo).
* [x] Interactive Prompt Factory for Google Flow / Veo with automatic Product, Graphic, and Negative locks.

## Phase 2: Product DNA Polish & UX Refinement (Current / S4.1B)
* [x] Product DNA UI overhaul with modern cards, section icons, completion progress bars, and required field indicators.
* [x] Save and Reset state interactions for Product DNA profiles.

## Phase 3: Cloud Persistence & Supabase Storage (Upcoming / S4.2)
* [ ] Migrate reference image storage from local filesystem (`public/uploads`) to **Supabase Storage** buckets.
* [ ] Full end-to-end database persistence of Product DNA specifications to PostgreSQL.
* [ ] Environment configuration hardening and Supabase client integration.

## Phase 4: Asset Library & Content Scheduler
* [ ] Implement full `/assets` module for managing generated AI images and videos.
* [ ] Implement `/content` calendar planner for social media and marketplace publishing campaigns.

## Phase 5: Enterprise Multi-User & Marketplace Integration
* [ ] Supabase Auth implementation with team roles.
* [ ] Direct API integrations with advanced commercial AI video and image rendering pipelines.
