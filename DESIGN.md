---
name: Compass
description: Daily progress against the objectives you set, laid out like a departure board.
colors:
  paper: "#ffffff"
  ink: "#111111"
  ink-hover: "#2b2b2b"
  muted: "#5f646b"
  rule: "#e6e8eb"
  field-stroke: "#c9cdd2"
  wash: "#f3f4f6"
  shell: "#111111"
  shell-muted: "#b4b8be"
  signal: "#d52b1e"
  go: "#1e7a46"
  planned: "#2f5fb8"
  plate-clay: "#9a4b40"
  plate-pine: "#2f6e4e"
  plate-navy: "#34558a"
  plate-ochre: "#7d6222"
  plate-teal: "#3f646b"
  plate-umber: "#6b5345"
  plate-olive: "#59612a"
  plate-plum: "#7a4a6b"
  plate-slate: "#4d5560"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 75"
    fontFeature: "'tnum'"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.2
  title-board:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 800
    lineHeight: 1.2
    fontVariation: "'wdth' 75"
    fontFeature: "'tnum'"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.45
  body-strong:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.45
  action:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.45
  figure:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 800
    lineHeight: 1.45
    fontVariation: "'wdth' 75"
    fontFeature: "'tnum'"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.35
  label-board:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.35
    fontVariation: "'wdth' 75"
    fontFeature: "'tnum'"
  plate:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 800
    lineHeight: 1
    fontVariation: "'wdth' 75"
rounded:
  plate: "3px"
  control: "4px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  section: "48px"
  touch: "44px"
  gutter: "16px"
  gutter-wide: "24px"
  measure: "960px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.wash}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-quiet-hover:
    backgroundColor: "{colors.wash}"
  icon-button:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    size: "44px"
  icon-button-hover:
    backgroundColor: "{colors.wash}"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
    height: "44px"
  tick:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.plate}"
    size: "22px"
  tick-checked:
    backgroundColor: "{colors.go}"
    textColor: "{colors.paper}"
  code-plate:
    textColor: "{colors.paper}"
    typography: "{typography.plate}"
    rounded: "{rounded.plate}"
    padding: "0 4px"
    height: "20px"
  code-plate-md:
    textColor: "{colors.paper}"
    typography: "{typography.figure}"
    rounded: "{rounded.plate}"
    padding: "0 6px"
    height: "28px"
  delay-figure:
    textColor: "{colors.signal}"
    typography: "{typography.title-board}"
  delay-figure-done:
    textColor: "{colors.muted}"
  view-tab:
    textColor: "{colors.muted}"
    typography: "{typography.body-strong}"
    height: "44px"
  view-tab-active:
    textColor: "{colors.ink}"
  shell-bar:
    backgroundColor: "{colors.shell}"
    textColor: "{colors.shell-muted}"
    typography: "{typography.label}"
    height: "64px"
  shell-bar-active:
    textColor: "{colors.paper}"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "44px"
  chip-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  progress-track:
    backgroundColor: "{colors.wash}"
    rounded: "{rounded.pill}"
    height: "6px"
  progress-fill:
    backgroundColor: "{colors.go}"
    rounded: "{rounded.pill}"
---

# Design System: Compass

## Overview

**Creative North Star: "The Departure Board"**

Compass treats the day as a timetable. Every to-do is a scheduled service on a white enamel board, printed in black ink, and slippage is a delay figure set in red in its own right-hand column, aligned down the board like late trains. The owner reads the board at the end of the day, mostly on a phone, ticks what ran and pushes what didn't. The system is built to make that reading instant and honest: what is due, what is late, and by how much.

The board is dense but calm. Rows are separated by hairline rules, never boxed. One variable grotesk carries everything; its condensed, heavy, tabular cut is the board's voice for anything read like a timetable (dates, counts, delays, codes, column heads), and its normal width carries the words. Colour is almost absent: black ink and white paper do the work, green means done, red means late, and the only other hues are the small line plates that code each category. A black shell bar frames the board, at the bottom under the thumb on phone and across the top on desktop.

The world deliberately refuses the to-do category default: a grey list with one blue accent, card stacks, and a floating plus button. It also refuses decoration that competes with the list; motion is limited to one moving part, the delay numeral rolling in when it changes.

**Key Characteristics:**
- White enamel ground, black ink, hairline rules; flat, ruled, no cards.
- Two widths of one face: normal for words, condensed heavy tabular for figures.
- Signal red reserved for lateness and errors; green for done.
- Category codes as small coloured line plates, like route badges.
- A fixed delay column on the right of every to-do row.
- A black shell bar: bottom tabs on phone, top bar on desktop.

## Colors

A near-monochrome board of ink on white, with two meaning-bearing signals (late red, done green) and a muted set of plate colours that identify categories.

### Primary
- **Timetable Ink** (`ink`): All primary text, the primary button fill, the 2px rule under the board head and section heads, the 1px rule under column heads, the active view tab underline, today's day number in Month view, focus outlines, and text selection.
- **Enamel White** (`paper`): The page ground, field fills, text on ink and on plates.

### Secondary
- **Signal Red** (`signal`): Delay figures ("+5 d"), the Overdue count, pushed counts in Month view, the "carried over" phrase in the progress summary, and form error messages. Nothing else. 5.0:1 on white.
- **Platform Green** (`go`): Done. The checked tick fill, the done check mark, progress bar fills, and the "completed" data series. 5.4:1 on white.

### Tertiary
- **Timetable Slate Blue** (`planned`): The "planned" data series in charts only, drawn dashed against the solid green "completed" line. Validated with the done green as a pair for lightness, chroma, colour-vision deficiency and contrast on white. It never appears in the interface chrome.
- **Line Plates** (`plate-clay`, `plate-pine`, `plate-navy`, `plate-ochre`, `plate-teal`, `plate-umber`, `plate-olive`, `plate-plum`, `plate-slate`): The nine colours a category can take. Defaults: Family clay, Health pine, Work navy, Personal ochre, Finance teal. They appear only as the fill of a code plate, with white condensed text on top. Each keeps between 5.8:1 and 7.5:1 against white.

### Neutral
- **Departure Grey** (`muted`): Secondary text: objective paths, meta lines, inactive tabs, column-head labels, chart axis ticks, the done-but-delayed figure. 6.0:1 on white.
- **Hairline** (`rule`): The 1px rule between rows, chart gridlines, chip and tooltip borders.
- **Field Stroke** (`field-stroke`): The 1px border of text fields and selects, a step darker than the hairline so fields read as inputs.
- **Wash** (`wash`): Hover fill on quiet buttons, icon buttons, rows and month cells; progress bar track.
- **Shell Black** (`shell`) and **Shell Grey** (`shell-muted`): The navigation shell bar and its inactive labels (9.5:1 on black). Active items go to white.
- **Ink Hover** (`ink-hover`): Primary button hover only.

### Named Rules
**The Signal Rule.** Red means late or wrong. It marks delay, overdue and errors, and is never used for a button, a heading, an icon or decoration.

**The Ink-Is-The-Accent Rule.** There is no brand hue. Primary actions are black ink on white; green speaks only for done, blue only for the planned series in a chart.

**The Plate Contrast Rule.** Plates carry white condensed text, so every plate colour keeps at least 4.5:1 against white. A new category colour that fails this does not join the set.

## Typography

**Display Font:** Archivo (variable, with the `wdth` axis), falling back to system-ui
**Body Font:** Archivo, normal width
**Label/Mono Font:** none; figures use Archivo condensed with tabular numerals instead of a mono face

**Character:** One grotesk at two widths. Normal width reads as plain, friendly text; the 75% condensed, extra-bold cut with tabular figures is the board's printed voice, tight and columnar like a station display.

### Hierarchy
- **Display** (800, 2.5rem, 1, condensed, tabular, tight tracking): The board head only: the date ("Mon 19.10"), page titles (Objectives, Progress), and the Compass name on the unlock screen.
- **Title** (700, 1.375rem, 1.2): Category section heads on Objectives, empty-state headings, and the progress summary sentence (set at regular weight).
- **Title Board** (800, 1.375rem, 1.2, condensed, tabular): Delay figures and week-day heads ("Tue 20.10").
- **Body** (400, 1rem, 1.45): Running text, field values, empty-state copy (capped at `max-width: 65ch`).
- **Body Strong** (600, 1rem): To-do titles, nav labels, view tabs.
- **Action** (700, 1rem): Buttons, section and group heads ("Overdue", "Carried over", "Cumulative").
- **Figure** (800, 1rem, condensed, tabular): Counts beside group heads, percentages, the "Next →" / "Today" push control, the "3 of 5 done" readout.
- **Label** (600, 0.8125rem, 1.35): Field labels, chips, meta lines, shell tab labels.
- **Label Board** (700, 0.8125rem, condensed, tabular): Column heads ("To-do · Delay"), weekday heads, axis ticks, table heads, small counts.
- **Plate** (800, 0.8125rem, 1, condensed): Category codes on plates.

### Named Rules
**The Two Widths Rule.** If it is read as a timetable entry (a date, a count, a delay, a code, a column head, a percentage), set it condensed (`font-stretch: 75%`), heavy, with tabular numerals. If it is read as words, set it at normal width. Never the other way round.

**The Three Sizes Rule.** Interface text uses three sizes (0.8125rem, 1rem, 1.375rem) plus the 2.5rem board display. Hierarchy comes from width and weight, not new sizes.

## Layout

A single centred column, `max-width: 960px`, with a 16px gutter on phone and 24px from 768px up. The phone layout reserves 112px at the bottom so the fixed shell tab bar (64px plus the safe-area inset) never covers the last row; desktop drops to 64px.

The board is a grid of rows. A Day-view row is three columns: a 44px tick cell, a flexible title cell (title over a plate-and-path meta line), and a right-hand status column. On phone the status column is 72px wide with the delay figure stacked above the push control; from 640px the delay (48px) and push control (72px) sit side by side as two board columns. A condensed column head ("To-do", "Delay") sits above the rows on a 1px ink rule and uses the same grid, so delays align down the whole board. Week view stacks days on phone and becomes a 160px day column beside its rows from 768px. Month view is a seven-column calendar of 80px (96px on desktop) cells separated by hairlines.

Spacing follows a 4px base: 4 / 8 / 12 px inside rows and controls, 16 and 24 px between blocks, 32 px between groups, 48 px between major sections on the Progress page. Every interactive target is at least 44px tall.

### Named Rules
**The Fixed Column Rule.** The delay figure always lives in its own right-aligned column, at the same x-position on every row of the board. Week and Month views reuse the same red mark.

## Elevation & Depth

The board is flat. Depth and grouping come from rules and the shell, not shadows: a 2px ink rule under the board head and under section heads, a 1px ink rule under column heads, a 1px hairline between rows, and the solid black shell bar as the frame. Hover states are flat wash fills.

### Shadow Vocabulary
- **Tooltip Lift** (`box-shadow: 0 4px 12px rgba(17,17,17,0.08)`): The chart tooltip only, the one surface that floats over content.

### Named Rules
**The Ruled Board Rule.** Rows are separated by rules, never wrapped in cards or lifted by shadows. If something needs grouping, give it a heading and a rule.

## Shapes

Tight, near-square corners. Plates, ticks and segmented toggles use 3px; buttons, fields, icon buttons and chips use 4px; chart bars round only their top corners at 4px. The single soft form is the progress bar, a 6px pill track (4px in Month cells) with a pill fill. Borders are structural: 1px for fields and chips, 2px ink for the secondary button and the tick.

## Components

### Buttons
Solid, square-shouldered and plainly labelled.
- **Shape:** Gently squared corners (4px), 44px tall, 16px horizontal padding, 8px gap to an 18px icon.
- **Primary:** Ink fill with white text ("Add", "Save", "Unlock", "New objective"). One per form or header.
- **Secondary:** White with a 2px ink border, ink text. Used for bulk board actions ("Move 2 unfinished to tomorrow", "Bring 1 to today"), full width on phone.
- **Quiet:** No fill or border; wash on hover. Cancel, Delete, Categories, Today.
- **Hover / Focus:** Colour-only transitions at 120ms ease-out; focus is a 2px ink outline at 2px offset (white outline on the shell bar).
- **Disabled:** 45% opacity, not-allowed cursor; pending actions also relabel ("Moving…", "Unlocking…").
- **Icon button:** 44px square, transparent, wash on hover; used for prev/next and Lock.

### Chips
- **Style:** 44px tall, 4px corners, 1px hairline border, label type, optional leading code plate.
- **State:** Active filter is solid ink with white text; inactive hovers to an ink border.

### Inputs / Fields
- **Style:** White fill, 1px field-stroke border, 4px corners, 44px min height, 10px by 12px padding, body text, grey placeholder. Selects drop the native arrow for a 16px ink chevron.
- **Focus:** Border and a 2px inset outline both go to ink.
- **Error:** A semibold signal-red message below, announced with `role="alert"`; the field carries `aria-invalid`.

### Navigation
- **Shell bar:** Solid black. Phone: a fixed three-tab bar at the bottom (64px tall, 20px icon over a label, grey inactive, white active with a heavier icon stroke) plus a slim 48px white brand line at the top. Desktop: a 56px top bar with the condensed Compass name, text tabs with a 2px white underline when active, and Lock on the right.
- **View tabs:** Day / Week / Month as text links on the board head's 2px ink rule; the active tab takes ink text and a 2px ink underline, the rest stay grey.

### Tick
The to-do checkbox is a real input drawn as a 22px square with a 2px ink border and 3px corners. Checked, it fills green and a white check mark scales in over 160ms on `cubic-bezier(0.16, 1, 0.3, 1)`. Done titles go grey with a line-through. In Day view the tick sits centred in a 44px cell.

### Code Plate (signature)
The category's two-to-four-letter code (FAM, HLT, WRK) in white condensed extra-bold on its category colour, like a route badge on a timetable. Small (20px tall, 36px min width) beside every to-do path and progress row; medium (28px tall, 44px min width) on category section heads. The full category name is available as a title and to screen readers.

### Delay Figure (signature)
"+N d" in condensed extra-bold signal red, the numeral at title size and the "d" at label size, in the board's fixed right column. A done item that was delayed keeps its figure in grey; a done, on-time item shows a green check instead. When the number changes, the numeral rolls down into place (280ms, `cubic-bezier(0.16, 1, 0.3, 1)`); it never animates on first paint, and reduced-motion users see no movement.

### Progress Bar
A 6px wash pill with a green fill, followed by the percentage in figure type and the done/total count in grey label-board type, both right-aligned in fixed widths so bars line up in lists.

### Charts
Line and bar charts on white with hairline gridlines, no vertical grid, grey condensed tabular axis ticks, and no entry animation. Completed is solid green, planned is dashed slate blue. Legends sit above the plot with their current totals; every chart has a "Show as table" disclosure.

## Do's and Don'ts

### Do:
- **Do** set every date, count, delay, code, percentage and column head in condensed (75%) extra-bold Archivo with tabular numerals.
- **Do** keep the delay figure in its fixed right-hand column on every to-do row, in signal red while the item is open.
- **Do** separate rows with 1px hairlines and groups with a heading over a 2px ink rule.
- **Do** show each to-do's category plate and objective path; the sub-objective stays visible when the objective title truncates.
- **Do** keep every interactive target at least 44px and every focus state a visible 2px ink outline.
- **Do** use real controls: native checkboxes, buttons, selects, links and tabs.
- **Do** give every chart a table alternative and an accessible summary label.

### Don't:
- **Don't** use signal red for anything but lateness, overdue counts and errors.
- **Don't** introduce a brand accent colour; primary actions are black ink.
- **Don't** wrap rows in cards, build card grids, or lift content with shadows; the tooltip is the only shadowed surface.
- **Don't** add a floating plus button; adding is the one-line field at the top of the board.
- **Don't** add eyebrow or kicker labels above headings, or hero-metric tiles; the progress page summarises in a sentence.
- **Don't** add text sizes beyond the three interface sizes and the board display.
- **Don't** set labels in tracked capitals; the only capitals are category codes on their plates.
- **Don't** add motion beyond the delay roll, the tick check and colour transitions, and don't animate chart entry.
