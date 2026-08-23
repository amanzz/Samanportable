# AGENTS.md

This repository's build process, hard rules and standing decisions live in
[`CLAUDE.md`](./CLAUDE.md) at the repo root. Read it in full before touching
any product page — it is the single source of truth for this project (it
says so explicitly in its own first paragraph) and supersedes any other
process document, ticket or memory file you find elsewhere in this repo.

`CLAUDE.md` was previously excluded from version control on this project
(kept as an untracked, machine-local file), which meant a fresh clone, a
new worktree, or a different tool had no way to see it. It is tracked
starting with the CO-09 build (22 Aug 2026) specifically so that any agent —
Claude Code, Codex, or anything else — working from a normal `git clone`
gets the same instructions. Keep it tracked; do not re-exclude it.

If you are Codex or another agent that defaults to reading `AGENTS.md` for
instructions and stops here: this file is intentionally just a pointer.
Open `CLAUDE.md` now — it has the actual rules, the current page state, and
the process this project runs on.

For CO-01 Shipping Container Office or any porta-cabins product-page template
work, also open [`claude/SAMAN_PORTA_CABINS_DESIGN_LOCK.md`](./claude/SAMAN_PORTA_CABINS_DESIGN_LOCK.md)
before editing. That file is the project-level Template Conformance Gate and
contains the CO-01 no-deviation checklist.
