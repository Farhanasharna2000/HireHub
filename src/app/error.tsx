"use client";

import React from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 text-red-800 p-6">
      <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h1>
      <p className="mb-6">{error.message}</p>
      <button
        onClick={() => reset()}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Try again
      </button>
    </div>
  );
}
