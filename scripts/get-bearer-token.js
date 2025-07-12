#!/usr/bin/env node

/**
 * Get Bearer Token for API Testing
 *
 * This script helps you get a valid bearer token for testing the Timeline Events API.
 * You can either login with existing credentials or create a test user.
 *
 * Usage: node scripts/get-bearer-token.js
 */

const { createClient } = require("@supabase/supabase-js");
const readline = require("readline");

// Load environment variables
require("dotenv").config();

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  console.error(
    "❌ Missing Supabase configuration. Please set up your .env.local file first."
  );
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function loginUser() {
  console.log("\n🔐 Login to get Bearer Token\n");

  const email = await askQuestion("Enter email: ");
  const password = await askQuestion("Enter password: ");

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      console.error("❌ Login failed:", error.message);
      return null;
    }

    if (data.session) {
      console.log("\n✅ Login successful!");
      console.log("🎟️  Bearer Token:", data.session.access_token);
      console.log("\n📋 Copy this for your API tests:");
      console.log(`Authorization: Bearer ${data.session.access_token}`);
      return data.session.access_token;
    }
  } catch (error) {
    console.error("❌ Login error:", error.message);
    return null;
  }
}

async function createTestUser() {
  console.log("\n👤 Create Test User\n");

  const email = await askQuestion("Enter email for test user: ");
  const password = await askQuestion("Enter password (min 6 chars): ");
  const firstName = await askQuestion("Enter first name: ");
  const lastName = await askQuestion("Enter last name: ");

  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
    });

    if (authError) {
      console.error("❌ User creation failed:", authError.message);
      return null;
    }

    console.log("✅ Auth user created!");

    // Check if we need to create application record
    if (authData.session) {
      console.log("🎟️  Bearer Token:", authData.session.access_token);
      console.log("\n📋 Copy this for your API tests:");
      console.log(`Authorization: Bearer ${authData.session.access_token}`);

      // Note: You might need to create an application record in your database
      console.log(
        "\n⚠️  Note: You may need to create an application record for this user in your database."
      );
      console.log(
        "Check your applications table and add a record with this email if needed."
      );

      return authData.session.access_token;
    } else {
      console.log(
        "📧 Check your email for verification link, then try logging in."
      );
      return null;
    }
  } catch (error) {
    console.error("❌ User creation error:", error.message);
    return null;
  }
}

async function getCurrentSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("❌ Session error:", error.message);
      return null;
    }

    if (session) {
      console.log("✅ Found existing session!");
      console.log("🎟️  Bearer Token:", session.access_token);
      console.log("\n📋 Copy this for your API tests:");
      console.log(`Authorization: Bearer ${session.access_token}`);
      return session.access_token;
    } else {
      console.log("ℹ️  No existing session found.");
      return null;
    }
  } catch (error) {
    console.error("❌ Session check error:", error.message);
    return null;
  }
}

async function main() {
  console.log("🎯 Bearer Token Helper for Timeline Events API Testing");
  console.log("====================================================\n");

  // First check for existing session
  console.log("1. Checking for existing session...");
  const existingToken = await getCurrentSession();

  if (existingToken) {
    const useExisting = await askQuestion("\nUse this existing token? (y/n): ");
    if (useExisting.toLowerCase() === "y") {
      rl.close();
      return;
    }
  }

  console.log("\nChoose an option:");
  console.log("1. Login with existing user");
  console.log("2. Create new test user");
  console.log("3. Exit");

  const choice = await askQuestion("\nEnter your choice (1-3): ");

  let token = null;

  switch (choice.trim()) {
    case "1":
      token = await loginUser();
      break;
    case "2":
      token = await createTestUser();
      break;
    case "3":
      console.log("👋 Goodbye!");
      break;
    default:
      console.log("❌ Invalid choice");
  }

  if (token) {
    console.log("\n🚀 Ready for API testing!");
    console.log("Now you can update your test script with this bearer token.");
  }

  rl.close();
}

// Handle Ctrl+C
process.on("SIGINT", () => {
  console.log("\n👋 Goodbye!");
  rl.close();
  process.exit(0);
});

if (require.main === module) {
  main();
}

module.exports = { loginUser, createTestUser, getCurrentSession };
