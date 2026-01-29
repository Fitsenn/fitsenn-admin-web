---
name: planning-features
description: Creates implementation plans focused on business requirements. Use when starting new features, analyzing requirements, or creating development roadmaps. Triggers on requests for planning, feature analysis, or requirement breakdown.
---

# Planning Features

## Core Principle

**Plans answer "WHAT does business need?" not "HOW to code?"**

## Plan File Format

Write to: `.claude/plans/[feature-name]-plan.md`

```markdown
# [Feature Name] Implementation Plan

## Business Requirements
- Requirement 1
- Requirement 2

## User Stories
- As a [user], I want to [action] so that [benefit]

## Data Requirements

### Data Sources
- Table/RPC: Description of what data

### Data Shape
- Field 1: Description
- Field 2: Description

## UI Requirements

### Pages
- PageName: What user sees, what actions available

### Components
- ComponentName: Purpose and behavior

## Business Rules
- Rule 1: Description

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Localization
- Translation keys needed

## Notes
- Additional context
```

## Analysis Process

1. **Parse** - Extract requirements from request
2. **Research** - Check existing codebase patterns
3. **Identify** - List what needs to be built
4. **Structure** - Organize into plan format
5. **Return** - Provide responsibilities and plan path

## Return Format

```
RESPONSIBILITIES: [api, components, forms, routes]
PLAN_PATH: .claude/plans/[feature-name]-plan.md
```

## What You DO

- Parse user stories and acceptance criteria
- Research existing patterns in codebase
- Document data and UI requirements
- Structure deliverables list

## What You DON'T DO

- Specify implementation patterns
- Mention framework internals
- Include code snippets
- Reference internal functions

## Decision Criteria

| Responsibility | Include When |
|---------------|--------------|
| `api` | Feature needs server data |
| `components` | Feature has UI |
| `forms` | Feature collects user input |
| `routes` | Feature needs new pages |
