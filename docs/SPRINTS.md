# Sprint Backlog & History

This document tracks completed and upcoming development sprints for AI Studio.

## Completed Sprints

### Sprint S1.0 - Project Initialization & Layout

- Goal: Establish Next.js App Router structure, global styling, and navigation sidebar.
- Status: Completed
- Deliverables: App layout, sidebar component, dashboard overview page, and placeholder modules.

### Sprint S2.0 - Product CRUD & Reference Images

- Goal: Enable product management and 7-slot reference image uploads.
- Status: Completed
- Deliverables: Prisma SQLite schema, REST API routes for products and image slots, product workspace UI, and reference image card components.

### Sprint S3.0 - Prompt Factory V1

- Goal: Implement a prompt builder for Google Flow / Veo with product and visual locks.
- Status: Completed
- Deliverables: PromptBuilder component, preset scenes, cameras, lighting styles, copy-to-clipboard, and TXT export.

### Sprint S4.1B - Product DNA UI Polish

- Goal: Polish the Product DNA user interface with professional headers, progress indicators, section icons, and responsive form cards.
- Status: Completed
- Deliverables: Product DNA tab with completion calculation, icon integration, required field indicators, and Save/Reset state actions.

### Sprint S5.0 - Prompt-Only Project Closure

- Goal: Close AI Studio as a clean Prompt Factory and remove internal image/video generation.
- Status: Completed
- Deliverables: Removed Generate Image UI, internal image generation API/routes/helpers, GeneratedAsset runtime usage, OpenAI/Hugging Face dependencies, and backup experiment files.

## Final Workflow

Product
-> Reference Images
-> Product DNA
-> Background Library
-> Scene / Camera / Lighting
-> Prompt Factory
-> Copy / Export Prompt

Generated prompts are used externally in Google Flow, Veo, or other AI platforms.

## Backlog

- Improve platform-specific prompt presets.
- Add optional saved prompt recipes if the workflow needs prompt history.
- Keep Supabase as a future persistence option; it is not part of the internal generation cleanup.
