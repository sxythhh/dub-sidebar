import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { AnalyticsPocView } from "@/components/views/analytics-poc/AnalyticsPocView";

export default function AnalyticsPocPage() {
  return (
    <ErrorBoundary>
      <AnalyticsPocView />
    </ErrorBoundary>
  );
}
