// Simple test to check assignments in browser console
// Copy and paste this in your browser console while on the student page

console.log("🔍 Testing assignment display...");

// Check if students state has assignment data
if (window.React && window.React.version) {
  console.log("React is available");

  // You can also manually check the database
  fetch("/api/admin/staff")
    .then((res) => res.json())
    .then((data) => {
      console.log("Staff API response:", data);
    });

  // Or check a specific student's assignment
  // (You'll need to replace 'STUDENT_ID' with actual ID)
  // fetch('/api/admin/assign-student', {
  //   method: 'POST',
  //   headers: {'Content-Type': 'application/json'},
  //   body: JSON.stringify({studentId: 'STUDENT_ID', staffId: 'STAFF_ID'})
  // }).then(res => res.json()).then(console.log);
}

// Check the current page state
console.log("Current page location:", window.location.pathname);
console.log("Local storage:", Object.keys(localStorage));
console.log("Session storage:", Object.keys(sessionStorage));
