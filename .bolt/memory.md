# Project memory

## Product intent & audience

- Marketing/showcase site (single-page) with multiple narrative sections
- Sections include: Business Solutions, Final CTA, Manifesto, Product Reveal, Rose Mark
- Likely a premium/luxury brand or product reveal experience

## Brand personality & voice

- Manifesto and Rose Mark sections suggest a brand-led, values-driven narrative tone
- Premium aesthetic implied by section naming

## Visual design & UX direction

- Component-per-section architecture (each section is its own component)
- Section components are present but some had leftover/unused code from in-progress work

## Decisions, constraints & rationale

- Build is configured to fail on unused variables (likely Vite + TS with strict/noUnusedLocals)
- All unused-variable errors must be resolved for a successful build
- Build process is the primary verification step for project state

## Open questions & assumptions

- No `.bolt/prompt` global instructions exist yet; context inferred solely from codebase
- Tech stack details (framework, styling approach) not yet confirmed beyond build behavior
- "Finish" was interpreted as resolving build errors; broader completion criteria (features, content, polish) remain unverified