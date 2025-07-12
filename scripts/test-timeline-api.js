#!/usr/bin/env node

/**
 * Timeline Events API Testing Script
 *
 * This script tests all the Timeline Events API endpoints to ensure they work correctly.
 * Run this after starting the development server: npm run dev
 *
 * Usage: node scripts/test-timeline-api.js
 */
const dotenv = require("dotenv");
dotenv.config();

console.log("🚀 Starting Timeline Events API Tests");
// Ensure you have the required environment variables set
if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  console.error("❌ Missing environment variables. Please set:");
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("  - NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("  - NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("  - SUPABASE_SERVICE_ROLE_KEY");
  }
  process.exit(1);
}

const API_BASE_URL = "http://localhost:3000/api";

// Mock admin authentication headers
const ADMIN_HEADERS = {
  "Content-Type": "application/json",
  "x-admin-auth": "true",
  "x-admin-data": JSON.stringify({
    email: "thushanjana@gmail.com",
    role: "admin",
    name: "Thusara Anjana",
  }),
};

// Mock user authentication headers (replace with actual token in real testing)
// Get a real token by running: npm run get:token
const USER_HEADERS = {
  "Content-Type": "application/json",
  Authorization: process.env.TEST_USER_BEARER_TOKEN
    ? `Bearer ${process.env.TEST_USER_BEARER_TOKEN}`
    : "Bearer mock-user-token-replace-with-real",
};

// Test data
const TEST_APPLICATION_ID = "550e8400-e29b-41d4-a716-446655440000"; // Mock UUID
const TEST_EVENT_DATA = {
  application_id: TEST_APPLICATION_ID,
  title: "Test Timeline Event",
  description: "This is a test event created by the API testing script",
  event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  status: "upcoming",
  category: "documentation",
  icon: "FaFileAlt",
  color: "#3B82F6",
  is_milestone: true,
};

const TEST_REQUEST_DATA = {
  application_id: TEST_APPLICATION_ID,
  title: "Test Event Request",
  description: "This is a test event request created by the API testing script",
  requested_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
  category: "university",
  priority: "medium",
};

let createdEventId = null;
let createdRequestId = null;
let createdNoteId = null;

/**
 * Make HTTP request
 */
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    return {
      success: response.ok,
      status: response.status,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      error: error.message,
    };
  }
}

/**
 * Test Timeline Events API endpoints
 */
async function testTimelineEventsAPI() {
  console.log("\n🧪 Testing Timeline Events API...\n");

  // Test 1: GET /api/timeline-events (Admin - All events)
  console.log("1. Testing GET /api/timeline-events (Admin)...");
  const getEventsAdmin = await makeRequest(`${API_BASE_URL}/timeline-events`, {
    method: "GET",
    headers: ADMIN_HEADERS,
  });
  console.log(
    `   Status: ${getEventsAdmin.status} | Success: ${getEventsAdmin.success}`
  );
  if (!getEventsAdmin.success) {
    console.log(`   Error: ${JSON.stringify(getEventsAdmin.data)}`);
  }

  // Test 2: POST /api/timeline-events (Admin - Create event)
  console.log("2. Testing POST /api/timeline-events (Admin)...");
  const createEvent = await makeRequest(`${API_BASE_URL}/timeline-events`, {
    method: "POST",
    headers: ADMIN_HEADERS,
    body: JSON.stringify(TEST_EVENT_DATA),
  });
  console.log(
    `   Status: ${createEvent.status} | Success: ${createEvent.success}`
  );
  if (createEvent.success && createEvent.data.data) {
    createdEventId = createEvent.data.data.id;
    console.log(`   Created Event ID: ${createdEventId}`);
  } else {
    console.log(`   Error: ${JSON.stringify(createEvent.data)}`);
  }

  // Test 3: GET /api/timeline-events/[eventId] (Admin - Get specific event)
  if (createdEventId) {
    console.log(
      `3. Testing GET /api/timeline-events/${createdEventId} (Admin)...`
    );
    const getEvent = await makeRequest(
      `${API_BASE_URL}/timeline-events/${createdEventId}`,
      {
        method: "GET",
        headers: ADMIN_HEADERS,
      }
    );
    console.log(`   Status: ${getEvent.status} | Success: ${getEvent.success}`);
    if (!getEvent.success) {
      console.log(`   Error: ${JSON.stringify(getEvent.data)}`);
    }
  }

  // Test 4: PUT /api/timeline-events/[eventId] (Admin - Update event)
  if (createdEventId) {
    console.log(
      `4. Testing PUT /api/timeline-events/${createdEventId} (Admin)...`
    );
    const updateEvent = await makeRequest(
      `${API_BASE_URL}/timeline-events/${createdEventId}`,
      {
        method: "PUT",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({
          ...TEST_EVENT_DATA,
          title: "Updated Test Timeline Event",
          description: "This event has been updated by the API testing script",
        }),
      }
    );
    console.log(
      `   Status: ${updateEvent.status} | Success: ${updateEvent.success}`
    );
    if (!updateEvent.success) {
      console.log(`   Error: ${JSON.stringify(updateEvent.data)}`);
    }
  }

  // Test 5: PATCH /api/timeline-events/[eventId] (Admin - Update event status)
  if (createdEventId) {
    console.log(
      `5. Testing PATCH /api/timeline-events/${createdEventId} (Admin)...`
    );
    const patchEvent = await makeRequest(
      `${API_BASE_URL}/timeline-events/${createdEventId}`,
      {
        method: "PATCH",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({
          status: "in_progress",
        }),
      }
    );
    console.log(
      `   Status: ${patchEvent.status} | Success: ${patchEvent.success}`
    );
    if (!patchEvent.success) {
      console.log(`   Error: ${JSON.stringify(patchEvent.data)}`);
    }
  }
}

/**
 * Test Event Requests API endpoints
 */
async function testEventRequestsAPI() {
  console.log("\n🧪 Testing Event Requests API...\n");

  // Test 1: GET /api/timeline-event-requests (Admin - All requests)
  console.log("1. Testing GET /api/timeline-event-requests (Admin)...");
  const getRequests = await makeRequest(
    `${API_BASE_URL}/timeline-event-requests`,
    {
      method: "GET",
      headers: ADMIN_HEADERS,
    }
  );
  console.log(
    `   Status: ${getRequests.status} | Success: ${getRequests.success}`
  );
  if (!getRequests.success) {
    console.log(`   Error: ${JSON.stringify(getRequests.data)}`);
  }

  // Test 2: POST /api/timeline-event-requests (User - Create request)
  console.log("2. Testing POST /api/timeline-event-requests (User)...");
  // Note: This will fail with mock user token, but tests the endpoint structure
  const createRequest = await makeRequest(
    `${API_BASE_URL}/timeline-event-requests`,
    {
      method: "POST",
      headers: USER_HEADERS,
      body: JSON.stringify(TEST_REQUEST_DATA),
    }
  );
  console.log(
    `   Status: ${createRequest.status} | Success: ${createRequest.success}`
  );
  if (createRequest.success && createRequest.data.data) {
    createdRequestId = createRequest.data.data.id;
    console.log(`   Created Request ID: ${createdRequestId}`);
  } else {
    console.log(
      `   Expected Error (mock token): ${JSON.stringify(createRequest.data)}`
    );
  }
}

/**
 * Test Event Notes API endpoints
 */
async function testEventNotesAPI() {
  console.log("\n🧪 Testing Event Notes API...\n");

  if (!createdEventId) {
    console.log("   Skipping notes tests - no event created");
    return;
  }

  // Test 1: GET /api/timeline-event-notes (Get notes for event)
  console.log(
    `1. Testing GET /api/timeline-event-notes?eventId=${createdEventId}...`
  );
  const getNotes = await makeRequest(
    `${API_BASE_URL}/timeline-event-notes?eventId=${createdEventId}`,
    {
      method: "GET",
      headers: ADMIN_HEADERS,
    }
  );
  console.log(`   Status: ${getNotes.status} | Success: ${getNotes.success}`);
  if (!getNotes.success) {
    console.log(`   Error: ${JSON.stringify(getNotes.data)}`);
  }

  // Test 2: POST /api/timeline-event-notes (Admin - Create note)
  console.log("2. Testing POST /api/timeline-event-notes (Admin)...");
  const createNote = await makeRequest(`${API_BASE_URL}/timeline-event-notes`, {
    method: "POST",
    headers: ADMIN_HEADERS,
    body: JSON.stringify({
      event_id: createdEventId,
      application_id: TEST_APPLICATION_ID,
      note_text: "This is a test note created by the API testing script",
      is_private: false,
    }),
  });
  console.log(
    `   Status: ${createNote.status} | Success: ${createNote.success}`
  );
  if (createNote.success && createNote.data.data) {
    createdNoteId = createNote.data.data.id;
    console.log(`   Created Note ID: ${createdNoteId}`);
  } else {
    console.log(`   Error: ${JSON.stringify(createNote.data)}`);
  }
}

/**
 * Test error cases
 */
async function testErrorCases() {
  console.log("\n🧪 Testing Error Cases...\n");

  // Test 1: Unauthorized access
  console.log("1. Testing unauthorized access...");
  const unauthorized = await makeRequest(`${API_BASE_URL}/timeline-events`, {
    method: "GET",
    // No headers - should fail
  });
  console.log(`   Status: ${unauthorized.status} | Expected: 401`);

  // Test 2: Invalid UUID format
  console.log("2. Testing invalid UUID format...");
  const invalidUUID = await makeRequest(
    `${API_BASE_URL}/timeline-events/invalid-uuid`,
    {
      method: "GET",
      headers: ADMIN_HEADERS,
    }
  );
  console.log(`   Status: ${invalidUUID.status} | Expected: 400`);

  // Test 3: Missing required fields
  console.log("3. Testing missing required fields...");
  const missingFields = await makeRequest(`${API_BASE_URL}/timeline-events`, {
    method: "POST",
    headers: ADMIN_HEADERS,
    body: JSON.stringify({
      // Missing application_id and title
      description: "Event without required fields",
    }),
  });
  console.log(`   Status: ${missingFields.status} | Expected: 400`);
}

/**
 * Cleanup created test data
 */
async function cleanup() {
  console.log("\n🧹 Cleaning up test data...\n");

  // Delete created note
  if (createdNoteId) {
    console.log(`Deleting test note: ${createdNoteId}...`);
    const deleteNote = await makeRequest(
      `${API_BASE_URL}/timeline-event-notes/${createdNoteId}`,
      {
        method: "DELETE",
        headers: ADMIN_HEADERS,
      }
    );
    console.log(
      `   Status: ${deleteNote.status} | Success: ${deleteNote.success}`
    );
  }

  // Delete created request
  if (createdRequestId) {
    console.log(`Deleting test request: ${createdRequestId}...`);
    const deleteRequest = await makeRequest(
      `${API_BASE_URL}/timeline-event-requests/${createdRequestId}`,
      {
        method: "DELETE",
        headers: ADMIN_HEADERS,
      }
    );
    console.log(
      `   Status: ${deleteRequest.status} | Success: ${deleteRequest.success}`
    );
  }

  // Delete created event
  if (createdEventId) {
    console.log(`Deleting test event: ${createdEventId}...`);
    const deleteEvent = await makeRequest(
      `${API_BASE_URL}/timeline-events/${createdEventId}`,
      {
        method: "DELETE",
        headers: ADMIN_HEADERS,
      }
    );
    console.log(
      `   Status: ${deleteEvent.status} | Success: ${deleteEvent.success}`
    );
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log("🚀 Starting Timeline Events API Tests");
  console.log("=====================================");

  try {
    await testTimelineEventsAPI();
    await testEventRequestsAPI();
    await testEventNotesAPI();
    await testErrorCases();
    await cleanup();

    console.log("\n✅ API Testing Complete!");
    console.log("\nNotes:");
    console.log("- Some user authentication tests may fail due to mock tokens");
    console.log(
      "- Replace mock tokens with real Supabase tokens for full testing"
    );
    console.log(
      "- Ensure your development server is running on localhost:3000"
    );
    console.log("- Check your Supabase configuration and service role key");
  } catch (error) {
    console.error("\n❌ Test runner error:", error);
  }
}

// Check if running directly (not imported)
if (require.main === module) {
  runTests();
}

module.exports = {
  runTests,
  testTimelineEventsAPI,
  testEventRequestsAPI,
  testEventNotesAPI,
  testErrorCases,
};
