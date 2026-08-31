# Exportable Workspace Kit

This folder is a clean extraction boundary for the simulated workplace apps:
Mail, Drive, Calendar, Employee Portal, PDF Reader, and the Chrome-style browser shell.

It is intentionally separate from the learner simulator. Nothing here imports
progress, tracks, badges, auth, server actions, the Job Card, or the window manager.

## Copy Surface

Copy this folder into another React project:

```text
src/exportable-workspace/
```

Required runtime dependencies:

```bash
npm install lucide-react
```

The components use Tailwind-style utility classes. In a non-Tailwind project, either
bring Tailwind over or translate the class names into CSS.

## Basic Usage

```tsx
import {
  BrowserShell,
  defaultWorkspaceHost,
  type WorkspaceCompletion,
} from "./exportable-workspace";

export default function Demo() {
  const handleComplete = (event: WorkspaceCompletion) => {
    console.log(event);
  };

  return (
    <BrowserShell
      host={{
        ...defaultWorkspaceHost,
        userName: "Alex Chen",
        organizationName: "Harborside Cafe",
        onNudge: window.alert,
        onComplete: handleComplete,
      }}
    />
  );
}
```

## Adapter Contract

`WorkspaceHost` is the only required integration point:

- `lang`: `"en"` or `"es"`
- `userName`: displayed in app chrome
- `organizationName`: used by Portal and Calendar fixtures
- `onNudge`: optional callback for unavailable or corrective actions
- `onComplete`: optional callback for actions such as sending mail, sharing a file, opening an event, or reviewing a PDF

## Customization

Replace the fixture arrays in `fixtures.tsx` to re-theme the workspace:

- `mailMessages`
- `driveFiles`
- `calendarEvents`
- `portalSections`
- `pdfDocuments`
- `workspaceApps`

For deeper customization, pass your own `apps` array to `BrowserShell`.
