---
inclusion: always
---

# Git Workflow Standards

Always follow these git workflow standards for commit messages and co-author attribution.

## Commit Message Format

Use conventional commit format with proper co-author attribution and signoff:

```
<type>(<scope>): <description>

<body>

Co-authored-by: Kiro <kiro@kiro.dev>
```

**Newline Rules:**

- Only ONE empty line after the commit title
- Only ONE empty line before the Co-authored-by footer
- No additional empty lines within the body text
- **Dot points in body should NOT be separated by blank lines**
- **No blank lines within footer annotations** (Co-authored-by, Signed-off-by, etc.)

## Commit Command Requirements

**ALWAYS use the `--signoff` flag** when committing:

```bash
git commit --signoff -m "feat(component): add new feature

Co-authored-by: Kiro <kiro@kiro.dev>"
```

**Never use git aliases** to avoid potential conflicts with existing configurations.

## Commit Message Content Guidelines

- **Keep messages technical and code-focused** for code changes
- **Avoid non-technical details** unless the commit contains only documentation or non-code changes
- **Focus on what was implemented, fixed, or changed** from a technical perspective
- **Use precise technical language** describing the actual code modifications
- **Break down complex changes into multiple dot points** for clarity and readability
- **Prefer detailed dot points over long paragraph descriptions**

## Co-Author Attribution

**ALWAYS include Kiro as co-author** in every commit when AI assistance is used:

- **Name**: Kiro
- **Email**: kiro@kiro.dev
- **Format**: `Co-authored-by: Kiro <kiro@kiro.dev>`

## Commit Types

Use these conventional commit types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes

## Examples

### Feature Commit

```
feat(bookmarks): add tree view component

- Implement recursive BookmarkTreeRow component with Vue.js composition API
- Add folder expansion/collapse functionality with details/summary elements
- Create real-time synchronisation with Chrome bookmarks API events
- Integrate loading states and error handling for bookmark operations

Co-authored-by: Kiro <kiro@kiro.dev>
```

### Bug Fix Commit

```
fix(cleaning): resolve regex pattern validation

- Fix regex compilation error handling in CleaningRule component
- Add custom validity messages for invalid regex syntax
- Implement try-catch blocks around pattern compilation
- Improve user feedback with descriptive error messages

Co-authored-by: Kiro <kiro@kiro.dev>
```

### Documentation Commit

```
docs(specs): create comprehensive project specifications

- Add detailed requirements documents with EARS format acceptance criteria
- Create design documents with architecture and component specifications
- Implement task lists with actionable implementation steps
- Include British spelling standards and git workflow guidelines

Co-authored-by: Kiro <kiro@kiro.dev>
```

### Refactoring Commit

```
refactor(stores): optimise bookmark state management

- Improve performance of bookmark tree traversal algorithm
- Update reactive state management patterns with Pinia best practices
- Reduce memory usage in bookmark data structures
- Optimise Chrome API event listener efficiency

Co-authored-by: Kiro <kiro@kiro.dev>
```

### Multi-point Body Example

```
feat(components): implement bookmark management system

- Add BookmarkTreeRow component with recursive rendering
- Implement BookmarkDetails modal with form validation
- Create real-time synchronisation with Chrome bookmarks API
- Add error handling and loading states for all operations

Co-authored-by: Kiro <kiro@kiro.dev>
```

## Amending Existing Commits

When asked to add changes to an existing commit:

1. **Analyse existing changes first**: Review what was already committed using `git show` or `git log -p`
2. **Stage new changes**: Add the new modifications with `git add`
3. **Amend with comprehensive summary**: Create a new commit message that summarises ALL changes (existing + new)
4. **Always include signoff and co-author**: Maintain proper attribution

```bash
# Analyse existing commit
git show HEAD

# Stage new changes
git add .

# Amend with complete summary of all changes
git commit --amend --signoff -m "feat(component): implement feature with validation and error handling

- Add component implementation with TypeScript interfaces
- Implement input validation with custom error messages
- Create comprehensive error handling for API failures
- Add unit tests with full coverage for all functionality

Co-authored-by: Kiro <kiro@kiro.dev>"
```

## Multi-line Commit Messages

For detailed commits with body text (always include --signoff):

```bash
git commit --signoff -m "feat(rewrite): implement URL transformation engine

- Add regex pattern compilation for performance optimisation
- Implement URL validation and error handling
- Integrate Chrome bookmarks API for URL updates
- Create transformation pipeline with first-match logic

Co-authored-by: Kiro <kiro@kiro.dev>"
```

## Branch Naming

Use descriptive branch names with prefixes:

- `feature/bookmark-tree-view`
- `fix/cleaning-validation-error`
- `docs/api-documentation`
- `refactor/state-management`
- `chore/dependency-updates`

## Pull Request Guidelines

When creating pull requests:

1. Use conventional commit format in PR title
2. Include detailed description of changes
3. Reference related issues or specs
4. Ensure all commits include Kiro co-author attribution
5. Use British spelling throughout PR descriptions

## Commit Frequency

- Make atomic commits for logical changes
- Always include co-author attribution when AI assistance is used
- Write clear, descriptive commit messages
- Keep commits focused on single concerns
- When amending commits, analyse existing changes first and summarise all modifications

## Key Principles

- **No git aliases**: Use full git commands to avoid configuration conflicts
- **Analyse before amending**: Always review existing commit content before adding changes
- **Comprehensive summaries**: When amending, describe all changes (existing + new) in the commit message
- **Consistent attribution**: Always include signoff and Kiro co-author attribution

This ensures proper attribution of AI assistance whilst maintaining clean git history and following conventional commit
standards.
