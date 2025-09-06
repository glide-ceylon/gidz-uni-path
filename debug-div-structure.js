/**
 * Detailed div tracking script for work visa page
 */

const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "app",
  "admin",
  "entries",
  "work",
  "page.tsx"
);

try {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  console.log("🔍 Tracking div tags line by line...");

  let divStack = [];
  let lineNumber = 0;

  for (const line of lines) {
    lineNumber++;

    // Find opening divs
    const openDivMatches = line.match(/<div[^>]*>/g);
    if (openDivMatches) {
      openDivMatches.forEach((match) => {
        const className = match.match(/className="([^"]*)"/) || [
          "",
          "no-class",
        ];
        divStack.push({
          line: lineNumber,
          className: className[1],
          tag: match,
        });
        console.log(
          `${lineNumber}: +DIV ${className[1]} (stack: ${divStack.length})`
        );
      });
    }

    // Find closing divs
    const closeDivMatches = line.match(/<\/div>/g);
    if (closeDivMatches) {
      closeDivMatches.forEach(() => {
        if (divStack.length > 0) {
          const openDiv = divStack.pop();
          console.log(
            `${lineNumber}: -DIV closed (was: ${openDiv.className} from line ${openDiv.line}) (stack: ${divStack.length})`
          );
        } else {
          console.log(
            `${lineNumber}: ❌ EXTRA closing div - no matching opening!`
          );
        }
      });
    }
  }

  console.log(`\n📊 Final Summary:`);
  console.log(`   Total lines processed: ${lineNumber}`);
  console.log(`   Unclosed divs remaining: ${divStack.length}`);

  if (divStack.length > 0) {
    console.log(`\n❌ Unclosed divs:`);
    divStack.forEach((div, index) => {
      console.log(`   ${index + 1}. Line ${div.line}: ${div.className}`);
      console.log(`      Tag: ${div.tag}`);
    });
  } else {
    console.log(`\n✅ All divs are properly closed!`);
  }
} catch (error) {
  console.error("❌ Error:", error.message);
}
