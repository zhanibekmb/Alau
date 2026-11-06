# Alau

## Project notes

- Approved design doc: `~/.gstack/projects/Alau/janib-unknown-design-20261104-183449.md`
- Test plan: `~/.gstack/projects/Alau/janib-unknown-eng-review-test-plan-20261104.md`
- Current state: reader MVP is written in `alau-scaffold/` (still to move into the project root). It has no database or accounts: progress and saved words live in the browser. Content is demo text with draft Kazakh glosses that need a native speaker's review. See `alau-scaffold/README.md`.
- The user runs setup steps such as git by hand to learn. Give one small step at a time, explain it in plain Russian, and do not run git init, commits, or setup commands unless asked.
- Figma copy file key: `QggGskIKqwjLLeSMYxl7Lk`. Landing and Mobile pages are empty, large nodes often time out, and the Starter plan has a low limit on Figma tool calls.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
