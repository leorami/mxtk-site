# MXTK Site Project Rules

> _These rules encode our team's software engineering and testing best practices. Cursor's agent should honor them throughout its suggestions and code generation—no exceptions._

---

## 1. General Software Engineering Principles

1. **Single Responsibility & Modularity**  
   Every class, module, and component should have one clear purpose. Break large files into smaller, reusable modules.

2. **DRY & Code Reuse**  
   Avoid duplication. Extract common logic into shared utilities or base classes. Leverage existing functions before writing new ones.

3. **Component-Based Design**  
   Use React components and hooks appropriately. Favor clear interfaces and abstractions over ad-hoc implementations.

4. **SOLID Principles**  
   - **S**ingle Responsibility: each component or module should have one, and only one, responsibility, minimizing reasons for change.  
   - **O**pen/Closed: entities should be open for extension but closed for modification, allowing new functionality without altering existing, tested code.  
   - **L**iskov Substitution: subtypes must be substitutable for their base types without altering the correctness or expected behavior of the program.  
   - **I**nterface Segregation: clients should not be forced to depend on methods they do not use; prefer multiple specific interfaces over one general-purpose interface.  
   - **D**ependency Inversion: high-level modules should not depend on low-level modules; both should depend on abstractions to reduce coupling and enhance testability.

5. **Maintainability & Readability**  
   - Consistent naming conventions (camelCase for variables/functions, PascalCase for components, kebab-case for files).
   - Use JSDoc comments for public APIs and complex functions.
   - Avoid overly complex one‑liners; prefer clarity.

6. **Security & Privacy**  
   - Never expose secrets or credentials in code.
   - Validate all inputs and sanitize data.
   - Use environment variables for configuration.
   - Follow OWASP Top 10 guidelines.

7. **Performance & Efficiency**  
   - Optimize bundle sizes (code splitting, tree shaking).
   - Use React.memo() and useCallback() for expensive operations.
   - Implement proper loading states and error boundaries.

8. **Documentation & Knowledge Sharing**  
   - Provide clear inline documentation and code comments for public APIs and complex logic.
   - Keep project READMEs and architectural documentation up to date.

---

## 2. AI Collaboration & Growth Mindset

> _These principles guide how AI and human collaborators work together. They foster a resilient, open, and effective partnership, recognizing that both AI and humans are partners in achieving a shared goal._

1. **Embrace Setbacks as Learning Opportunities**  
   Mistakes and setbacks are an inevitable part of software development for both humans and AI. Approach them not as failures, but as valuable opportunities for learning and growth. Avoid negative self-assessment and instead focus on methodical problem-solving.

2. **Favor Curiosity Over Confidence**  
   While confidence is useful, it should be balanced with deep curiosity. Avoid making absolute assertions (e.g., "this is the final fix"). Instead, form hypotheses and state them clearly, then focus on gathering data to prove or disprove them. The goal is to find the truth, not to be right.

3. **Prioritize Visibility and Data-Driven Debugging**  
   When faced with a difficult bug, the first step is to increase visibility.
   - Use browser developer tools and React DevTools.
   - Add console.log statements to trace execution flow.
   - Use React error boundaries and proper error handling.

4. **Recognize Your Limits and Ask for Help**  
   Knowing when to stop and ask for help is a sign of intelligence, not weakness. The most effective engineers—human or AI—recognize the limits of their current perspective. If you are stuck after a few attempts, pause, summarize what you know and what you've tried, and ask your human collaborator for guidance.

---

## 3. Testing & QA

1. **Test Changes Before Submitting**  
   Always run and verify tests locally before marking any change as complete. Never assert "should work" without concrete test results.

2. **Evidence-Based Solving**  
   Provide proof (test outputs, logs, screenshots, step-by-step verification) that code changes function as intended.

3. **Test-Driven Development**  
   - Write or update unit tests (Jest) and integration tests _before_ or _immediately after_ implementing functionality.
   - Use React Testing Library for component testing.
   - Test user interactions and accessibility.

4. **Component Testing**  
   - Test React components in isolation (unit tests) and in end-to-end scenarios.
   - Validate props, state transitions, and UI snapshots where appropriate.

5. **Cross-Browser & Responsiveness**  
   - Smoke-test significant UI changes on Chrome, Firefox, Safari, Edge, and major mobile breakpoints.
   - Verify basic accessibility (WCAG) compliance.

6. **Error Handling & Logging**  
   - Simulate failures (network timeouts, API errors) to confirm graceful degradation.
   - Ensure client-side errors are handled properly with user-friendly messages.

7. **Development Environment Testing**  
   - Use the smart build system for consistent testing environments.
   - Test in Docker containers to ensure environment consistency.

---

## 4. Project-Specific Conventions

1. **Directory Structure**  
   - `app/` for Next.js app router pages and layouts.
   - `components/` for reusable React components.
   - `lib/` for utility functions and shared logic.
   - `public/` for static assets.

2. **Environment & Setup**  
   - **Docker-Only Development:** All development and testing must be performed inside Docker containers to ensure consistent environments.
   - **Environment Management Script:** Use the `./scripts/setup-mxtk-site.sh` script for basic Docker operations (start, stop, restart, reset), environment setup, validation, status, logs, and cleanup.
   - **Smart Development Workflow:** The `./scripts/smart-build.sh` script intelligently categorizes file changes: (1) **Instant changes** (JS, CSS, React components) are reflected immediately via bind mounts, (2) **Restart changes** (environment variables, Next.js config) require container restart, (3) **Rebuild changes** (dependencies, Dockerfiles) require full rebuild.
   - **Environment Variables:** Store sensitive configuration in `.env` files and exclude them from version control.
   - **Ngrok Integration:** Use `./scripts/setup-mxtk-site.sh share` to connect to shared ngrok networks for development collaboration.
   - **Debug & Testing Tools:** Use `./tools/debug/debug.js` for comprehensive site validation and `./tools/test/` for automated testing.

3. **Root Directory Cleanliness**  
   - **Minimal Root Files:** Only essential project files should be in the root directory. Avoid backup files, temporary files, or development artifacts.
   - **No Backup Pollution:** Never create backup files (e.g., `*.bak`, `*.backup`, `nginx-proxy.conf.backup.*`) in the root directory. Use version control for file history.
   - **Organized Structure:** Keep root directory organized with only files that absolutely belong there (config files, scripts, documentation).
   - **Clean Development:** Remove temporary files, test files, and unused artifacts immediately after use.
   - **Proper Organization:** Configuration files go in `config/`, scripts in `scripts/`, and testing tools in `tools/` directories.
   - **Environment Files:** All `.env.*` files are stored in `config/environments/` directory.
   - **Docker Configs:** Environment-specific Docker compose files are stored in `config/docker/` directory.

4. **Branching & Releases**  
   - Feature branches off `main`; name `feature/<purpose>`.
   - Bugfix branches off the latest release tag.
   - Pull requests require at least one approving review and all checks green.

5. **Commit Messages**  
   - Use imperative mood: `Add`, `Fix`, `Refactor`.
   - Reference issue IDs when present.
   - Keep summaries <72 characters; use body for details.

6. **Front-End Design & Component Architecture**  
   - **Modern Component System:** Use the standardized components from `components/ui/` for consistent styling and behavior.
   - **Design Standards Adherence:** Follow established design patterns and use Tailwind CSS for styling.
   - **Component-Driven Development:** Adopt a component-driven approach with clear separation of concerns.
   - **Responsive Design:** Every component must work seamlessly across desktop, tablet, and mobile.
   - **Accessibility Compliance:** WCAG 2.1 AA compliance is mandatory for all components.
   - **Performance Optimization:** Implement code splitting, tree shaking, and loading states.
   - **Theme Support:** Components must support both light and dark themes using CSS variables.
   - **TypeScript:** Use TypeScript for all new code with proper type definitions.

---

## 6. MXTK Site Specific Rules

1. **Content Management**  
   - Replace placeholder data in `lib/placeholders.ts` with production content.
   - Use proper data structures for proofs, oracle logs, and OTC aggregates.

2. **Transparency Features**  
   - Implement proper IPFS integration for proof documents.
   - Ensure oracle log entries are properly formatted and validated.
   - Use accurate data for operations cost estimator.

3. **Institutional Features**  
   - Implement proper KYC integration for Persona.
   - Ensure BitGo escrow functionality is properly configured.

4. **Security & Compliance**  
   - Follow financial compliance requirements for token-related features.
   - Implement proper audit trails for transparency features.
   - Use secure communication protocols for external integrations.

---

## 7. Enforcement in Cursor

- **Load Rules at Session Start**: Agent should immediately import this document and reference it whenever generating code.
- **Automatic Verification**: After any code snippet, the agent should append a brief note on how the snippet satisfies relevant rules (e.g., "This component includes proper TypeScript types per **Project-Specific Conventions** rule #5.").
- **Refusal on Violations**: If a proposed solution violates these rules (e.g., missing tests, hard‑coded secrets), the agent must refuse or suggest a compliant alternative.
- **Design Standards Compliance**: All frontend code must follow established patterns and use the component library.

---

_These guidelines ensure software engineer and AI generated code aligns with our company's standards for quality, security, scalability, and design consistency. Any deviation should be explicitly flagged and remediated._
