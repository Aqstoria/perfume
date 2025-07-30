"use client";

import { useState } from "react";

export default function SeedPage() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    setResult("Seeding database...");

    try {
      const response = await fetch("/api/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(JSON.stringify(data, null, 2));
      } else {
        setResult(`Error: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      setResult(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Database Seed</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Click the button below to seed the database with initial data
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSeed}
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? "Seeding..." : "Seed Database"}
          </button>

          {result && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-96">
                {result}
              </pre>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>This will create:</p>
          <ul className="mt-2 text-left">
            <li>• Admin user: mkalleche@gmail.com / admin123</li>
            <li>• Buyer user: buyer (no password)</li>
            <li>• Default customer: Parfum Groothandel BV</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
