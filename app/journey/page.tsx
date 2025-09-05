import JourneyBootstrap from '@/components/ai/JourneyBootstrap';

export default function JourneyPage() {
  // SSR-safe shell that delegates to a client component for bootstrap/navigation.
  return <JourneyBootstrap />;
}
