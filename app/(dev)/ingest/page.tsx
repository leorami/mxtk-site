export default function DevIngestPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_AI_DEV !== '1') {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Dev Ingest Disabled
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Set <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">NEXT_PUBLIC_ENABLE_AI_DEV=1</code> to enable the AI development panel.
        </p>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6 prose dark:prose-invert">
      <h1>AI Ingest (Dev)</h1>
      
      <p>
        This is the development ingestion panel for the MXTK AI system. 
        Use the CLI or API endpoints to manage knowledge ingestion.
      </p>

      <h2>Available Commands</h2>
      
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
{`# Ingest from file
npm run ai:ingest ./docs/whitepaper.md

# Ingest text directly  
npm run ai:ingest --text "content" --source "source-name"

# Check status
curl /api/ai/ingest/status

# Chat endpoint
curl -X POST /api/ai/chat \\
  -H "Content-Type: application/json" \\
  -d '{"message":"What are validator incentives?","mode":"learn"}'`}
      </pre>

      <h2>Current Status</h2>
      
      <p>
        Status endpoint: <code>/api/ai/ingest/status</code>
      </p>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800">
        <p><strong>Note:</strong> This page is only visible when <code>NEXT_PUBLIC_ENABLE_AI_DEV=1</code> is set.</p>
      </div>
    </main>
  );
}
