"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    // Log the error and its stack trace for debugging
    console.error("Error occurred:", error);
    if (error?.stack) {
      console.error("Stack trace:", error.stack);
    }

    // Force redirect to the current page after a short delay
    const timeout = setTimeout(() => {
      if (error) {
        window.location.reload();
      }
    }, 30 * 1000);

    return () => clearTimeout(timeout);
  }, [error, reset, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-4">OOPS! Something went wrong!</h1>
        <h2>We are sorry for the inconvenience.</h2>
        <h2>This page will automatically reload in 30 seconds.</h2>
        <h3>
          Please take a picture of this error code and send it to
          jeanyoon.choi@kaist.ac.kr
        </h3>
        <p>{error?.message || "An unexpected error has occurred."}</p>
        {error?.stack && (
          <pre className="text-left whitespace-pre-wrap mt-4 p-2 bg-gray-200 rounded">
            {error.stack}
          </pre>
        )}
      </div>
    </div>
  );
}
