"use client";

import { useState, useEffect } from "react";
import { getSnapshots, compareSnapshots, Snapshot, Comparison } from "@/lib/db";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  refresh: number;
}

export default function ComparisonView({ refresh }: Props) {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [snap1Id, setSnap1Id] = useState("");
  const [snap2Id, setSnap2Id] = useState("");
  const [comparison, setComparison] = useState<Comparison | null>(null);
  const [loading, setLoading] = useState(false);

  const users = Array.from(new Set(snapshots.map((s) => s.username)));

  useEffect(() => {
    loadSnapshots();
  }, [refresh]);

  const loadSnapshots = async () => {
    if (selectedUser) {
      const data = await getSnapshots(selectedUser);
      setSnapshots(data.sort((a, b) => b.timestamp - a.timestamp));
    }
  };

  useEffect(() => {
    loadSnapshots();
  }, [selectedUser]);

  const handleCompare = async () => {
    if (!snap1Id || !snap2Id || snap1Id === snap2Id) {
      alert("Please select two different snapshots");
      return;
    }

    setLoading(true);
    try {
      const result = await compareSnapshots(
        selectedUser,
        parseInt(snap1Id),
        parseInt(snap2Id)
      );
      setComparison(result);
    } catch (error) {
      alert("Error comparing snapshots");
    } finally {
      setLoading(false);
    }
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
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data</h2>
        <p className="text-gray-600">
          You need at least 2 snapshots to compare data
        </p>
      </div>
    );
  }

  const chartData = [
    {
      name: "Followers",
      new: comparison?.newFollowers.length || 0,
      lost: comparison?.lostFollowers.length || 0,
    },
    {
      name: "Following",
      new: comparison?.newFollowing.length || 0,
      lost: comparison?.unfollowed.length || 0,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">📊 Compare Snapshots</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Account
            </label>
            <select
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                setSnap1Id("");
                setSnap2Id("");
                setComparison(null);
              }}
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

          {selectedUser && snapshots.length >= 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  From (Earlier)
                </label>
                <select
                  value={snap1Id}
                  onChange={(e) => setSnap1Id(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select snapshot...</option>
                  {snapshots.map((snap) => (
                    <option key={snap.id} value={snap.id || ""}>
                      {formatDate(snap.timestamp)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  To (Recent)
                </label>
                <select
                  value={snap2Id}
                  onChange={(e) => setSnap2Id(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select snapshot...</option>
                  {snapshots.map((snap) => (
                    <option key={snap.id} value={snap.id || ""}>
                      {formatDate(snap.timestamp)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {selectedUser && (
            <button
              onClick={handleCompare}
              disabled={loading || !snap1Id || !snap2Id}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {loading ? "Comparing..." : "🔍 Compare Snapshots"}
            </button>
          )}
        </div>
      </div>

      {comparison && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Comparison Results
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon="👥"
                label="New Followers"
                value={comparison.newFollowers.length}
                color="green"
              />
              <StatCard
                icon="❌"
                label="Lost Followers"
                value={comparison.lostFollowers.length}
                color="red"
              />
              <StatCard
                icon="➕"
                label="New Following"
                value={comparison.newFollowing.length}
                color="blue"
              />
              <StatCard
                icon="⬅️"
                label="Unfollowed"
                value={comparison.unfollowed.length}
                color="orange"
              />
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h4 className="font-semibold text-gray-800 mb-4">
                Change Overview
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="new" fill="#10b981" name="Added" />
                  <Bar dataKey="lost" fill="#ef4444" name="Lost" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserListCard
              title="👥 New Followers"
              users={comparison.newFollowers}
              color="green"
            />
            <UserListCard
              title="❌ Lost Followers"
              users={comparison.lostFollowers}
              color="red"
            />
            <UserListCard
              title="➕ New Following"
              users={comparison.newFollowing}
              color="blue"
            />
            <UserListCard
              title="⬅️ Unfollowed"
              users={comparison.unfollowed}
              color="orange"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses = {
    green: "bg-green-50 border-green-200",
    red: "bg-red-50 border-red-200",
    blue: "bg-blue-50 border-blue-200",
    orange: "bg-orange-50 border-orange-200",
  };

  return (
    <div
      className={`${colorClasses[color as keyof typeof colorClasses]} border rounded-lg p-4`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs text-gray-600">{label}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );
}

function UserListCard({
  title,
  users,
  color,
}: {
  title: string;
  users: string[];
  color: string;
}) {
  const colorClasses = {
    green: "bg-green-50 border-green-200",
    red: "bg-red-50 border-red-200",
    blue: "bg-blue-50 border-blue-200",
    orange: "bg-orange-50 border-orange-200",
  };

  return (
    <div
      className={`${colorClasses[color as keyof typeof colorClasses]} border rounded-2xl p-6`}
    >
      <h4 className="font-semibold text-gray-800 mb-4">
        {title}
        <span className="ml-2 text-sm font-normal text-gray-600">
          ({users.length})
        </span>
      </h4>
      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
        {users.length === 0 ? (
          <p className="text-gray-600 text-sm">No changes</p>
        ) : (
          users.map((user) => (
            <div
              key={user}
              className="text-sm text-gray-700 bg-white/50 px-3 py-2 rounded font-medium"
            >
              @{user}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
