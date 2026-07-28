# Git hooks

Version-controlled git hooks for this repo.

- **pre-commit** — blocks creating a commit whose author/committer email is not a
  GitHub noreply address (`*@users.noreply.github.com`), so a private email never
  leaks into commit metadata.
- **pre-push** — scans outgoing commits (from any tool, even `--no-verify`) and
  blocks the push if any carry a non-noreply email, before they leave your machine.

## Activation

Hooks in a tracked directory are not used until git is pointed at it. Run once per clone:

```sh
git config core.hooksPath .githooks
```

To bypass in an emergency: `git commit --no-verify` / `git push --no-verify`.
