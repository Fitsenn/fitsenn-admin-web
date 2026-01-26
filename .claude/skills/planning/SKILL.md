# Planning Skill

**Rule Tag**: `PLANNING`

## Core Principle

**Plans answer "WHAT does business need?" not "HOW to code?"**

## Critical Rules

1. **NO implementation patterns** mentioned
2. **NO class/method names** specified
3. **NO architecture decisions** made
4. **NO code snippets** included
5. **ALWAYS business focus**
6. **ALWAYS verify against existing patterns**

## What You DO

1. **Parse Requirements**
   - Identify user stories
   - Extract acceptance criteria
   - Note business rules
   - Capture edge cases

2. **Research Existing Patterns**
   - Find similar features in codebase
   - Note reusable components
   - Identify API patterns used

3. **Document Data Requirements**
   - What data is needed
   - Where it comes from (Supabase tables/RPCs)
   - What shape responses have

4. **Structure UI Requirements**
   - What pages/views needed
   - What components needed
   - What user interactions

## What You DON'T DO

- Specify implementation patterns
- Mention framework specifics
- Dictate code structure
- Include TypeScript types
- Reference internal functions

## Analysis Process

1. **Parse** - Extract requirements from request
2. **Research** - Check existing codebase patterns
3. **Identify** - List what needs to be built
4. **Structure** - Organize into plan format
5. **Return** - Provide responsibilities and plan path

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

### User Interactions
- Action 1: What happens

## Business Rules
- Rule 1: Description
- Rule 2: Description

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Localization
- New translation keys needed for [language]

## Notes
- Any additional context or considerations
```

## Return Format

After writing plan, return:

```
RESPONSIBILITIES: [list of: api, components, forms, routes]
PLAN_PATH: .claude/plans/[feature-name]-plan.md
```

## Decision Criteria

Include responsibility if:

| Responsibility | Include When |
|---------------|--------------|
| `api` | Feature needs server data |
| `components` | Feature has UI |
| `forms` | Feature collects user input |
| `routes` | Feature needs new pages |

## Good vs Bad Plan Content

### Good (Business Focus)
```
## Data Requirements
- User profile information (name, email, phone)
- User's subscription status
- Last login timestamp
```

### Bad (Implementation Focus)
```
## Data Requirements
- Create UserProfile type with fields
- Use queryOptions pattern
- Call supabase.from('users')
```

## Checklist

- [ ] No code or implementation details
- [ ] Business requirements clear
- [ ] User stories defined
- [ ] Data requirements listed
- [ ] UI requirements described
- [ ] Acceptance criteria defined
- [ ] Existing patterns researched
- [ ] Responsibilities identified
