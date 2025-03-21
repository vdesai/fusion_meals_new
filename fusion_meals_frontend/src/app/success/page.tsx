"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      // Here you would typically verify the session with your backend
      // and update the user&apos;s subscription status
      setStatus("success");
    } else {
      setStatus("error");
    }
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t process your subscription. Please try again.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Return to Pricing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Thank you for subscribing!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your premium subscription has been activated. You now have access to all
            premium features.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            href="/recipes"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Start Creating Recipes
          </Link>
          <Link
            href="/meal-plans"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create a Meal Plan
          </Link>
        </div>
      </div>
    </div>
  );
} 