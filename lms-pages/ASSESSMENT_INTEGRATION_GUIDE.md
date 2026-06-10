# Assessment & Learning Path Persistence Integration Guide

## Overview
This guide integrates persistent assessment storage with your LMS so users' assessments, learning paths, and course recommendations are saved and retrievable.

## What's Been Created

### 1. Database Schema (`database/supabase-setup.sql`)
Three new tables have been created:
- **user_assessments**: Stores user assessment results
- **learning_paths**: Stores personalized learning roadmaps and course recommendations
- **user_learning_progress**: Tracks progress through courses

### 2. Backend Setup

#### New File: `server/utils/assessmentDB.js`
Database operations module with functions:
- `saveAssessment()` - Save/update user assessment
- `getAssessment()` - Retrieve user's assessment
- `saveLearningPath()` - Save learning roadmap and courses
- `getLearningPath()` - Retrieve learning path
- `deleteAssessment()` - Delete for retaking assessment

#### New API Endpoints in `server.js`
- `POST /api/chat` - Now saves assessment to database when complete
- `GET /api/assessment/:userId` - Get user's saved assessment
- `GET /api/learning-path/:userId` - Get user's learning path
- `POST /api/retake-assessment/:userId` - Delete and restart
- `GET /api/user-profile/:userId` - Get complete user profile with assessment

### 3. Frontend Components

#### New File: `src/components/UserAssessmentView.jsx`
Displays:
- User's current assessment (career path, specialization, skill level)
- Personalized learning roadmap
- Recommended courses
- Buttons to browse courses or retake assessment

#### New File: `src/utils/assessmentService.js`
Frontend utility functions:
- `hasUserAssessment()` - Check if user has assessment
- `getUserAssessment()` - Fetch assessment data
- `formatAssessmentData()` - Format for display

## Setup Instructions

### Step 1: Set Up Supabase Tables
1. Go to your Supabase dashboard: https://app.supabase.com
2. Open the SQL Editor
3. Copy the entire content from `database/supabase-setup.sql`
4. Paste into the SQL Editor and click "Run"
5. Verify tables are created in the Tables section

### Step 2: Verify Environment Variables
Your `.env` should have:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Update Dashboard Component (OPTIONAL but Recommended)
To show existing assessments to users who have already completed one, add this to `src/pages/Dashboard.jsx`:

**In the imports section (around line 1-20):**
```javascript
import UserAssessmentView from '../components/UserAssessmentView';
import { getUserAssessment, hasUserAssessment } from '../utils/assessmentService';
```

**In the state declarations (around line 50-80), add:**
```javascript
const [userHasAssessment, setUserHasAssessment] = useState(false);
const [assessmentData, setAssessmentData] = useState(null);
```

**In the `getSession` useEffect (around line 455), after `await loadUserProfile(session.user);` add:**
```javascript
// Check for existing assessment
const hasAssessment = await hasUserAssessment(userId);
setUserHasAssessment(hasAssessment);
if (hasAssessment) {
  const data = await getUserAssessment(userId);
  setAssessmentData(data);
}
```

**In the chat section of the render (search for "Chat Messages" section), add:**
```jsx
{activeTab === 'overview' && !isAssessed && userHasAssessment && (
  <div className="mt-8">
    <UserAssessmentView 
      userId={userId} 
      onRetakeClick={startAssessment}
    />
  </div>
)}
```

### Step 4: Test the Integration

1. **Start your server:**
   ```bash
   npm run dev:all
   ```

2. **Complete an assessment:**
   - Click "Start Assessment" in the dashboard
   - Answer all assessment questions
   - Verify the data is saved to the database by checking Supabase

3. **Verify data persistence:**
   - Refresh the page
   - The assessment data should still be visible
   - User can now see "View Assessment" option

4. **Test retake:**
   - Click "Retake Assessment"
   - Verify old data is deleted from Supabase
   - New assessment flow starts fresh

## API Usage Examples

### Get User Assessment
```javascript
const response = await fetch(`http://localhost:3001/api/assessment/${userId}`);
const data = await response.json();
// {
//   exists: true,
//   assessment: {
//     user_id, career_goal, specialization, 
//     experience_level, years_experience, created_at, updated_at
//   }
// }
```

### Get Learning Path
```javascript
const response = await fetch(`http://localhost:3001/api/learning-path/${userId}`);
const data = await response.json();
// {
//   exists: true,
//   learningPath: {
//     roadmap_content, recommended_courses, created_at, updated_at
//   }
// }
```

### Retake Assessment
```javascript
const response = await fetch(`http://localhost:3001/api/retake-assessment/${userId}`, {
  method: 'POST'
});
const data = await response.json();
// { success: true, message: 'Assessment deleted...' }
```

### Get Full User Profile
```javascript
const response = await fetch(`http://localhost:3001/api/user-profile/${userId}`);
const data = await response.json();
// {
//   userId, hasAssessment, assessment, 
//   hasLearningPath, learningPath
// }
```

## Features Enabled

✅ **Assessment Persistence**: Assessments are saved to the database
✅ **Learning Paths**: Personalized roadmaps and course recommendations saved
✅ **User Retrieval**: Users can view their saved assessment anytime
✅ **Retake Option**: Users can retake the assessment to update their profile
✅ **Progress Tracking**: Table available for tracking course progress
✅ **Database Backup**: All data safely stored in Supabase

## Next Steps

### 1. Show Assessment Status on Dashboard
Add a badge showing if user has a saved assessment:
```jsx
{userHasAssessment && (
  <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4">
    ✅ You have completed an assessment. <button onClick={...}>View it</button>
  </div>
)}
```

### 2. Display Learning Path in "My Learning" Page
Integrate the learning path display so users can see:
- Current learning roadmap
- Recommended courses with progress
- Suggested next courses

### 3. Add Progress Tracking
Update the `user_learning_progress` table as users complete courses:
```javascript
await supabase
  .from('user_learning_progress')
  .insert([{
    user_id: userId,
    course_name: 'React.js Mastery',
    status: 'in_progress',
    progress_percentage: 45
  }]);
```

### 4. Analytics Dashboard
Create insights from assessment data:
- Most popular career paths
- Common skill levels
- Course completion rates per specialization

## Troubleshooting

### Assessment Not Saving
1. Check Supabase tables exist: `user_assessments`, `learning_paths`
2. Verify environment variables are correct
3. Check server logs for errors
4. Ensure `server/utils/assessmentDB.js` is properly imported

### Can't Retrieve Assessment
1. Verify userId is consistent (check localStorage `userId`)
2. Check Supabase table has data for that user_id
3. Try the `/api/user-profile/:userId` endpoint first

### Import Errors
1. Ensure all files are created in correct paths
2. Check file extensions are `.js` (not `.jsx` for utils)
3. Verify dotenv is imported in assessmentDB.js

## Database Schema Reference

### user_assessments
```sql
- id: UUID (primary key)
- user_id: TEXT (unique, foreign key)
- career_goal: TEXT
- specialization: TEXT
- experience_level: TEXT
- years_experience: NUMERIC
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### learning_paths
```sql
- id: UUID (primary key)
- user_id: TEXT (unique, foreign key)
- assessment_id: UUID (foreign key)
- roadmap_content: TEXT
- recommended_courses: JSONB (JSON array)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### user_learning_progress
```sql
- id: UUID (primary key)
- user_id: TEXT
- course_name: TEXT
- status: TEXT (not_started, in_progress, completed)
- progress_percentage: NUMERIC
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## Support

If you encounter issues:
1. Check Supabase console for any database errors
2. Review server logs: `npm run server` output
3. Verify all files are in correct directories
4. Test endpoints using Postman or curl
