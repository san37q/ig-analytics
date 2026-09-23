"use client";

import { useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import { db } from "@/lib/db";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    db.snapshots.count().then(() => setIsLoaded(true));
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading IG Tracker...</p>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}
