# Weights Tracker - Implementation Plan

## Overview
Mobile-first gym weights tracking app. No subscription nonsense, just a clean CRUD app.

**Stack:** SvelteKit + Tailwind v4 + Flowbite-svelte + Prisma + PostgreSQL

**Settings:**
- Local Postgres (user has it installed)
- Full user/password auth (so others can use it)
- Kilograms for weight units

---

## Phase 1: Foundation Setup

### 1.1 Install Dependencies
```bash
npm install @prisma/client flowbite-svelte flowbite flowbite-svelte-icons bcrypt
npm install -D prisma @types/bcrypt
```

### 1.2 Prisma Schema (`prisma/schema.prisma`)

**Auth entities:**

| Entity | Purpose |
|--------|---------|
| `User` | Email, hashed password, name |
| `Session` | Session token, expiry, linked to user |

**Core entities using template-instance pattern:**

| Template (What you plan) | Instance (What you did) |
|--------------------------|-------------------------|
| `ExerciseTemplate` | - |
| `WorkoutPlan` | `WorkoutSession` |
| `WorkoutWeek` | - |
| `WorkoutDay` | - |
| `PlannedExercise` | `CompletedExercise` |
| - | `CompletedSet` |

**Key relationships:**
- All user data scoped to `User` via `userId` foreign key
- `WorkoutPlan` has many `WorkoutWeek`s (for multi-week programs, or just 1 week that repeats)
- `WorkoutWeek` has many `WorkoutDay`s (e.g., Day 1 - Push, Day 2 - Pull)
- `WorkoutDay` has many `PlannedExercise`s with target sets/reps/weight
- `ExerciseTemplate` is shared across plans (enables "last time" queries)
- `WorkoutSession` records an actual workout with `CompletedExercise` and `CompletedSet`

**JSON Import Schema:**
```json
{
  "name": "Push Pull Legs",
  "weeks": [
    {
      "name": "Week 1",
      "days": [
        {
          "name": "Push",
          "exercises": [
            { "name": "Bench Press", "sets": 3, "reps": 12 },
            { "name": "Overhead Press", "sets": 3, "reps": 10 }
          ]
        }
      ]
    }
  ]
}
```

### 1.3 Configure Flowbite-svelte + Dark Theme
- Update `src/routes/layout.css` with Flowbite plugin
- Add `class="dark"` to `<html>` in `src/app.html`
- Set dark background on body

### 1.4 Prisma Client
- Create `src/lib/server/db.ts` singleton

---

## Phase 2: Core Layout & Navigation

### 2.1 Bottom Navigation
Mobile nav with 4 tabs:
- Dashboard (home icon)
- Plans (list icon)
- Workout (dumbbell icon)
- History (clock icon)

### 2.2 Page Header Component
- Back button
- Title
- Optional action button

### 2.3 Route Structure
```
src/routes/
├── +layout.svelte          # App shell + bottom nav
├── dashboard/+page.svelte  # Stats & recent workouts
├── plans/
│   ├── +page.svelte        # List plans
│   ├── new/+page.svelte    # Create plan
│   └── [planId]/           # Edit plan + days
├── workout/
│   ├── +page.svelte        # Select day to start
│   └── active/+page.svelte # THE MAIN LOOP
├── history/+page.svelte    # Past sessions
└── api/sets/+server.ts     # Real-time set saving
```

---

## Phase 3: Workout Plans CRUD

### 3.1 Plans List (`/plans`)
- Card for each plan showing name, days count, exercise count
- "New Plan" button

### 3.2 Create Plan (`/plans/new`)
- Name input
- Add weeks, then add days within each week
- **JSON Import:** Upload JSON file or paste JSON to create plan from template

### 3.3 Edit Plan (`/plans/[planId]`)
- Edit name
- Manage weeks (add/remove/reorder)
- Within each week: manage days (add/remove/reorder)
- Tap day to configure exercises

### 3.4 Day Exercises (`/plans/[planId]/weeks/[weekId]/days/[dayId]`)
- List of exercises with target sets/reps
- Add exercise modal (search/select from ExerciseTemplate)
- Reorder exercises
- Set targets (3 sets of 15 reps)

---

## Phase 4: The Main Workout Loop

This is the core feature - tracking an actual workout session.

### 4.1 Start Workout (`/workout`)
- Show current plan's days
- "Start Day 1 - Push" button
- Creates `WorkoutSession` and redirects to active

### 4.2 Active Workout (`/workout/active`)

**UI Layout (top to bottom):**
1. **Progress bar** - Exercise 2 of 6
2. **Exercise card** - "Barbell Curl" with target "3 sets × 15 reps"
3. **Last time display** - "Last time (3 days ago): 12.5kg × 15, 12.5kg × 14, 12.5kg × 12"
4. **Set entry formset** - Dynamic rows with:
   - Set number (1, 2, 3...)
   - Weight dropdown (pre-filled with last time's weight, in kg)
   - Reps dropdown (pre-filled with target reps)
   - Remove button
5. **Add Set button**
6. **Complete Exercise button** (fixed at bottom)

### 4.3 Data Flow
- Sets saved immediately via `/api/sets` (debounced) - no data loss if app closes
- "Last time" query: find most recent `CompletedExercise` for same `ExerciseTemplate`
- Pre-fill dropdowns with last session's values

### 4.4 Exercise Navigation
- Complete current → auto-advance to next
- Skip option (for if you can't do an exercise)
- Last exercise → completion summary

### 4.5 Workout Complete (`/workout/active/complete`)
- Summary of what was done
- Total sets, volume (kg lifted)
- "Done" button → back to dashboard

---

## Phase 5: History & Dashboard

### 5.1 Dashboard (`/dashboard`)
- Current plan name
- "Quick Start" button for next workout day
- Recent workouts list (last 5)
- Stats: workouts this week, streak

### 5.2 History (`/history`)
- List of past sessions
- Date, plan name, day name
- Tap to view details

### 5.3 Session Detail (`/workout/[sessionId]`)
- Full breakdown of that workout
- Each exercise with sets performed

---

## Phase 6: Authentication

### 6.1 Auth Routes
```
src/routes/
├── login/+page.svelte      # Login form
├── register/+page.svelte   # Registration form
└── logout/+page.server.ts  # Logout action
```

### 6.2 Auth Flow
- **Register:** Email + password → hash with bcrypt → create User + Session → set cookie
- **Login:** Email + password → verify hash → create Session → set cookie
- **Session:** Secure httpOnly cookie with session token
- **Protection:** `+layout.server.ts` checks session, redirects to `/login` if missing

### 6.3 Session Handling
- `src/lib/server/auth.ts` - Helper functions for session management
- Session expires after 30 days (configurable)
- Auto-extend on activity

---

## Key Components

| Component | Purpose |
|-----------|---------|
| `BottomNav.svelte` | Mobile navigation |
| `PageHeader.svelte` | Title + back button |
| `ExerciseCard.svelte` | Current exercise display |
| `SetEntryForm.svelte` | Dynamic formset for sets |
| `SetRow.svelte` | Single set input (weight/reps dropdowns) |
| `LastTimeDisplay.svelte` | Previous session data |
| `PlanCard.svelte` | Plan in list view |
| `ExerciseSelector.svelte` | Modal to pick exercises |

---

## Technical Decisions

| Decision | Why |
|----------|-----|
| Template-instance schema | Clean separation of plans vs actual workouts, easy history queries |
| Immediate set saving | No data loss if app closes mid-workout |
| ExerciseTemplate shared | "Last time" works across any workout that uses same exercise |
| Dark mode only | Simpler, gyms are often dim, most fitness apps use dark |
| Mobile-first, no desktop | Keep it focused, you're using this at the gym |

---

## Files to Create/Modify

**Create:**
- `prisma/schema.prisma` - Full schema with User, Session, and workout entities
- `.env` - DATABASE_URL for local Postgres
- `src/lib/server/db.ts` - Prisma client singleton
- `src/lib/server/auth.ts` - Session helpers (create, validate, destroy)
- `src/routes/login/+page.svelte` - Login form
- `src/routes/login/+page.server.ts` - Login action
- `src/routes/register/+page.svelte` - Registration form
- `src/routes/register/+page.server.ts` - Registration action
- `src/routes/logout/+page.server.ts` - Logout action
- `src/lib/components/layout/BottomNav.svelte`
- `src/lib/components/layout/PageHeader.svelte`
- `src/lib/components/workout/ExerciseCard.svelte`
- `src/lib/components/workout/SetEntryForm.svelte`
- `src/lib/components/workout/SetRow.svelte`
- `src/lib/components/workout/LastTimeDisplay.svelte`
- `src/lib/server/queries/exercises.ts` - Last time query
- All route files under `src/routes/` for dashboard, plans, workout, history

**Modify:**
- `src/routes/layout.css` - Add Flowbite plugin
- `src/app.html` - Add `class="dark"` to html element
- `src/routes/+layout.svelte` - App shell with bottom nav
- `src/routes/+layout.server.ts` - Auth check, redirect to login if not authenticated

---

## Notes

<!-- Add your notes here -->
