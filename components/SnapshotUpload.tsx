"use client";

import { useState, useRef } from "react";
import { saveSnapshot } from "@/lib/db";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";

interface Props {
  onSnapshotCreated: () => void;
}

export default function SnapshotUpload({ onSnapshotCreated }: Props) {
  const [username, setUsername] = useState("");
  const [followers, setFollowers] = useState("");
  const [following, setFollowing] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseUserList = (text: string): string[] => {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFollowers(content);
      setMessage({
        type: "success",
        text: `Loaded ${parseUserList(content).length} followers from file`,
      });
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!username.trim()) {
        throw new Error("Username is required");
      }

      const followersList = parseUserList(followers);
      const followingList = parseUserList(following);

      if (followersList.length === 0 || followingList.length === 0) {
        throw new Error("Both followers and following lists are required");
      }

      await saveSnapshot(username.trim(), followersList, followingList);

      setMessage({
        type: "success",
        text: `✨ Snapshot saved for @${username}! (${followersList.length} followers, ${followingList.length} following)`,
      });

      setTimeout(() => {
        setUsername("");
        setFollowers("");
        setFollowing("");
        onSnapshotCreated();
      }, 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to save snapshot",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">
          📸 New Snapshot
        </h2>
        <p className="text-gray-600 mb-6">
          Paste or upload your followers and following lists from your browser
          extension
        </p>

        {message && (
          <div
            className={`p-4 rounded-lg mb-6 flex items-start gap-3 ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            )}
            <p>{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Instagram Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., yourname"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Followers List (one per line)
            </label>
            <textarea
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              placeholder="username1&#10;username2&#10;username3..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 font-medium transition-colors"
            >
              <Upload className="w-4 h-4" />
              Or upload file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Following List (one per line)
            </label>
            <textarea
              value={following}
              onChange={(e) => setFollowing(e.target.value)}
              placeholder="username1&#10;username2&#10;username3..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {loading ? "Saving..." : "💾 Save Snapshot"}
          </button>
        </form>
      </div>
    </div>
  );
}
