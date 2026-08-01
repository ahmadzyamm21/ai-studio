# Database Architecture & Specification

This document defines the database architecture, current active schema, planned entity models, migration strategies, and naming conventions for **AI Studio**.

---

## 1. Current Database

* **Engine:** SQLite (`prisma/dev.db`)
* **ORM:** Prisma ORM (`@prisma/client`)
* **Management:** Prisma Migrations (`prisma/migrations/`)
* **Environment:** Local-first development runtime.

---

## 2. Current Prisma Models

Defined in `prisma/schema.prisma`:

### `Product`
Stores core product profile and metadata for RetroRide children's helmets.
```prisma
model Product {
  id            String   @id @default(cuid())
  code          String   @unique
  name          String
  brand         String
  category      String
  theme         String?
  targetAge     String?
  shellMaterial String?
  visor         String?
  buckle        String?
  status        String   @default("ACTIVE")
  description   String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  images        ProductImage[]
}
```

### `ProductImage`
Stores 7-slot reference image metadata for AI prompt conditioning.
```prisma
model ProductImage {
  id         String   @id @default(cuid())
  product    Product  @relation(fields: [productId], references: [id])
  productId  String
  slot       String
  filename   String
  path       String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([productId, slot])
}
```

---

## 3. Current Relations

* **Product to ProductImage (`1:N`):** A single `Product` can have multiple `ProductImage` records corresponding to reference slots (`Front`, `Front Left`, `Left`, `Right`, `Back`, `Front Right`, `Top`).
* **Unique Constraint:** `@@unique([productId, slot])` ensures that each reference slot is uniquely tied to a specific product without duplication.

---

## 4. Planned `ProductDNA` Model

*Status: Planned for future database extension.*

Stores granular product genetic specifications for advanced AI prompt conditioning.

```prisma
model ProductDNA {
  id              String   @id @default(cuid())
  product         Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId       String   @unique
  sku             String
  brand           String
  category        String
  ageRange        String?
  gender          String?
  material        String?
  finishing       String?
  visor           String?
  buckle          String?
  weight          String?
  sni             String?
  theme           String?
  primaryColor    String?
  secondaryColor  String?
  accentColor     String?
  pattern         String?
  logoPosition    String?
  brandLock       Boolean  @default(false)
  shapeLock       Boolean  @default(false)
  materialLock    Boolean  @default(false)
  graphicLock     Boolean  @default(false)
  logoLock        Boolean  @default(false)
  colorLock       Boolean  @default(false)
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## 5. Planned `AIAsset` Model

*Status: Planned for future database extension.*

Stores generated AI images and video assets produced via Prompt Factory and rendering integrations.

```prisma
model AIAsset {
  id              String   @id @default(cuid())
  product         Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId       String
  type            String   // 'IMAGE' | 'VIDEO'
  promptUsed      String
  filePath        String
  storageProvider String   @default("LOCAL") // 'LOCAL' | 'SUPABASE_STORAGE'
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## 6. Planned `PromptRecipe` Model

*Status: Planned for future database extension.*

Stores customized prompt generation recipes and configurations from the Prompt Factory module.

```prisma
model PromptRecipe {
  id              String   @id @default(cuid())
  product         Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId       String
  platform        String
  sceneId         String
  cameraId        String
  lightId         String
  aspectRatio     String
  duration        String
  generatedPrompt String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## 7. Migration Strategy

1. **Local Development (SQLite):**
   - Continue utilizing `prisma/dev.db` for rapid local iteration and offline testing.
   - Run `npx prisma migrate dev` for incremental schema changes during local feature development.
2. **Production / Cloud Migration (Planned):**
   - Update `prisma/schema.prisma` datasource provider from `"sqlite"` to `"postgresql"`.
   - Configure connection pooling via Supabase / PostgreSQL connection strings in `.env`.
   - Execute production migrations using `npx prisma migrate deploy`.

---

## 8. Database Naming Convention

* **Models:** PascalCase (e.g., `Product`, `ProductImage`, `ProductDNA`).
* **Fields:** camelCase for columns and foreign keys (e.g., `productId`, `shellMaterial`, `createdAt`).
* **Relations:** Descriptive camelCase matching target models or arrays (e.g., `product`, `images`).
* **Constraints:** `@@unique` and `@@index` explicitly named or derived via Prisma defaults.
