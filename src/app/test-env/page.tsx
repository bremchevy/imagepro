export default function TestEnvPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify({
          claidKey: process.env.NEXT_PUBLIC_CLAID_API_KEY,
          allEnv: process.env
        }, null, 2)}
      </pre>
    </div>
  );
} 