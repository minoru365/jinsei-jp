<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles: template placeholders -> project-specific mobile app governance
- Added sections: Product Constraints, Delivery Workflow
- Removed sections: none
- Templates requiring updates: ✅ none required for initial adoption
- Follow-up TODOs: add repo-specific plan references after the first /speckit.plan run
-->

# 人生.jp Constitution

## Core Principles

### I. Calendar Accuracy First
All feature work MUST preserve the correctness of Japanese life-event calculations, era labels, and age-based rules before pursuing UI polish or expansion scope. Any change affecting event generation, calendar logic, or fortune derivation MUST define expected behavior, edge cases, and validation examples before implementation.

### II. Privacy by Default
Personal data in this app is limited but sensitive. Birth dates, names, and related profile data MUST stay on-device unless a future specification explicitly introduces a networked feature and documents consent, retention, and deletion behavior. New features MUST avoid unnecessary data collection and MUST not send personal data to third-party services by default.

### III. Expo-Compatible Simplicity
The codebase MUST remain straightforward to run and maintain inside the existing Expo and React Native stack. New dependencies, abstractions, and architectural layers SHOULD be added only when they reduce clear ongoing cost or unlock product value that the current structure cannot support. Prefer extending existing utilities and screens over introducing new frameworks or generic indirection.

### IV. Verifiable Changes
Every meaningful change MUST include the smallest validation that can prove it works for the touched slice. At minimum this means TypeScript or lint validation when available, plus targeted manual verification for user-visible mobile flows. Changes that affect date logic, storage, or event rendering MUST include a concrete check scenario that another developer can reproduce.

### V. Incremental Spec-Driven Delivery
Spec Kit is used to clarify medium and large changes before implementation, not to add ceremony to trivial edits. New work that changes product behavior, data shape, privacy posture, release flow, or multi-screen UX SHOULD go through specification, planning, and task breakdown first. Small copy edits and low-risk fixes MAY skip the full workflow if scope and validation remain obvious.

## Product Constraints

- Primary target remains the existing Expo mobile app with iOS validation as the default release path.
- Local storage via AsyncStorage is the current persistence model and MUST remain the default unless a future spec replaces it deliberately.
- User-facing behavior SHOULD stay Japanese-first in terminology, event interpretation, and calendar presentation.
- App Store and EAS-related changes MUST document required assets, secrets handling, and release steps before implementation begins.

## Delivery Workflow

- Use /speckit.constitution to amend governance when project rules materially change.
- Use /speckit.specify before implementing new features that are larger than a narrow local fix.
- Use /speckit.plan to lock technical approach, affected files, constraints, and validation strategy.
- Use /speckit.tasks for work that benefits from staged execution or handoff clarity.
- Before merge or release, confirm impacted flows on device or simulator and record any checks that could not be run.

## Governance

This constitution overrides ad hoc spec decisions when they conflict. Amendments require updating this file in the same change that introduces the new rule. Versioning follows semantic intent: MAJOR for incompatible governance changes, MINOR for new principles or materially stronger rules, PATCH for wording clarifications. All reviews SHOULD check privacy impact, event-calculation accuracy, and the presence of a concrete validation step.

**Version**: 1.0.0 | **Ratified**: 2026-05-09 | **Last Amended**: 2026-05-09
