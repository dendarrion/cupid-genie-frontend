# Swipe Matching App (Frontend)

> [!NOTE] 
> This project is intended for portfolio demonstration purposes only. 
> It was developed as part of an assessment and may not represent a production-ready system.

A swipe-based matching interface inspired by modern dating and discovery apps. This project focuses on smooth UI interactions, real-time feedback, and clean state management using a modern frontend stack.


## Overview

This application allows users to browse through recommended profiles and perform swipe actions (like or skip). It includes animated card transitions, match feedback, and media viewing features.

This repository contains **frontend source code only**.

## Features

- Swipe gestures (drag or button-triggered)
- Like / Skip interactions
- Real-time match feedback modal
- Animated card stack with transitions
- Profile preview with gallery and lightbox
- Responsive layout for mobile and desktop
- State management for seen/swiped users

## Tech Stack

- Vue 3 (Composition API)
- Tailwind CSS
- Apollo Client (GraphQL)
- JavaScript (ES6+)

## Project Structure

### Interaction Flow
1. User swipes or clicks action buttons
2. Interaction mutation is triggered
3. UI updates immediately (optimistic feel)
4. Match modal appears if applicable

## Setup
```bash
npm install 

# run dev server (http://localhost:5173)
npm run dev
```

## Limitations
- Backend services are not included in this repository
- Authentication and persistence depend on external APIs
- No offline support

## Future Improvements 

- [ ] Add undo swipe functionality
- [ ] Improve animation polish and gesture physics
- [ ] Introduce caching and pagination for recommendations
- [ ] Enhance accessibility support
