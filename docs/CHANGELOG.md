# Changelog

All notable changes to AI Studio will be documented in this file.

The format is based on Keep a Changelog, and this project follows semantic versioning for project milestones.

## [0.3.0] - 2026-08-10

### Changed

- Finalized AI Studio as a prompt-only Prompt Factory.
- Clarified the final workflow: Product -> Reference Images -> Product DNA -> Background Library -> Scene / Camera / Lighting -> Prompt Factory -> Copy / Export Prompt.
- Updated `/assets` to focus on Background Library only.

### Removed

- Removed internal Generate Image UI and preview surfaces.
- Removed internal OpenAI / Hugging Face image generation API, helpers, hooks, and dependencies.
- Removed GeneratedAsset from the active Prisma schema and added a migration to drop the local GeneratedAsset table.
- Removed backup and sprint experiment files for the internal image generation work.

### Notes

- Prompts are intended for external use in Google Flow, Veo, or other AI platforms.
- AI Studio does not generate images or videos internally.

## [0.2.0] - 2026-08-01

### Added

- Professional documentation structure.
- Product DNA UI polish with completion progress bar, completion status badge, and percentage indicator.
- Section icons for Product DNA categories.
- Visual required field indicators across identity, construction, and visual identity fields.
- Local Save and Reset button actions for Product DNA form state.

### Changed

- Improved spacing, card borders, form layout, and mobile responsiveness for the Product DNA tab.

## [0.1.0] - 2026-07-31

### Added

- Initial release of AI Studio V1 Products for RetroRide children's helmets.
- Next.js App Router structure with dashboard and sidebar navigation.
- Prisma ORM and SQLite local database setup.
- Product CRUD operations with status filters and details.
- 7-slot Reference Images system with local file uploads.
- Prompt Factory V1 with Google Flow / Veo prompts, camera/lighting presets, and TXT export.
