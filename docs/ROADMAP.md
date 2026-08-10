# AI Studio Product Roadmap

This roadmap defines AI Studio as a prompt-only production tool for RetroRide product content workflows.

## Final Product Scope

AI Studio is a Prompt Factory. The supported workflow is:

Product
-> Reference Images
-> Product DNA
-> Background Library
-> Scene / Camera / Lighting
-> Prompt Factory
-> Copy / Export Prompt

Prompts are used externally in Google Flow, Veo, or other AI platforms.

AI Studio does not perform internal image or video generation.

## Phase 1: V1 Foundation & Local-First Prototype (Completed)

- [x] Next.js App Router setup with dashboard and navigation sidebar.
- [x] Prisma ORM and SQLite local database integration.
- [x] Product CRUD workspace.
- [x] 7-slot Reference Images workflow.
- [x] Prompt Factory for Google Flow / Veo style prompts.

## Phase 2: Product DNA & Prompt Quality (Completed)

- [x] Product DNA UI with identity, construction, visual identity, and protection locks.
- [x] Save and reset interactions for Product DNA profiles.
- [x] Prompt output built from product data, reference readiness, scene, camera, lighting, and platform settings.

## Phase 3: Background Library (Completed)

- [x] Local background upload and selection.
- [x] Active background context included in prompt wording.

## Phase 4: Prompt Factory Closure (Completed)

- [x] Removed internal Generate Image UI.
- [x] Removed internal OpenAI / Hugging Face image generation routes and helpers.
- [x] Removed GeneratedAsset runtime usage.
- [x] Kept Copy Prompt and Export TXT as final output actions.

## Future Options

- [ ] Improve prompt templates and platform-specific prompt presets.
- [ ] Add saved prompt recipes if persistence is needed.
- [ ] Optional Supabase persistence for multi-device product/reference data.
