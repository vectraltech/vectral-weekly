import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "Set GEMINI_API_KEY in .env — get one free at https://ai.google.dev"
  );
}

const ai = new GoogleGenAI({ apiKey });

// 🔧 CHANGE THIS to your own task. The agent handles the rest.
const TASK = `
Generate 30 days of synthetic e-commerce sales data (date, product, units, revenue).
Save it as sales.csv.
Then analyze it with pandas and tell me the top 3 insights in bullet points.
`.trim();

async function main() {
  console.log("→ Spinning up managed agent...\n");

  const interaction = await ai.interactions.create({
    agent: "antigravity-preview-05-2026",
    input: TASK,
  });

  console.log("← Agent response:\n");
  console.log(interaction.output);

  // If files were written in the sandbox, surface them:
  const files = (interaction as any).files;
  if (Array.isArray(files) && files.length > 0) {
    console.log("\n📁 Files created in sandbox:");
    for (const file of files) {
      console.log(`  - ${file.name} (${file.size ?? "?"} bytes)`);
    }
    console.log(
      "\n   (Sandbox is ephemeral. Download via the SDK's file API to persist.)"
    );
  }
}

main().catch((err) => {
  console.error("❌ Agent call failed:", err);
  process.exit(1);
});
