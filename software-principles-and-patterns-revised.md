# Software Principles and Patterns

## Purpose
- Apply architecture and design patterns that support maintainable, scalable, and professional codebases.
- Build with change in mind.
- Prefer practical patterns that reduce business risk.
- Use patterns to improve clarity, testability, and long-term flexibility.

## Core mindset
- DRY is a maintainability tool, not just a cleanliness preference.
- Single responsibility is a forcing function for clarity.
- Code should be easy to replace, extend, and test.
- Prefer boring reliability over cleverness.
- Solve today’s problem in a way that does not sabotage tomorrow.
- Design for the next likely requirement, not every possible future.

## DRY
- Avoid duplication in logic, configuration, presentation rules, and domain decisions.
- When the same rule appears in multiple places, centralize it.
- Deduplicate before complexity compounds.
- Prefer shared helpers over copied logic.
- Prefer configuration or mapping objects over repeated conditional logic.
- Keep shared abstractions small and obvious.
- Do not create a shared abstraction too early.
- Extract only when duplication is real, stable, and meaningful.

## Single Responsibility Principle
- Each function should do one clear job.
- Each component should have one primary reason to change.
- Each module should own a cohesive concern.
- Separate validation, transformation, orchestration, rendering, and side effects.
- Break up large routines into focused units.
- Avoid “monster” functions that validate, mutate, notify, and navigate all at once.
- Use composition to connect small focused units.

## Composition over inheritance
- Favor composition for flexibility and clarity.
- Build features by combining simple pieces.
- Avoid deep inheritance trees.
- Prefer wrapper components, hooks, helpers, and adapters over class hierarchy complexity.
- Keep behavior pluggable where extension is likely.

## Abstraction discipline
- Use abstraction to hide volatility and reduce coupling.
- Wrap third-party libraries when they are likely to spread across the codebase.
- Centralize external library usage behind utility functions or adapters when practical.
- Avoid leaking vendor-specific details into unrelated files.
- Prefer stable internal contracts.
- Keep abstractions thin and easy to understand.
- Do not abstract away straightforward code with no reuse value.

## Adapters and facades
- Use adapter layers for date, formatting, storage, analytics, and integration boundaries when appropriate.
- Isolate unstable or replaceable dependencies.
- Keep consumers dependent on internal interfaces, not direct vendor APIs.
- Prefer one good boundary over dozens of direct imports.
- Document the intended entry points.

## Encapsulation
- Keep domain rules near the domain.
- Keep UI concerns out of business rules.
- Keep formatting and data cleaning out of view components when they grow nontrivial.
- Expose the smallest useful API surface.
- Hide implementation details that should not be relied upon externally.

## Separation of concerns
- Distinguish domain logic from transport, persistence, rendering, and animation.
- Separate read models from write workflows when doing so increases clarity.
- Avoid mixing API shape concerns directly into UI layout code.
- Keep state transitions explicit.
- Keep side effects visible and intentional.

## Extensibility
- Design for likely change.
- Prefer strategy-style branching when multiple behaviors may grow over time.
- Use factories when object creation logic becomes repetitive or variant-driven.
- Use observers or event-driven patterns when multiple consumers need the same signal.
- Keep extension points small.
- Avoid speculative hooks that no real use case demands.

## Cohesion and coupling
- Maximize cohesion inside a module.
- Minimize coupling between modules.
- Group files by responsibility, not by habit.
- Avoid hidden dependencies.
- Prefer explicit imports and contracts.
- Avoid cross-layer reach-through.

## Domain modeling
- Use explicit names that reflect business meaning.
- Model states intentionally.
- Prefer domain language over vague technical placeholders.
- Keep illegal states hard to represent where practical.
- Use discriminated unions, enums, and constrained objects to represent variants.

## State and flow
- Keep data flow predictable.
- Prefer unidirectional flow.
- Make transitions explicit.
- Reduce shared mutable state.
- Keep ephemeral UI state local.
- Lift state only when needed.
- Normalize or structure complex state intentionally.

## Error handling
- Fail loudly at unsafe boundaries.
- Fail gracefully at user-facing boundaries.
- Separate developer diagnostics from user messaging.
- Use typed error results or predictable error contracts when possible.
- Avoid swallowing exceptions silently.
- Keep recovery paths intentional.

## Testability
- Structure logic so units can be tested independently.
- Minimize hidden side effects.
- Keep pure transformations pure.
- Isolate I/O.
- Prefer dependency injection when external behavior must be mocked.
- Use seams intentionally.
- Make it easy to test edge cases.

## Scalability
- Prefer modular organization.
- Keep code paths understandable as features grow.
- Choose patterns that support team maintenance, not solo brilliance.
- Design APIs and component contracts that can evolve without breaking everything.
- Keep growth costs localized.

## Documentation
- Document internal boundaries that matter.
- Document shared utilities and adapter layers.
- Provide usage examples for important abstractions.
- Keep architecture notes current enough to be useful.
- Document decisions that carry tradeoffs.

## AI-assisted development
- Do not let AI generate architecture by accident.
- State the desired pattern explicitly when prompting.
- Ask for focused outputs, not giant code dumps.
- Validate whether the generated code follows your architectural intent.
- Refine rules when repeated mistakes appear.

## Performance and risk
- Bad structure creates business risk.
- Duplication increases bug probability.
- Tight coupling increases refactor cost.
- Hidden dependencies slow onboarding.
- Overgrown modules make change unsafe.
- Good patterns reduce rework and improve team velocity.

## Anti-patterns to avoid
- Monster functions.
- God components.
- Repeated business rules in multiple files.
- Direct vendor calls everywhere.
- Vague module ownership.
- Over-abstraction with no real payoff.
- Premature generalization.
- Hidden side effects.
- Clever code that obscures intent.

## Definition of done
- The structure is easy to explain.
- The main concerns are separated.
- The code can evolve without fear.
- The patterns used are justified.
- The abstraction level matches the problem.
- The next engineer can follow the story.
## Extra review prompts
- Prefer the smallest sound solution.
- Prefer consistency over novelty.
- Prefer maintainability over short-term cleverness.
- Keep decisions easy to revisit later.
- Keep tradeoffs explicit when they matter.
- Optimize for a professional team handoff.
- Remove noise that does not improve the outcome.
- Keep rules actionable, not abstract.
- Review note 1: apply these rules with judgment and consistency.
- Review note 2: apply these rules with judgment and consistency.
- Review note 3: apply these rules with judgment and consistency.
- Review note 4: apply these rules with judgment and consistency.
- Review note 5: apply these rules with judgment and consistency.
- Review note 6: apply these rules with judgment and consistency.
- Review note 7: apply these rules with judgment and consistency.
- Review note 8: apply these rules with judgment and consistency.
- Review note 9: apply these rules with judgment and consistency.
- Review note 10: apply these rules with judgment and consistency.
- Review note 11: apply these rules with judgment and consistency.
- Review note 12: apply these rules with judgment and consistency.
- Review note 13: apply these rules with judgment and consistency.
- Review note 14: apply these rules with judgment and consistency.
- Review note 15: apply these rules with judgment and consistency.
- Review note 16: apply these rules with judgment and consistency.
- Review note 17: apply these rules with judgment and consistency.
