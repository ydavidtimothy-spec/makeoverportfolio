// Rule verifier: checks MakeoverPortfolio against data JSON + craft rules.
// Run: node scripts/verify.mjs. Fails non-zero with named issues.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const issues = [];
const ok = (cond, name) => { if (!cond) issues.push(name); return cond; };

const html = readFileSync(join(root, "index.html"), "utf8");
const text = html.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const css = readFileSync(join(root, "styles.css"), "utf8") + readFileSync(join(root, "css/bits.css"), "utf8");
const data = JSON.parse(readFileSync(join(root, "data/yortechva-projects.json"), "utf8"));

// 1. Every local asset reference resolves
for (const m of html.matchAll(/(?:src|href)="(public\/[^"]+|styles\.css|css\/[^"]+|js\/[^"]+)"/g)) {
  ok(existsSync(join(root, m[1])), `missing-asset:${m[1]}`);
}
// 2. Profile + metrics match JSON (no invented claims)
ok(text.includes(data.profile.name), "profile-name-mismatch");
ok(text.includes(data.profile.email), "profile-email-missing");
for (const s of data.stats) ok(text.includes(s.value) && text.includes(s.label), `stat-missing:${s.label}`);
for (const t of data.tech_stack) ok(text.includes(t.name), `stack-missing:${t.name}`);
// 3. Proof cards carry real project titles + filter categories
for (const p of ["Autonomous Lead-to-Revenue", "Closed-Loop Lead Conversion", "ClubWorx", "Customer Service Agent", "Content Repurposing", "Reactivation"]) {
  ok(text.includes(p), `proof-missing:${p}`);
}
ok((html.match(/data-cat="(n8n|zapier|ghl)"/g) || []).length >= 6, "filter-cats-incomplete");
// 4. Craft checks: viewport, alt text, focus, reduced motion, contrast tokens
ok(html.includes('name="viewport"'), "no-viewport");
ok(!html.match(/<img(?![^>]*alt=)/), "img-without-alt");
ok(css.includes(":focus-visible"), "no-focus-style");
ok(css.includes("prefers-reduced-motion"), "no-reduced-motion");
for (const tok of ["--bg:#0b0b0b", "--accent:#c5ff41", "--border:#262626"]) ok(css.includes(tok), `token-missing:${tok}`);
// 5. No secrets committed
const example = readFileSync(join(root, ".env.example"), "utf8");
ok(!example.match(/=(?!$)./m) || example.split("\n").filter((l) => l.includes("=") && l.split("=")[1].trim() !== "").length === 0, "example-has-values");
ok(!html.includes("AAHJLqMdxvQQXfocKy2HoJma51QArFakq"), "secret-in-html");

if (issues.length) {
  console.error(`VERIFY FAIL (${issues.length}):\n- ${issues.join("\n- ")}`);
  process.exit(1);
}
console.log("VERIFY PASS: assets, claims-vs-JSON, craft tokens, no secrets.");
