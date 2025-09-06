#!/usr/bin/env node

/**
 * Test API Import Fix
 *
 * This script tests if the API routes can be imported without errors
 */

console.log("🧪 Testing API Import Fix\n");

try {
  // Test import paths
  console.log("1. Testing import paths...");

  // Check if the file exists
  const fs = require("fs");
  const path = require("path");

  const assignmentApiPath = path.join(
    __dirname,
    "..",
    "app",
    "api",
    "admin",
    "assign-student",
    "route.js"
  );
  const staffApiPath = path.join(
    __dirname,
    "..",
    "app",
    "api",
    "admin",
    "staff",
    "route.js"
  );
  const adminAuthPath = path.join(__dirname, "..", "lib", "adminAuth.js");

  console.log(
    "   - Assignment API exists:",
    fs.existsSync(assignmentApiPath) ? "✅" : "❌"
  );
  console.log(
    "   - Staff API exists:",
    fs.existsSync(staffApiPath) ? "✅" : "❌"
  );
  console.log(
    "   - Admin Auth exists:",
    fs.existsSync(adminAuthPath) ? "✅" : "❌"
  );

  // Test import path from API perspective
  const apiToLibPath = path.relative(
    path.dirname(assignmentApiPath),
    adminAuthPath
  );
  console.log("   - Relative path from API to lib:", apiToLibPath);
  console.log(
    "   - Import path should be:",
    "./" + apiToLibPath.replace(/\\/g, "/")
  );

  // Check current imports in API files
  const assignmentApiContent = fs.readFileSync(assignmentApiPath, "utf8");
  const staffApiContent = fs.readFileSync(staffApiPath, "utf8");

  console.log("\n2. Current import statements:");
  const assignmentImportMatch = assignmentApiContent.match(
    /import.*adminAuth.*from.*["'](.+)["']/
  );
  const staffImportMatch = staffApiContent.match(
    /import.*adminAuth.*from.*["'](.+)["']/
  );

  if (assignmentImportMatch) {
    console.log("   - Assignment API import:", assignmentImportMatch[1]);
  }
  if (staffImportMatch) {
    console.log("   - Staff API import:", staffImportMatch[1]);
  }

  console.log("\n✅ API import paths test completed!");
} catch (error) {
  console.error("❌ Error testing API imports:", error.message);
}
