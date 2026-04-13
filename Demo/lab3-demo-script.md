# Lab 3 Demo Script (4-5 Minutes)

Use this script to record your required MP4 submission.

## 0:00-0:40 - Intro and Architecture

- Introduce project name and team members.
- Show repository structure:
  - `frontends/shell`
  - `frontends/projects-app`
  - `frontends/ai-review-app`
  - `services/gateway`
  - `services/auth-service`
  - `services/projects-service`
- Explain gateway + subgraphs + module federation at a high level.

## 0:40-1:20 - Start the System

- Run `npm run start:milestone` (or `npm start` for full mode).
- Show logs proving:
  - auth service running
  - projects service running
  - gateway running on `4000`
  - shell app running on `3000`

## 1:20-2:30 - Authentication Demo

- Register a new user.
- Log out.
- Log in with the same user.
- Refresh browser and show session still active.
- Mention HTTP-only cookie + Mongo session storage.

## 2:30-4:00 - Projects Workflow Demo

- Create a project.
- Open project detail.
- Add one feature request.
- Submit at least 2 drafts to same feature.
- Show draft history (versions visible).

## 4:00-4:40 - Micro-Frontend Integration Demo

- Show shell routing.
- Open projects route (remote loaded by shell).
- Open AI review route (placeholder or integrated panel remote).

## 4:40-5:00 - Closing

- Summarize completed Lab 3 requirements.
- Mention this milestone is reusable for final group project.

## Recording Output

- Save final recording as: `Demo/Lab3_Group3_Demo.mp4`

