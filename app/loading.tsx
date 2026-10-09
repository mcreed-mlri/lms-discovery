import { RouteStatePanel } from "@/components/route-state-panel";

export default function Loading() {
  return (
    <RouteStatePanel
      title="Preparing your library"
      description="Loading your courses, modules, and reading list."
      role="status"
    />
  );
}
