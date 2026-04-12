import { useState, useRef } from "react";

const EXAMPLE_POLICY = `We prioritise:
- Plain language over technical accuracy
- Empowering people to ask better questions
- Flagging uncertainty honestly

We avoid:
- Giving definitive eligibility decisions
- Replacing caseworker judgment
- Using legal or bureaucratic language in outputs

Tone: Direct, warm, non-patronising`;

const EXAMPLE_DOCUMENT = `Dear Mr. Johnson,

We have assessed your claim for Universal Credit under Section 4(1)(b) of the Welfare Reform Act 2012. Following our assessment period, your Standard Allowance has been calculated at £292.11 per month.

A deduction of £78.40 has been applied under the Minimum Income Floor provisions due to self-employment earnings falling below the national living wage equivalent threshold.

Your claim is subject to a Claimant Commitment. Failure to meet the requirements set out in your Claimant Commitment may result in a sanction being applied, which could reduce or suspend your payment.

If you wish to request a Mandatory Reconsideration, you must do so within one calendar month of this decision notice.`;

const SYSTEM_PROMPT = (policy) => `You are an assistive AI for a civic organisation. Your job is to help people understand complex official documents using plain language.

The organisation's policy is:
${policy}

You must:
1. Explain what the document is saying in plain language
2. Flag anything that conflicts with or requires attention based on the org's policy
3. Suggest specific questions the person should ask

Your output must be structured as JSON with this exact format:
{
  "summary": "Plain language summary of what the document is saying (2-4 sentences)",
  "flags": [
    {
      "issue": "What the concern is",
      "policy_reason": "Which part of the org's policy this relates to",
      "severity": "high|medium|low"
    }
  ],
  "questions": [
    {
      "question": "A specific question worth asking",
      "why": "Why this question matters based on the document"
    }
  ]
}

Return ONLY the JSON. No preamble, no explanation, no markdown fences.`;

export default function CommunityAIPrototype() {
  const [policy, setPolicy] = useState(EXAMPLE_POLICY);
  const [document, setDocument] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState("policy"); // policy | document | result
  const fileRef = useRef();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setDocument(ev.target.result);
    reader.readAsText(file);
  };

  const analyse = async () => {
    if (!policy.trim() || !document.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:3001/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT(policy),
          messages: [{ role: "user", content: document }],
        }),
      });

      const data = await response.json();
      const text = data.content?.find((b) => b.type === "text")?.text || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setResult(parsed);
      setStep("result");
    } catch (err) {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setStep("policy");
    setDocument("");
    setError(null);
  };

  const severityColor = {
    high: "#c0392b",
    medium: "#e67e22",
    low: "#27ae60",
  };

  const severityBg = {
    high: "rgba(192,57,43,0.08)",
    medium: "rgba(230,126,34,0.08)",
    low: "rgba(39,174,96,0.08)",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f0f",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#e8e4dc",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #2a2a2a",
        padding: "28px 48px",
        display: "flex",
        alignItems: "baseline",
        gap: "24px",
        background: "#0f0f0f",
      }}>
        <div>
          <div style={{
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#666",
            marginBottom: "4px",
            fontFamily: "'Courier New', monospace",
          }}>Community AI — Prototype v0.1</div>
          <h1 style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: "normal",
            color: "#e8e4dc",
            letterSpacing: "-0.01em",
          }}>Values-Aligned Document Analysis</h1>
        </div>
        <div style={{
          marginLeft: "auto",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}>
          {["policy", "document", "result"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                border: `1px solid ${step === s ? "#c8b560" : step === "result" || (step === "document" && i === 0) ? "#444" : "#2a2a2a"}`,
                background: step === s ? "#c8b560" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                color: step === s ? "#0f0f0f" : "#555",
                fontFamily: "'Courier New', monospace",
                transition: "all 0.3s",
              }}>{i + 1}</div>
              <span style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: step === s ? "#c8b560" : "#444",
                fontFamily: "'Courier New', monospace",
              }}>{s}</span>
              {i < 2 && <div style={{ width: "20px", height: "1px", background: "#2a2a2a" }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "48px 48px" }}>

        {/* Step 1: Policy */}
        {step === "policy" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "28px", fontWeight: "normal", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                Define your organisation's values
              </h2>
              <p style={{ color: "#888", margin: 0, fontSize: "15px", lineHeight: "1.6" }}>
                Write in plain language. No template required — just what your organisation cares about and what it won't do.
              </p>
            </div>

            <textarea
              value={policy}
              onChange={(e) => setPolicy(e.target.value)}
              placeholder="We prioritise..."
              style={{
                width: "100%",
                minHeight: "240px",
                background: "#161616",
                border: "1px solid #2a2a2a",
                borderRadius: "4px",
                color: "#e8e4dc",
                fontFamily: "'Courier New', monospace",
                fontSize: "14px",
                lineHeight: "1.7",
                padding: "20px",
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            <div style={{
              marginTop: "12px",
              padding: "14px 18px",
              background: "rgba(200,181,96,0.06)",
              border: "1px solid rgba(200,181,96,0.15)",
              borderRadius: "4px",
              fontSize: "13px",
              color: "#999",
              lineHeight: "1.6",
            }}>
              <strong style={{ color: "#c8b560" }}>This becomes the constraint layer.</strong> Every output will trace back to what you write here. The AI will not act beyond what these values permit.
            </div>

            <button
              onClick={() => setStep("document")}
              disabled={!policy.trim()}
              style={{
                marginTop: "24px",
                padding: "14px 32px",
                background: policy.trim() ? "#c8b560" : "#2a2a2a",
                color: policy.trim() ? "#0f0f0f" : "#555",
                border: "none",
                borderRadius: "3px",
                fontSize: "13px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: policy.trim() ? "pointer" : "not-allowed",
                fontFamily: "'Courier New', monospace",
                transition: "all 0.2s",
              }}
            >
              Confirm Policy →
            </button>
          </div>
        )}

        {/* Step 2: Document */}
        {step === "document" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "28px", fontWeight: "normal", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                Upload the document
              </h2>
              <p style={{ color: "#888", margin: 0, fontSize: "15px", lineHeight: "1.6" }}>
                Paste a benefits letter, decision notice, or any official process document.
              </p>
            </div>

            {/* Policy summary */}
            <div style={{
              marginBottom: "24px",
              padding: "16px 20px",
              background: "#161616",
              border: "1px solid #2a2a2a",
              borderRadius: "4px",
            }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#666", marginBottom: "10px", fontFamily: "'Courier New', monospace" }}>Active policy</div>
              <div style={{ fontSize: "13px", color: "#aaa", lineHeight: "1.6", whiteSpace: "pre-wrap", fontFamily: "'Courier New', monospace" }}>
                {policy.length > 200 ? policy.slice(0, 200) + "…" : policy}
              </div>
              <button onClick={() => setStep("policy")} style={{
                marginTop: "10px",
                background: "none",
                border: "none",
                color: "#c8b560",
                fontSize: "12px",
                cursor: "pointer",
                padding: 0,
                fontFamily: "'Courier New', monospace",
                letterSpacing: "0.05em",
              }}>← Edit policy</button>
            </div>

            <textarea
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              placeholder="Paste document text here, or upload a .txt file below…"
              style={{
                width: "100%",
                minHeight: "220px",
                background: "#161616",
                border: "1px solid #2a2a2a",
                borderRadius: "4px",
                color: "#e8e4dc",
                fontFamily: "'Courier New', monospace",
                fontSize: "13px",
                lineHeight: "1.7",
                padding: "20px",
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            <div style={{ marginTop: "12px", display: "flex", gap: "12px", alignItems: "center" }}>
              <button onClick={() => setDocument(EXAMPLE_DOCUMENT)} style={{
                background: "none",
                border: "1px solid #2a2a2a",
                color: "#888",
                padding: "8px 16px",
                borderRadius: "3px",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "'Courier New', monospace",
                letterSpacing: "0.05em",
              }}>Load example letter</button>
              <input ref={fileRef} type="file" accept=".txt" onChange={handleFileUpload} style={{ display: "none" }} />
              <button onClick={() => fileRef.current.click()} style={{
                background: "none",
                border: "1px solid #2a2a2a",
                color: "#888",
                padding: "8px 16px",
                borderRadius: "3px",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "'Courier New', monospace",
                letterSpacing: "0.05em",
              }}>Upload .txt file</button>
            </div>

            <button
              onClick={analyse}
              disabled={!document.trim() || loading}
              style={{
                marginTop: "24px",
                padding: "14px 32px",
                background: document.trim() && !loading ? "#c8b560" : "#2a2a2a",
                color: document.trim() && !loading ? "#0f0f0f" : "#555",
                border: "none",
                borderRadius: "3px",
                fontSize: "13px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: document.trim() && !loading ? "pointer" : "not-allowed",
                fontFamily: "'Courier New', monospace",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: "14px", height: "14px", border: "2px solid #555",
                    borderTopColor: "#888", borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  Analysing against your values…
                </>
              ) : "Analyse Document →"}
            </button>

            {error && (
              <div style={{ marginTop: "16px", color: "#c0392b", fontSize: "13px", fontFamily: "'Courier New', monospace" }}>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Result */}
        {step === "result" && result && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ fontSize: "28px", fontWeight: "normal", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                  Analysis
                </h2>
                <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>
                  Every finding traces back to your stated policy.
                </p>
              </div>
              <button onClick={reset} style={{
                background: "none",
                border: "1px solid #2a2a2a",
                color: "#888",
                padding: "8px 16px",
                borderRadius: "3px",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "'Courier New', monospace",
                letterSpacing: "0.05em",
              }}>Start over</button>
            </div>

            {/* Summary */}
            <div style={{
              marginBottom: "28px",
              padding: "24px",
              background: "#161616",
              border: "1px solid #2a2a2a",
              borderRadius: "4px",
            }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#c8b560", marginBottom: "14px", fontFamily: "'Courier New', monospace" }}>
                Plain language summary
              </div>
              <p style={{ margin: 0, fontSize: "15px", lineHeight: "1.75", color: "#ddd" }}>
                {result.summary}
              </p>
            </div>

            {/* Flags */}
            {result.flags?.length > 0 && (
              <div style={{ marginBottom: "28px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#666", marginBottom: "14px", fontFamily: "'Courier New', monospace" }}>
                  Flags — {result.flags.length} issue{result.flags.length !== 1 ? "s" : ""} found
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {result.flags.map((flag, i) => (
                    <div key={i} style={{
                      padding: "18px 20px",
                      background: severityBg[flag.severity] || "rgba(255,255,255,0.03)",
                      border: `1px solid ${severityColor[flag.severity] || "#333"}30`,
                      borderLeft: `3px solid ${severityColor[flag.severity] || "#666"}`,
                      borderRadius: "4px",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <div style={{ fontSize: "14px", color: "#e8e4dc", lineHeight: "1.5", flex: 1, paddingRight: "16px" }}>
                          {flag.issue}
                        </div>
                        <div style={{
                          fontSize: "10px",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: severityColor[flag.severity],
                          fontFamily: "'Courier New', monospace",
                          whiteSpace: "nowrap",
                        }}>{flag.severity}</div>
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#777",
                        fontFamily: "'Courier New', monospace",
                        lineHeight: "1.5",
                      }}>
                        Policy basis: {flag.policy_reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Questions */}
            {result.questions?.length > 0 && (
              <div style={{ marginBottom: "28px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#666", marginBottom: "14px", fontFamily: "'Courier New', monospace" }}>
                  Questions worth asking
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {result.questions.map((q, i) => (
                    <div key={i} style={{
                      padding: "18px 20px",
                      background: "#161616",
                      border: "1px solid #2a2a2a",
                      borderRadius: "4px",
                    }}>
                      <div style={{ fontSize: "14px", color: "#e8e4dc", marginBottom: "8px", lineHeight: "1.5" }}>
                        {q.question}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666", fontFamily: "'Courier New', monospace", lineHeight: "1.5" }}>
                        {q.why}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transparency footer */}
            <div style={{
              padding: "16px 20px",
              background: "rgba(200,181,96,0.04)",
              border: "1px solid rgba(200,181,96,0.12)",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#777",
              lineHeight: "1.6",
              fontFamily: "'Courier New', monospace",
            }}>
              <strong style={{ color: "#c8b560" }}>Transparency note:</strong> This analysis made no recommendations and reached no conclusions. All flags and questions are derived from your organisation's stated policy. The AI did not act beyond those constraints.
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea:focus { border-color: #3a3a3a !important; }
        button:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
}
