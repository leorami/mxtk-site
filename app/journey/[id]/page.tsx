import JourneyView from '@/components/ai/JourneyView';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <JourneyView id={id} />;
}
