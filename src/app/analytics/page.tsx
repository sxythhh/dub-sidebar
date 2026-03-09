import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { AnalyticsPocView } from "@/components/views/analytics-poc/AnalyticsPocView";

export default function AnalyticsPage() {
  return (
    <ErrorBoundary>
      <AnalyticsPocView />
    </ErrorBoundary>
  );
}
