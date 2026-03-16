# Miniature Artists Community Platform --- PROJECT SPEC (MVP)

## Overview

A platform for the miniature artists community, where users can:
- share their works
- participate in events
- earn a community rating

This document defines the requirements for the MVP version of the platform.

------------------------------------------------------------------------

# Tech Stack (MVP)

**Framework:** Next.js (App Router)  
**Language:** TypeScript  
**Styling:** Tailwind CSS  
  also for styling add easy way to change fonts and colors
**Authentication:** planned (NextAuth)  / JWT 
**Database:** TBD (dummy data used for MVP) / ASP.NET Core Web API 
**Image storage:** TBD (Cloudinary / S3 planned for future)

------------------------------------------------------------------------

# Core Entities

## User

Fields:

-   id
-   name
-   avatar
-   bio
-   links\[\]
-   rating
-   createdAt

------------------------------------------------------------------------

## Post

Fields:

-   id
-   authorId
-   title
-   description
-   images\[\]
-   level (gaming \| display)
-   genre
-   likes
-   createdAt

Rules:

-   maximum 4 images
-   maximum 36MB per image

------------------------------------------------------------------------

## Event

Fields:

-   id
-   title
-   cover
-   description
-   date
-   createdBy
-   createdAt

------------------------------------------------------------------------

## EventNews

Fields:

-   id
-   eventId
-   cover
-   title
-   text
-   createdAt

------------------------------------------------------------------------

# Core Pages

## Gallery

Route:

/gallery

Features:

-   grid gallery
-   view post
-   filter by level
-   filter by genre
-   sorting (new / popular)

------------------------------------------------------------------------

## Post Page

Route:

/post/\[id\]

Contains:

-   gallery images
-   title
-   description
-   author
-   likes

------------------------------------------------------------------------

## Profile Page

Route:

/profile/\[username\]

Contains:

-   avatar
-   name
-   rating
-   bio
-   external links
-   user posts

------------------------------------------------------------------------

## Leaderboard

Route:

/leaderboard

Table fields:

-   rank
-   avatar
-   username
-   rating
-   posts count

------------------------------------------------------------------------

## Events

Route:

/events

Contains:

-   list of events
-   sorting: now/upcomming/archive

------------------------------------------------------------------------

## Event Page

Route:

/events/\[id\]

Contains:

-   title
-   date
-   description
-   event news

------------------------------------------------------------------------

# Admin Panel

Route:

/admin

Sections:

-   Users
-   Posts
-   Events

Admin capabilities:

Users: - view users

Posts: - delete posts

Events: - create events - edit events

------------------------------------------------------------------------

# Project Structure

src/

app/ - gallery/ - post/\[id\]/ - profile/\[username\]/ - leaderboard/ -
events/ - events/\[id\]/ - admin/

components/ - PostCard - GalleryGrid - ProfileHeader -
LeaderboardTable - EventCard - AdminTable

lib/

dummy-data/ - users.ts - posts.ts - events.ts

services/ - postService.ts - userService.ts - eventService.ts

types/ - user.ts - post.ts - event.ts

------------------------------------------------------------------------

# Dummy Data Strategy

While the database is not yet defined, local dummy data is used.

Location:

src/lib/dummy-data

Access through services:

postService.ts\
userService.ts\
eventService.ts

------------------------------------------------------------------------

# Future Improvements

Not part of MVP:

-   comments
-   followers
-   messaging
-   notifications
-   moderation system
-   advanced search
-   tagging system

------------------------------------------------------------------------

# UX Principles

-   visual-first platform
-   mobile-first
-   simple UI
-   fast loading
-   focus on artwork

Gallery layout:

grid (3--4 columns)

------------------------------------------------------------------------

# Development Phases

Phase 1

-   project setup
-   gallery page
-   post page
-   dummy data

Phase 2

-   profile pages
-   leaderboard

Phase 3

-   events
-   event news

Phase 4

-   admin panel
-   post creation

------------------------------------------------------------------------

End of document.
