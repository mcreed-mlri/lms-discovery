# Architecture Decision Records

Short notes on decisions that are **not** obvious from reading the code, and that
someone would otherwise be tempted to "fix".

Most of these already existed as comments next to the code they explain. That is
the right place for them, but comments die with the file they live in, and they
are invisible to anyone deciding whether to take a piece of work on. These
records exist so the reasoning survives a refactor and can be read without a
checkout.

## Format

One file per decision, `NNNN-kebab-title.md`, with: **Status**, **Context**,
**Decision**, **Consequences**. Keep them short. If a decision is reversed, add a
new record and set the old one's status to `Superseded by NNNN` rather than
editing history.

## Index

| #                                            | Decision                                             | Status   |
| -------------------------------------------- | ---------------------------------------------------- | -------- |
| [0001](0001-brightspace-system-of-record.md) | Brightspace stays the system of record               | Accepted |
| [0002](0002-stateless-signed-sessions.md)    | Sessions are stateless signed cookies, not revocable | Accepted |
| [0003](0003-two-session-verifiers.md)        | Two session verifiers, kept honest by a parity test  | Accepted |
| [0004](0004-auth-gate-fails-open.md)         | The proxy auth gate fails open without a secret      | Accepted |
| [0005](0005-faculty-bypasses-item-gating.md) | Faculty bypasses per-item access gating              | Accepted |
| [0006](0006-learn-pages-are-public.md)       | Learning detail pages are public                     | Accepted |
| [0007](0007-demo-personas-are-opt-in.md)     | Demo personas are opt-in and override real sessions  | Accepted |
| [0008](0008-locked-contrast-tokens.md)       | Colour tokens carry measured contrast and are locked | Accepted |
| [0009](0009-set-state-in-effect-disabled.md) | react-hooks/set-state-in-effect is disabled          | Accepted |
| [0010](0010-lf-line-endings.md)              | Line endings are normalized to LF                    | Accepted |
| [0011](0011-coverage-is-a-ratchet.md)        | Coverage thresholds are a ratchet, not a target      | Accepted |
