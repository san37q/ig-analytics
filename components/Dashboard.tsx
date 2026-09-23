"use client";

import { useState } from "react";
import SnapshotUpload from "./SnapshotUpload";
import SnapshotList from "./SnapshotList";
import ComparisonView from "./ComparisonView";
import Header from "./Header";

type View = "upload" | "snapshots" | "comparison";

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>("upload");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSnapshotCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setCurrentView("snapshots");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex gap-3 justify-center">
          <button
            onClick={() => setCurrentView("upload")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              currentView === "upload"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow"
            }`}
          >
            📸 New Snapshot
          </button>
          <button
            onClick={() => setCurrentView("snapshots")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              currentView === "snapshots"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow"
            }`}
          >
            📋 My Snapshots
          </button>
          <button
            onClick={() => setCurrentView("comparison")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              currentView === "comparison"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow"
            }`}
          >
            📊 Compare
          </button>
        </div>

        <div className="fade-in">
          {currentView === "upload" && (
            <SnapshotUpload onSnapshotCreated={handleSnapshotCreated} />
          )}
          {currentView === "snapshots" && (
            <SnapshotList refresh={refreshTrigger} />
          )}
          {currentView === "comparison" && (
            <ComparisonView refresh={refreshTrigger} />
          )}
        </div>
      </div>
    </div>
  );
}
