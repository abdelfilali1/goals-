# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 15 (App Router, Server Actions) + TypeScript, PostgreSQL via Prisma, Tailwind CSS. Hosted on Railway, deployed from a git repository.

## Users

One person: the owner. They define their own life objectives across areas such as Family, Health and Work, plan small daily actions toward them, and review their progress. The most important moment is the end of the day, **mostly on a phone**: tick what got done, push what didn't to tomorrow, and move on.

## Product Purpose

Compass connects everyday to-dos to the objectives they serve, so the owner can see whether daily effort is adding up. Success means the end-of-day routine takes under a minute, nothing unfinished silently disappears, and the progress page gives an honest picture per area, per objective and over time.

## Positioning

Unlike a generic to-do list, every action is tied to an objective and a sub-objective, and slippage is made visible. A to-do pushed day after day carries a count ("Pushed by 5 days") instead of quietly reappearing as new.

## Operating Context

- **Morning or any time:** add to-dos for today (or another day), each linked to an objective and sub-objective.
- **End of day, on a phone:** tick completed to-dos. Push unfinished ones one at a time or all at once to the next day.
- **Next day:** carried-over items appear in their own section with how many days they have been pushed. Items that were never pushed and whose day has passed show as overdue.
- **Planning:** day, week and month views of the same to-dos.
- **Reviewing:** a progress page with overall, per-category, per-objective and per-sub-objective completion, plus cumulative completion over time.

## Capabilities and Constraints

- **Hierarchy:** Category (Family, Health, Work, Personal, Finance by default, editable) → Objective (title, description, optional target date, archivable) → Sub-objectives (at least one per objective).
- **To-do fields:** title, linked objective and sub-objective (both required), original date, current due date, push count, done.
- **"Pushed by N days"** = current due date − original date.
- **Progress** = done ÷ total for to-dos due on or before today. Future to-dos are excluded.
- **Users:** one user, protected by a single password set in an environment variable. No sign-up, no sharing.
- **Dates:** "today" follows the browser's timezone, not the server's.

## Brand Commitments

- **Name:** Compass.
- **Interface language:** English.
- **Look:** the owner asked for a simple, clean, white design.

## Evidence on Hand

None. There is no existing content, logo or data. Do not invent sample metrics, testimonials or objectives in the shipped UI. Empty states must handle a fresh install.

## Product Principles

1. **The end-of-day routine comes first.** Ticking and pushing must be fast, thumb-reachable and forgiving on a phone.
2. **Honest about slippage.** Pushed and overdue work stays visible with its age. It is never hidden or reset.
3. **Every action has a reason.** A to-do always shows the objective and area it serves.
4. **Calm over clever.** It's a personal tool used daily, so there's no noise, gamification or decoration that competes with the list.

## Accessibility & Inclusion

Full keyboard operation and visible focus states. Touch targets at least 44px on phone. WCAG AA contrast.
