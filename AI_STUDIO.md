# AI Studio V1 Products

AI Studio is now finalized as a local-first Prompt Factory for RetroRide product content workflows.

## Final Scope

AI Studio supports this workflow:

Product
-> Reference Images
-> Product DNA
-> Background Library
-> Scene / Camera / Lighting
-> Prompt Factory
-> Copy / Export Prompt

The final prompt is used externally in:

- Google Flow
- Veo
- Other AI generation platforms

AI Studio does not generate images or videos internally. It does not call OpenAI image generation, Hugging Face image models, or store generated image/video assets.

## Quick Navigation

- [Architecture Guide](docs/ARCHITECTURE.md)
- [Product Roadmap](docs/ROADMAP.md)
- [Project Rules & Standards](docs/PROJECT_RULES.md)
- [Sprint Backlog](docs/SPRINTS.md)
- [Changelog](docs/CHANGELOG.md)

## Core Modules

- Products: product identity and workspace entry point.
- Reference Images: 7-slot visual source of truth for prompt construction.
- Product DNA: product attributes, visual locks, brand locks, and prompt constraints.
- Background Library: local background references used as prompt context.
- Prompt Factory: scene, camera, lighting, platform, aspect, duration, final prompt preview, copy, and TXT export.
