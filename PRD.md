# PantryCraft — Product Requirements Document

**Version:** 1.0  
**Date:** 2026-05-02  
**Author:** Ethan Chan  
**Status:** Draft

---

## 1. Overview

PantryCraft is a web application that helps users discover and generate recipes based on ingredients they already have, while building a community of food enthusiasts who share recipes, tips, and achievements.

### Problem Statement

Home cooks frequently face two friction points: (1) not knowing what to cook with ingredients on hand, leading to food waste, and (2) lacking a focused community space to share food experiences beyond general-purpose social platforms.

### Solution

PantryCraft combines an AI-powered recipe generator (input your ingredients → get recipes) with a social community layer (share, like, comment, follow chefs) and a curated recipe discovery feed.

### Target Users

- Home cooks of all skill levels looking to reduce food waste and cooking decision fatigue
- Food enthusiasts who want to share recipes and engage with a cooking-focused community

---

## 2. Goals & Success Metrics

| Goal | Metric | Target (6-month) |
|------|--------|-----------------|
| Grow active user base | Monthly active users | 5,000 MAU |
| Drive recipe engagement | Recipes liked or bookmarked per session | ≥ 2 |
| Validate generator utility | Generator sessions per week | 500+ |
| Build community retention | 30-day retention rate | 30% |
| Content growth | New recipes posted per week | 50+ |

---

## 3. Scope

### In Scope (v1.0)

- User authentication (sign up, log in, profile)
- Recipe discovery with search and filtering
- AI-powered recipe generator (ingredient input → recipe suggestions)
- Recipe detail page (full instructions, ingredients, ratings)
- Community feed (posts, achievements, tips)
- Social interactions (like, bookmark, comment)
- User profiles (posted recipes, bookmarks, follower count)

### Out of Scope (future)

- Mobile app (iOS/Android)
- Paid subscription or monetization
- Meal planning / grocery list features
- Third-party recipe import (e.g., from URLs)
- Dietary/allergy preference engine
- Video recipe content

---

## 4. Features & Requirements

### 4.1 Authentication

**User Stories**
- As a visitor, I can sign up with email and password so I can save recipes and interact with the community.
- As a returning user, I can log in and have my session persist so I don't re-authenticate on every visit.

**Requirements**
- Sign up with name, email, password
- Login with email and password; JWT-based session
- Logout from any page
- Protected routes redirect unauthenticated users to login
- Passwords hashed with bcrypt; minimum 8 characters

**Backend**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (returns current user from token)

**Data Model (User)**
```
User {
  _id
  name: String
  email: String (unique)
  passwordHash: String
  avatar: String (URL)
  bio: String
  followers: [UserId]
  following: [UserId]
  createdAt: Date
}
```

---

### 4.2 Recipe Discovery

**User Stories**
- As a user, I can browse all community recipes with filters and sorting so I can find what to cook.
- As a user, I can search recipes by name or ingredient so I can quickly find relevant results.

**Requirements**
- Recipe grid with pagination or infinite scroll (≥ 12 cards per page)
- Filter by category (Breakfast, Lunch, Dinner, Snack, Dessert), difficulty (Easy, Medium, Hard)
- Sort by: Most Recent, Most Liked, Highest Rated, Quickest Cook Time
- Full-text search across title and tags (backend-powered, not client-side)
- Trending recipes section on homepage (top 6 by likes)

**Backend**
- `GET /api/recipes?search=&category=&difficulty=&sort=&page=&limit=`
- `GET /api/recipes/featured` — top 6 by likes
- `GET /api/recipes/:id` — full recipe detail

**Data Model (Recipe) — extended**
```
Recipe {
  _id
  title: String
  description: String
  author: UserId (ref)
  image: String (URL)
  ingredients: [{ name, quantity, unit }]
  steps: [{ order, instruction }]
  cookTime: String
  prepTime: String
  servings: Number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: String
  tags: [String]
  rating: Number (computed avg)
  ratings: [{ user: UserId, score: Number }]
  likes: [UserId]
  bookmarks: [UserId]
  comments: [CommentId]
  generatedByAI: Boolean
  createdAt: Date
}
```

---

### 4.3 Recipe Detail Page

**User Stories**
- As a user, I can view the full recipe (ingredients, steps, photos) so I can cook it.
- As a user, I can rate and comment on a recipe so I can share my experience.

**Requirements**
- Dedicated page at `/recipe/:id`
- Displays: hero image, title, author (linked to profile), cook/prep time, servings, difficulty, tags
- Ingredients list and step-by-step instructions
- Star rating widget (1–5); show average rating and count
- Comments section with add/delete (own comments only)
- Like and bookmark buttons with real-time count update
- "Similar Recipes" section (same category, top 4 by likes)

**Backend**
- `POST /api/recipes/:id/like` — toggle like
- `POST /api/recipes/:id/bookmark` — toggle bookmark
- `POST /api/recipes/:id/rate` — submit or update rating
- `GET /api/recipes/:id/comments`
- `POST /api/recipes/:id/comments`
- `DELETE /api/recipes/:id/comments/:commentId`

---

### 4.4 AI Recipe Generator

**User Stories**
- As a user, I can enter ingredients I have on hand and receive recipe suggestions so I can reduce food waste.
- As a user, I can save a generated recipe to my profile so I can reference it later.

**Requirements**
- Input field to add/remove ingredients (tag-style UI)
- Optional filters: max cook time, difficulty preference
- Submit triggers call to AI API; display 1–3 recipe suggestions
- Each suggestion shows: title, estimated cook time, difficulty, ingredient match %
- User can expand a suggestion to see full recipe (ingredients + steps)
- "Save to My Recipes" saves the generated recipe to the user's profile
- Generated recipes are marked with an AI badge in the feed

**Implementation Notes**
- Use the Claude API (Anthropic) for generation — structured output returning recipe JSON
- Backend proxy endpoint handles API key security; never expose key to client
- Rate limit: 5 generator requests per user per hour

**Backend**
- `POST /api/generate` — body: `{ ingredients: [], maxCookTime?, difficulty? }`
- Returns array of recipe objects (not yet persisted)
- `POST /api/generate/save` — saves a generated recipe to DB under the authenticated user

---

### 4.5 Community Feed

**User Stories**
- As a user, I can see a feed of posts from the community so I can discover content and stay engaged.
- As a user, I can post a recipe, tip, or achievement to share with the community.

**Requirements**
- Feed shows: recipe shares, cooking tips (text posts), achievements (e.g., "made 10 recipes")
- Filter tabs: All, Recipes, Tips, Achievements
- Trending Topics sidebar (most used tags in the last 7 days)
- Featured Chefs sidebar (top users by total recipe likes)
- Like and comment on any post
- Pagination or infinite scroll

**Data Model (Post)**
```
Post {
  _id
  type: 'recipe' | 'tip' | 'achievement'
  author: UserId
  content: String
  recipe: RecipeId (optional, if type=recipe)
  likes: [UserId]
  comments: [CommentId]
  createdAt: Date
}
```

---

### 4.6 User Profile

**User Stories**
- As a user, I can view my own profile to see my recipes, bookmarks, and stats.
- As a user, I can view another user's profile to explore their recipes and follow them.

**Requirements**
- Profile page at `/profile/:userId`
- Displays: avatar, name, bio, follower/following counts, join date
- Tabs: My Recipes, Bookmarked, Liked
- Edit profile (name, bio, avatar) on own profile
- Follow/Unfollow button on other user profiles
- Recipe count, total likes received displayed as stats

**Backend**
- `GET /api/users/:id`
- `PUT /api/users/:id` (auth required, own profile only)
- `POST /api/users/:id/follow` — toggle follow
- `GET /api/users/:id/recipes`
- `GET /api/users/:id/bookmarks`

---

### 4.7 Recipe Submission (Create/Edit/Delete)

**User Stories**
- As a user, I can submit my own recipe to share with the community.
- As a recipe author, I can edit or delete my recipe.

**Requirements**
- Multi-step form: basic info → ingredients → steps → image upload/URL → preview
- Required fields: title, at least 2 ingredients, at least 1 step, difficulty, category
- Image: accept URL or file upload (store on Cloudinary or similar)
- Edit recipe accessible from profile or recipe detail (own recipes only)
- Delete prompts confirmation dialog

**Backend**
- `POST /api/recipes` (auth required)
- `PUT /api/recipes/:id` (auth required, author only)
- `DELETE /api/recipes/:id` (auth required, author only)

---

## 5. Non-Functional Requirements

| Requirement | Spec |
|-------------|------|
| Performance | Initial page load < 2s on broadband; recipe grid renders < 500ms |
| Availability | 99.5% uptime target |
| Security | HTTPS only; JWT tokens with 7-day expiry; rate limit all write endpoints |
| Accessibility | WCAG 2.1 AA compliance; keyboard navigable; screen reader labels |
| Responsive Design | Fully functional on mobile (375px+), tablet, and desktop |
| SEO | Recipe detail pages server-side or statically rendered with meta tags |

---

## 6. Technical Architecture

### Current Stack (to be extended)

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express 5 |
| Database | MongoDB Atlas (Mongoose ODM) |
| Hosting | Render (backend), TBD (frontend) |
| AI | Claude API (Anthropic) |
| Media | Cloudinary (image uploads — to add) |
| Auth | JWT + bcrypt (to add) |

### Key Changes from Current State

1. **Add authentication middleware** to Express; protect write endpoints
2. **Expand Recipe schema** to include ingredients, steps, ratings, comments, author ref
3. **Add User model** with follow graph
4. **Add Comment model**
5. **Implement backend search** with MongoDB text indexes
6. **Add `/api/generate` endpoint** proxying Claude API
7. **Implement Generator page** in the frontend (`Generator.tsx` currently empty)
8. **Connect all UI interactions to real API calls** (likes, bookmarks, search — currently console-only)
9. **Add pagination** to recipe and feed endpoints

---

## 7. Open Questions

1. **Image hosting:** Use Cloudinary free tier, or accept URLs only for v1 to keep scope small?
2. **AI generation model:** Claude Haiku (fast/cheap) vs Sonnet (higher quality)? Recommend Haiku for v1 given rate limits.
3. **Recipe moderation:** Is community content moderated, or is it open submission? Flag/report mechanism needed?
4. **Search scope:** Should search span the full recipe body (ingredients, steps) or just title and tags?
5. **Achievements:** Are achievements auto-generated (milestones) or manually posted by users?

---

## 8. Milestones

| Milestone | Scope | Target |
|-----------|-------|--------|
| M1 — Auth & Profiles | User model, JWT auth, profile pages | Week 2 |
| M2 — Recipe CRUD | Full recipe create/edit/delete, detail page, comments | Week 4 |
| M3 — Generator | Generator page + Claude API integration | Week 5 |
| M4 — Community | Community feed, posts, follow graph | Week 7 |
| M5 — Polish | Search, pagination, mobile polish, accessibility | Week 8 |

---

*This document will be updated as decisions are made on open questions and scope is refined.*
