"use client";

import { useState } from "react";

export default function MigratePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const runMigration = async (action: "migrate" | "push" | "seed") => {
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ ${data.message}\n\nOutput:\n${data.output}`);
      } else {
        setResult(`❌ Error: ${data.error}\n\nDetails: ${data.details || "No details provided"}`);
      }
    } catch (error) {
      setResult(`❌ Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Migration Tool</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Available Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => runMigration("migrate")}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded"
            >
              {loading ? "Running..." : "Run Migrations"}
            </button>
            
            <button
              onClick={() => runMigration("push")}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded"
            >
              {loading ? "Running..." : "Push Schema"}
            </button>
            
            <button
              onClick={() => runMigration("seed")}
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded"
            >
              {loading ? "Running..." : "Seed Database"}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {result}
            </pre>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• <strong>Migrations:</strong> Applies pending migration files to the database</li>
            <li>• <strong>Push:</strong> Pushes the current schema directly to the database (may reset data)</li>
            <li>• <strong>Seed:</strong> Runs the database seeding script</li>
            <li>• These actions run on the Vercel serverless environment</li>
            <li>• Check the Vercel logs for detailed output</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 