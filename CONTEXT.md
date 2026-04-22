# Project Context — Assistive AI Prototype

## What this is
A values-aligned document analysis tool for civic and public sector organisations. It helps people understand complex official documents — funding decisions, benefits letters, council communications — in plain language, without replacing human judgment.

Built as part of an MSc in Human-Centred AI. Currently being developed toward paid work with civic organisations, starting with Camden Council.

## The three layers

**1. Community Policy Input**
The organisation defines its values in plain language — what it prioritises, what it avoids, what tone is acceptable. This becomes the constraint layer. Every output traces back to it.

**2. Assistive AI Layer**
Performs constrained tasks only: plain language summary, flags, questions, and rewrite suggestions. Does not make recommendations or reach conclusions.

**3. Transparency Layer**
Every output item shows which policy statement it used and why. Visible on every flag and suggestion.

## Tech stack
- React frontend (Vite)
- Express proxy server (server.js) on port 3001
- Anthropic Claude API (claude-sonnet-4-20250514)
- Main component: src/App.jsx (or community-ai-prototype.jsx)

## Target users
- Council comms teams who review all external communications before they go out
- Civic organisations helping residents or applicants understand complex documents
- Social investment funds helping applicants understand funding decisions

## Key insight from user research (Camden Community Wealth Fund)
Questions alone don't create action — users need suggestions they can act on, not just flags to consider. The comms team is time-pressured and needs the tool to reduce work, not add a step.

## Three changes currently in progress

**1. Suggestions layer (priority)**
Each flag should include a rewrite suggestion — one way the flagged section could be expressed in plain language that aligns with the org's values. The human decides whether to use it.

**2. Risk flagging**
A separate output section for reputational or legal risk alerts — phrases that could be misread, challenged legally, or create reputational exposure. This is how comms teams think.

**3. Interactive editing**
Allow the user to push back on the plain language summary — a simple input that lets them say "this isn't quite right" and refine the output before acting on it.

## Design principles
- Restraint is a feature — the tool is deliberately limited in what it will do
- Values as configuration — the org's policy shapes every output, visibly
- Non-addictive by design — outputs support human judgment, not replace it
- Explainability built in — every output traces back to a policy statement

## Time pressure design directions

Three options for reducing friction for time-pressured comms teams. Validate which direction with comms team before building.

**1. One-click rewrite**
A "use this" button on each suggestion that replaces the flagged text in a working draft. Reduces the copy-paste step and makes the suggestion feel like an action, not a prompt.

**2. Triage view**
Lead with high-severity flags only. Low and medium flags collapsed behind a "show more" toggle. Lets the user scan and act fast without reading everything first.

**3. Inline not separate**
Flags overlaid directly on the original document text, like tracked changes in Word. The user sees the problem in context rather than in a separate list — closer to how comms teams already work.

## What to avoid
- Adding features before validating with real users
- Making the tool do more than the values policy permits
- Switching AI models until there is a real procurement requirement to do so
