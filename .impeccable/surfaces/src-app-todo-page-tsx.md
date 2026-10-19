---
version: 1
slug: "src-app-todo-page-tsx"
primary_target: "src/app/todo/page.tsx"
related_targets: ["src/app/objectives/page.tsx","src/app/progress/page.tsx","src/app/layout.tsx"]
---

## Scope

The Compass app shell and its three working surfaces: To-do (Day, Week and Month views), Objectives, and Progress. Mode: operate. Mostly phone, at the end of the day. Built code-led.

## Job

The owner ticks done to-dos, pushes the unfinished ones to tomorrow, sees carried-over items with their delay, adds to-dos linked to an objective and sub-objective, and reviews progress.

## Direction contract

THESIS: The day is a departure timetable. Every to-do is a scheduled service, and slippage is a delay printed in red in its own column. The design refuses the category default: a grey list with one blue accent and a floating plus button.

OWN-WORLD: White enamel ground, black ink #111, signal red #D52B1E only for delay and overdue, done green #1E7A46, hairline rules #E6E8EB. A black shell bar (bottom tabs on phone, top bar on desktop). One variable grotesk, Archivo: normal width for text; condensed width, heavy weight and tabular numerals for column heads, dates, counts and delays. Category codes (FAM, HLT, WRK) sit in small coloured line plates.

STORY: The owner sees immediately what is due, what is late and by how much, ticks or pushes each row, and leaves with an honest count.

FIRST VIEWPORT: On phone, the header shows the date set large and condensed ("Mon 19.10"), a "2 of 5 done" readout, the Day/Week/Month tabs and prev/next arrows. Next comes a one-line add field. Then a column head (To-do · Delay), the Carried over and Overdue groups, and the Today rows. Each row has a checkbox, the title, a code plate with the objective path, a delay cell and a push button. "Move unfinished to tomorrow" closes the list, and the black tab bar sits at the bottom.

FORM: Departure Board (my top-ranked grounded candidate, position 1, chosen as Impeccable's pick). seed:0f5ee390ccd02e56

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Signature move

The delay column. A pushed to-do shows "+N d" in condensed red tabular figures in a fixed right column, aligned down the board like train delays. Week and Month views reuse the same delay mark.

## Constraints

Standard web controls only: real checkboxes, buttons, selects and tabs. 44px touch targets. Visible focus. No eyebrow labels, no hero-metric tiles, no card grids.
