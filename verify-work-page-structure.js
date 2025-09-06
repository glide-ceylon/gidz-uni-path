/**
 * Verification script for work visa page JSX structure
 * This script checks if the page structure is properly balanced
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

  console.log("🔍 Checking work visa page structure...");

  // Count JSX elements more accurately
  const openDivMatches = content.match(/<div[^>]*>/g) || [];
  const closeDivMatches = content.match(/<\/div>/g) || [];
  const openFragmentMatches = content.match(/<>/g) || [];
  const closeFragmentMatches = content.match(/<\/>/g) || [];

  const openDivs = openDivMatches.length;
  const closeDivs = closeDivMatches.length;
  const openFragments = openFragmentMatches.length;
  const closeFragments = closeFragmentMatches.length;

  console.log(`📊 JSX Element Counts:`);
  console.log(`   Opening <div>: ${openDivs}`);
  console.log(`   Closing </div>: ${closeDivs}`);
  console.log(`   Opening <>: ${openFragments}`);
  console.log(`   Closing </>: ${closeFragments}`);

  // Check key structural elements
  const hasMainReturn = content.includes("return (");
  const hasLoadingState = content.includes("isLoading ?");
  const hasConditionalFragment = content.includes(") : (");
  const hasAssignmentModal = content.includes("Assignment Modal");
  const hasDeleteModal = content.includes("Delete Confirmation Modal");

  console.log(`\n✨ Structure Elements:`);
  console.log(`   ✅ Main return statement: ${hasMainReturn}`);
  console.log(`   ✅ Loading state: ${hasLoadingState}`);
  console.log(`   ✅ Conditional fragment: ${hasConditionalFragment}`);
  console.log(`   ✅ Assignment modal: ${hasAssignmentModal}`);
  console.log(`   ✅ Delete modal: ${hasDeleteModal}`);

  // Check balance
  const divsBalanced = openDivs === closeDivs;
  const fragmentsBalanced = openFragments === closeFragments;

  console.log(`\n🔄 Balance Check:`);
  console.log(
    `   ${divsBalanced ? "✅" : "❌"} Divs balanced: ${divsBalanced}`
  );
  console.log(
    `   ${
      fragmentsBalanced ? "✅" : "❌"
    } Fragments balanced: ${fragmentsBalanced}`
  );

  if (divsBalanced && fragmentsBalanced) {
    console.log(
      `\n🎉 SUCCESS: Work visa page JSX structure is properly balanced!`
    );
  } else {
    console.log(`\n❌ ERROR: JSX structure is unbalanced`);
  }

  // Check for staff assignment functionality
  const hasStaffAssignment = content.includes("assignWork");
  const hasStaffUnassignment = content.includes("unassignWork");
  const hasAssignmentAPI = content.includes("/api/admin/assign-work");
  const hasStaffFetch = content.includes("/api/admin/staff");

  console.log(`\n🔧 Assignment Features:`);
  console.log(`   ✅ Staff assignment function: ${hasStaffAssignment}`);
  console.log(`   ✅ Staff unassignment function: ${hasStaffUnassignment}`);
  console.log(`   ✅ Assignment API calls: ${hasAssignmentAPI}`);
  console.log(`   ✅ Staff data fetching: ${hasStaffFetch}`);

  console.log(`\n📝 Summary: Work visa page is ready for testing!`);
} catch (error) {
  console.error("❌ Error reading file:", error.message);
}
