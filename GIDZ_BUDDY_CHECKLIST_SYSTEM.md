# Gidz Buddy Checklist System

This system provides a dynamic, database-driven checklist for the SmartRecommendations component, allowing administrators to manage checklist items with YouTube video guides.

## Features

- ✅ Database-driven checklist items
- ✅ YouTube video integration for each item
- ✅ Priority-based ordering (High, Medium, Low)
- ✅ Category-based organization
- ✅ Admin interface for managing items
- ✅ Dynamic icons and action buttons
- ✅ Progress tracking for users

## Database Setup

### 1. Run the SQL Migration

Execute the following SQL in your Supabase SQL Editor:

```sql
-- Run the migration file
\i database/migrations/004_create_gidz_buddy_checklist.sql
```

Or copy and paste the contents of `database/migrations/004_create_gidz_buddy_checklist.sql` into the Supabase SQL Editor.

### 2. Verify the Table Structure

The `gidz_buddy_checklist` table includes:

- `id` - Primary key (UUID)
- `item_id` - Unique identifier for each item
- `title` - Title of the checklist item
- `description` - Detailed description
- `priority` - Priority level (1=High, 2=Medium, 3=Low)
- `category` - Category (finance, documents, housing, etc.)
- `icon` - Icon identifier for the frontend
- `action_text` - Text for the action button
- `estimated_time` - Time required (e.g., "30 minutes")
- `impact` - Impact level (Critical, High, Medium, Low)
- `youtube_link` - YouTube video URL
- `youtube_title` - YouTube video title
- `next_steps` - JSON array of next steps
- `is_active` - Whether the item is active
- `display_order` - Display order
- Timestamps for created_at and updated_at

## API Endpoints

### GET /api/gidz-buddy-checklist

Fetches all active checklist items ordered by display_order and priority.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "blocked-account",
      "title": "Blocked Account - Expatrio",
      "description": "Open a blocked account...",
      "priority": 1,
      "category": "finance",
      "icon": "FaBank",
      "action": "Open Account",
      "estimatedTime": "30 minutes",
      "impact": "Critical",
      "youtubeLink": "https://youtube.com/...",
      "youtubeTitle": "How to Open a Blocked Account...",
      "nextSteps": ["Step 1", "Step 2", "..."],
      "displayOrder": 1
    }
  ]
}
```

### POST /api/gidz-buddy-checklist

Creates a new checklist item.

**Request Body:**

```json
{
  "item_id": "unique-id",
  "title": "Item Title",
  "description": "Item description",
  "priority": 1,
  "category": "finance",
  "icon": "FaBank",
  "action_text": "Take Action",
  "estimated_time": "30 minutes",
  "impact": "Critical",
  "youtube_link": "https://youtube.com/...",
  "youtube_title": "Video Title",
  "next_steps": ["Step 1", "Step 2"],
  "display_order": 1
}
```

### PUT /api/gidz-buddy-checklist

Updates an existing checklist item.

### DELETE /api/gidz-buddy-checklist?id={id}

Deletes a checklist item.

## Component Usage

### SmartRecommendations Component

The updated `SmartRecommendations` component now:

1. Fetches data from the API instead of using hardcoded data
2. Displays YouTube video buttons for each item
3. Maps icon strings to actual React icon components
4. Shows video guides in a dedicated section

### Admin Interface

Use the `GidzBuddyChecklistAdmin` component to:

1. View all checklist items
2. Add new items with all fields including YouTube links
3. Edit existing items
4. Toggle item visibility (active/inactive)
5. Reorder items using display_order

## YouTube Integration

Each checklist item can have:

- `youtube_link`: Direct YouTube URL
- `youtube_title`: Descriptive title for the video

Videos are displayed with:

- A dedicated video guide section in each checklist item
- A "Watch" button that opens the video in a new tab
- Video title display for better context

## Categories

Available categories:

- `finance` - Financial requirements (blocked accounts, etc.)
- `documents` - Document preparation (motivation letters, etc.)
- `housing` - Accommodation search and booking
- `preparation` - General preparation (language learning, etc.)
- `travel` - Travel arrangements (flights, etc.)
- `insurance` - Insurance requirements
- `education` - Educational requirements
- `legal` - Legal requirements
- `health` - Health-related requirements

## Icons

Available icons (mapped to React Icons):

- `FaBank` - Banking/finance
- `FaEnvelope` - Documents/communication
- `FaHome` - Housing
- `FaLanguage` - Language learning
- `FaPlane` - Travel
- `FaHeartbeat` - Health
- `FaGraduationCap` - Education
- `FaFileAlt` - Documents
- `FaUniversity` - University-related
- `FaPassport` - Legal/visa
- `FaCalendarAlt` - Scheduling
- `FaChartLine` - Progress/planning
- `FaBolt` - Urgent/important
- `FaUserFriends` - Social/networking
- `FaLightbulb` - General/tips

## Adding to Admin Panel

To integrate the admin interface into your existing admin panel:

1. Import the component:

```jsx
import GidzBuddyChecklistAdmin from "./components/GidzBuddyChecklistAdmin";
```

2. Add it as a new tab or page in your admin interface:

```jsx
{
  activeTab === "checklist" && <GidzBuddyChecklistAdmin />;
}
```

## Customization

### Adding New Categories

1. Update the `categoryOptions` array in the admin component
2. Update the category description in this README

### Adding New Icons

1. Import the new icon in `SmartRecommendations.jsx`
2. Add it to the `getIconComponent` function
3. Add it to the `iconOptions` array in the admin component

### Changing Priority Levels

1. Update the database schema if needed
2. Update the priority handling in both components
3. Update the `getPriorityColor` and `getPriorityLabel` functions

## Security Considerations

- The API endpoints should include authentication checks for admin operations (POST, PUT, DELETE)
- Consider implementing role-based access control for the admin interface
- YouTube links should be validated to ensure they're legitimate YouTube URLs

## Future Enhancements

1. **Rich Text Support**: Add support for rich text descriptions using a WYSIWYG editor
2. **File Attachments**: Allow PDF guides or other file attachments
3. **User Progress Tracking**: Store user completion status in the database
4. **Notifications**: Send reminders for uncompleted high-priority items
5. **Multilingual Support**: Add support for multiple languages
6. **Analytics**: Track which items are most/least completed
7. **Bulk Operations**: Add bulk edit/delete functionality in the admin interface
