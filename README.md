# Community AI — Values-Aligned Document Analysis

A working prototype that helps civic and public sector organisations explain complex processes to the people they serve — constrained by the organisation's own values, transparent about its reasoning.

Built as part of MSc research in Human-Centred AI.

---

## The Problem

People navigating high-stakes processes — benefits applications, council decisions, formal notices — routinely receive documents they cannot understand or act on. Existing AI tools offer answers, but not accountability. They optimise for helpfulness, not restraint.

This prototype takes a different approach.

---

## How It Works

The system has three layers:

**1. Community Policy Input**
The organisation defines its values in plain language — what it prioritises, what it avoids, what tone is acceptable, and what decisions should never be automated. No template. No technical barrier.

**2. Assistive AI Layer**
The AI performs constrained tasks only: explaining what a document means, flagging potential concerns, and surfacing questions worth asking. It does not make recommendations or reach conclusions.

**3. Transparency Layer**
Every output traces back to a specific policy statement. The organisation — and the person being helped — can see exactly why the AI said what it said.

---

## Example Use Case

A resident receives a Universal Credit decision letter they don't understand. A frontline organisation loads their values policy ("plain language only", "flag where human advice is needed") and the letter. The system returns:

- A plain language explanation of what the letter is saying
- Flags where the decision may need scrutiny, traced to the org's stated values
- Specific questions the resident should ask their caseworker

It does not tell the resident whether they will qualify. It does not replace the caseworker.

---

## Design Principles

- **Restraint as a feature** — the system is deliberately limited in what it will do
- **Values as configuration** — the org's policy shapes every output, visibly
- **Non-addictive by design** — outputs are structured to support human judgment, not replace it
- **Explainability built in** — transparency is not an add-on; it is the output format

---

## Running the Prototype

The prototype is a single React component (`community-ai-prototype.jsx`) that calls the Anthropic Claude API.

**Requirements:**
- Node.js
- Anthropic API key

**Setup:**
```bash
npm install
ANTHROPIC_API_KEY=your_key npm start
```

Or drop the `.jsx` file into any React sandbox (e.g. Claude.ai artifacts, CodeSandbox) — it runs without additional dependencies.

---

## Status

This is a working prototype, not a production tool. It is intended to demonstrate the core interaction model and open conversations with civic organisations about real deployment needs.

Feedback and collaboration welcome.

---

## Background

This project draws on research into assistive vs addictive AI design, community governance models, and explainable AI (XAI). It was developed following completion of an MSc in Human-Centred AI.

Conceptual influences include Audrey Tang's work on digital democracy in Taiwan and the principle of putting AI in the loop of communities — not the other way around.

---

## Contact

Open an issue or reach out directly via GitHub.
