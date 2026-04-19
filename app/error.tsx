'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-yellow-900 mb-2">
          Temporary Issue
        </h2>
        <p className="text-sm text-yellow-800 mb-4">
          We&apos;re having a temporary issue. Try refreshing the page or try again in a moment.
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
