-- Blog posts table for Supabase
-- Run this in Supabase SQL editor

create table if not exists blog_posts (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  category text not null,
  excerpt text,
  date date not null,
  read_time text,
  author text,
  image text,
  featured boolean default false,
  content text not null,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table blog_posts enable row level security;

-- Policy: allow public read of published posts
create policy "Public read published posts"
  on blog_posts
  for select
  using (published = true);

-- Policy: allow authenticated users to manage posts (adjust as needed)
create policy "Authenticated users can manage posts"
  on blog_posts
  for all
  to authenticated
  using (true);

-- Index for performance
create index if not exists blog_posts_category_published_idx
  on blog_posts (category, published);

create index if not exists blog_posts_slug_idx
  on blog_posts (slug);

-- Insert sample data
insert into blog_posts (slug, title, category, excerpt, date, read_time, author, image, featured, content, published) values
(
  'what-is-rag',
  'What RAG is and when you need it',
  'AI',
  'Retrieval-Augmented Generation lets you ground LLMs in your own data. Here''s when to use it and when to skip it.',
  '2026-09-15',
  '8 min',
  'Muhammad Saqib',
  '/blog/rag-cover.webp',
  true,
  '# What RAG is and when you need it

Retrieval-Augmented Generation (RAG) is a technique that combines information retrieval with text generation. Instead of relying solely on the model''s training data, RAG fetches relevant documents and feeds them to the model as context.

## How it works

1. **Indexing** — Split documents into chunks, embed them, store in a vector database
2. **Retrieval** — When a query comes in, embed it and find the most similar chunks
3. **Generation** — Feed the retrieved chunks + query to the LLM for a grounded answer

## When to use RAG

- Your data changes frequently (documentation, product catalogs, policies)
- You need citations and verifiable answers
- You have proprietary data that isn''t in the model''s training set
- You want to reduce hallucinations

## When to skip it

- Your use case is general knowledge (the model already knows it)
- You need real-time data (use function calling instead)
- Your dataset is tiny (just put it in the prompt)

## Implementation notes

Use a vector DB like Pinecone, Weaviate, or pgvector. Chunk size matters — 500-1000 tokens with 100-200 token overlap works well for most cases.

## Conclusion

RAG isn''t magic, but it''s the most practical way to make LLMs useful on your data. Start simple: embed your docs, retrieve top-k, generate.',
  true
),
(
  'nextjs-vs-flutter',
  'Next.js or Flutter: choosing for your first app',
  'Web',
  'A practical comparison for founders and builders deciding between web-first and cross-platform mobile.',
  '2026-08-28',
  '6 min',
  'Ubaidullah Akram',
  '/blog/nextjs-flutter.webp',
  false,
  '# Next.js or Flutter: choosing for your first app

Both are excellent choices. The right one depends on what you''re building and who it''s for.

## Choose Next.js if

- Your users are primarily on desktop/web
- SEO matters (marketing sites, content platforms)
- You want a single codebase for web + PWA
- Your team knows React

## Choose Flutter if

- Mobile-first experience is critical
- You need native performance and feel
- You''re building for iOS, Android, web, and desktop from one codebase
- Your team knows Dart or is willing to learn

## The middle ground

Many teams start with Next.js (web + PWA) and add Flutter later for native mobile apps. Share the backend API and business logic.

## Our take

For most SaaS products, Next.js gets you to market faster with better web SEO. For consumer apps where mobile UX is the product, Flutter wins.',
  true
),
(
  'how-to-scope-a-software-project',
  'How to scope a software project',
  'Engineering',
  'A framework for defining scope, timeline, and budget before writing code. Avoid the most common traps.',
  '2026-08-10',
  '10 min',
  'Muhammad Faraz',
  '/blog/scoping.webp',
  false,
  '# How to scope a software project

Poor scoping is the #1 reason projects run late and over budget. Here''s our framework.

## 1. Define the problem, not the solution

Start with: "What problem are we solving for whom?" Not "We need an app with features X, Y, Z."

## 2. Identify the core user flow

Map the one flow that delivers value. Everything else is secondary.

## 3. Break into epics → stories → tasks

- **Epic** — Major capability (e.g., "User authentication")
- **Story** — User-facing slice (e.g., "As a user, I can sign in with email")
- **Task** — Dev work (e.g., "Set up Auth0 integration")

## 4. Estimate in ranges, not points

Use t-shirt sizes (XS/S/M/L/XL) with time ranges:
- XS: 0.5–1 day
- S: 1–2 days
- M: 3–5 days
- L: 1–2 weeks
- XL: 2+ weeks (break it down)

## 5. Add 20% buffer

Unknown unknowns exist. Budget for them.

## 6. Define "done"

Agree on acceptance criteria for each story before starting.

## 7. Review weekly

Scope changes. Re-estimate affected stories. Communicate impact immediately.

## Template

Use our scoping template: [link to template]

## Summary

Good scoping isn''t about predicting the future. It''s about creating a shared understanding of what "done" looks like and a process for handling change.',
  true
),
(
  'building-ai-chatbots',
  'Building AI chatbots that actually work',
  'AI',
  'From prompt engineering to RAG to evaluation — what makes a chatbot useful vs. a demo.',
  '2026-07-22',
  '7 min',
  'Muhammad Saqib',
  '/blog/ai-chatbots.webp',
  false,
  '# Building AI chatbots that actually work

Most chatbots fail because they''re built as demos, not products. Here''s what separates the two.

## Start with the use case

- Customer support? → Need RAG + escalation to human
- Sales qualification? → Need structured output + CRM integration
- Internal tool? → Need permissions + audit trail

## Architecture

```
User Query → Intent Classification → Retrieval (if needed) → LLM Generation → Validation → Response
```

## Key components

1. **System prompt** — Define persona, boundaries, escalation rules
2. **Retrieval** — RAG for factual grounding
3. **Guardrails** — Input/output validation, PII detection
4. **Evaluation** — Automated + human review on a sample

## Common mistakes

- No fallback for "I don''t know"
- No conversation memory
- No analytics on failure modes
- Prompt engineering instead of system design

## Evaluation framework

Track: resolution rate, escalation rate, hallucination rate, user satisfaction. Review weekly.

## Conclusion

A working chatbot is a system, not a prompt. Invest in the plumbing.',
  true
),
(
  'typescript-best-practices',
  'TypeScript patterns that scale',
  'Engineering',
  'Practical types, generics, and architecture patterns for maintainable codebases.',
  '2026-06-15',
  '9 min',
  'Ubaidullah Akram',
  '/blog/typescript-patterns.webp',
  false,
  '# TypeScript patterns that scale

TypeScript isn''t just "JavaScript with types." Used well, it''s a design tool.

## 1. Discriminated unions for state

```ts
type State = 
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: Data }
  | { status: "error"; error: Error }
```

Exhaustive switching catches missing cases.

## 2. Branded types for IDs

```ts
type UserId = string & { __brand: "UserId" };
type PostId = string & { __brand: "PostId" };
```

Prevents passing a UserId where a PostId is expected.

## 3. Zod for runtime validation

```ts
const schema = z.object({ email: z.string().email() });
type Input = z.infer<typeof schema>;
```

Single source of truth for types + validation.

## 4. Utility types

```ts
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;
```

## 5. Module boundaries

Use `--moduleResolution bundler` and explicit exports. Avoid deep relative imports.

## Conclusion

TypeScript pays off when you use it to model your domain, not just satisfy the compiler.',
  true
);