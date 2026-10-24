---
title: Using Claude Code Skills Efficiently: Less Context, More Leverage
date: 2026-10-24
summary: Skills turn repeated prompts into reusable, on-demand playbooks. Here's how they load, how to write descriptions that trigger reliably, and how to keep them cheap on context.
tags: Claude Code, AI Agents, Skills, Developer Productivity
category: tech
cover: /blog/claude-skills.svg
coverAlt: Illustration of a .claude/skills folder with a SKILL.md file
---

If you find yourself pasting the same checklist into Claude Code again and again, such as "review this PR against our standards" or "deploy using these steps", that's a sign it should be a **skill**. Skills are one of the simplest ways to make an AI coding agent consistent, but using them *efficiently* takes a bit of thought.

## What a skill actually is

A skill is a folder with a `SKILL.md` file: YAML front matter followed by Markdown instructions.

```
.claude/skills/review-pr/
├── SKILL.md          # overview + instructions (required)
├── checklist.md      # detailed reference, loaded only when needed
└── scripts/
    └── lint.sh       # executed, not loaded into context
```

```yaml
---
name: review-pr
description: Reviews a pull request against team standards. Use when the user asks to review a PR, check a diff, or prepare review comments.
---

1. Read the diff.
2. Check it against checklist.md.
3. Report issues as file:line with a one-line fix.
```

Put skills in `~/.claude/skills/` to use them in every project, or in `.claude/skills/` inside a repo to share them with your team through git.

## How skills load: progressive disclosure

This is the key to using skills efficiently:

1. **At the start of every session, only the `description` is loaded.** Claude sees a short list of what's available.
2. **The full `SKILL.md` body loads only when the skill is used.** Claude can match your request to the description, or you can call it directly with `/review-pr`.
3. **Supporting files load only if the instructions point to them and Claude needs them.** Scripts are *run*, not read, so their source code never enters the context.

So a skill costs almost nothing until you need it. A long `CLAUDE.md`, by contrast, is loaded into every session whether it's relevant or not.

## Five habits for efficient skills

### 1. Write the description for triggering

The description decides whether the skill ever gets used. Put the main use case first and include the phrases people actually type:

> *"Reviews a pull request against team standards. Use when the user asks to review a PR, check a diff, or prepare review comments."*

A vague description like "Helps with code" either never triggers or triggers all the time.

### 2. Keep `SKILL.md` short and direct

Once a skill is loaded, every line costs tokens on every turn after that. Tell Claude *what to do* instead of explaining the background. Keep `SKILL.md` under roughly 500 lines and move long reference material into separate files that it links to.

### 3. Push heavy lifting into scripts

If a step is deterministic, like linting, formatting or querying, put it in a script. Running `scripts/lint.sh` costs only its output, while reading a long procedure costs the whole text.

### 4. Inject live context instead of describing it

A skill can run a shell command before Claude sees it and include the output:

```markdown
## Current changes
!`git diff HEAD`
```

Claude then works from the real diff rather than having to go and fetch it.

### 5. Control who can trigger what

For skills with side effects, like deploying, committing or sending messages, set `disable-model-invocation: true` so they only run when *you* type the slash command. For background knowledge that shouldn't show up in the `/` menu, use `user-invocable: false`.

## Test like you would test code

- Try the skill in a **fresh session**. Context left over from writing it can hide gaps in the instructions.
- Compare results **with and without** the skill on the same task.
- Remove skills nobody uses. Every description in the list adds a small cost to every session.

## The takeaway

Skills work best when they're **cheap to keep around and specific when used**: a sharp description, a short body and scripts for the mechanical work. Repeated prompting turns into a reusable, version-controlled playbook that the whole team shares.

*Reference: [Claude Code docs: Skills](https://code.claude.com/docs/en/skills)*
