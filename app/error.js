"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    // Log the error for debugging
    console.error("Error occurred:", error);

    // Attempt to reset first
    reset();

    // Force redirect to the current page after a short delay
    const timeout = setTimeout(() => {
      router.refresh();
      router.push(window.location.pathname);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [error, reset, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-4">Something went wrong!</h1>
        <p>Redirecting you back...</p>
      </div>
    </div>
  );
}
