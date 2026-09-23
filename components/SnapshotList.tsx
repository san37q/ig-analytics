"use client";

import { useState, useEffect } from "react";
import { getSnapshots, deleteSnapshot, Snapshot } from "@/lib/db";
import { Trash2, Calendar } from "lucide-react";

interface Props {
  refresh: number;
}

export default function SnapshotList({ refresh }: Props) {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const users = Array.from(new Set(snapshots.map((s) => s.username)));

  useEffect(() => {
    loadSnapshots();
  }, [refresh]);

  const loadSnapshots = async () => {
    try {
      if (selectedUser) {
        const data = await getSnapshots(selectedUser);
        setSnapshots(data.sort((a, b) => b.timestamp - a.timestamp));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSnapshots();
  }, [selectedUser]);

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    if (!confirm("Delete this snapshot?")) return;

    await deleteSnapshot(id);
    loadSnapshots();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (users.length === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Snapshots</h2>
        <p className="text-gray-600">
          Create your first snapshot to get started tracking follower changes!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">📋 My Snapshots</h2>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Account
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose an account...</option>
            {users.map((user) => (
              <option key={user} value={user}>
                @{user}
              </option>
            ))}
          </select>
        </div>

        {selectedUser && (
          <div className="space-y-3">
            {loading ? (
              <p className="text-gray-600 text-center py-8">Loading...</p>
            ) : snapshots.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No snapshots for this account
              </p>
            ) : (
              snapshots.map((snapshot) => (
                <div
                  key={snapshot.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-gray-800 font-semibold">
                      <Calendar className="w-4 h-4" />
                      {formatDate(snapshot.timestamp)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      👥 {snapshot.followers.length} followers • ↗️{" "}
                      {snapshot.following.length} following
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(snapshot.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete snapshot"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
