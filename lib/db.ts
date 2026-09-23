import Dexie, { type Table } from "dexie";

export interface Snapshot {
  id?: number;
  username: string;
  timestamp: number;
  followers: string[];
  following: string[];
}

export interface Comparison {
  id?: number;
  username: string;
  snapshotId1: number;
  snapshotId2: number;
  newFollowers: string[];
  lostFollowers: string[];
  newFollowing: string[];
  unfollowed: string[];
  timestamp: number;
}

export class IGTrackerDB extends Dexie {
  snapshots!: Table<Snapshot>;
  comparisons!: Table<Comparison>;

  constructor() {
    super("IGTrackerDB");
    this.version(1).stores({
      snapshots: "++id, username, timestamp",
      comparisons: "++id, username, timestamp",
    });
  }
}

export const db = new IGTrackerDB();

export const saveSnapshot = async (
  username: string,
  followers: string[],
  following: string[]
) => {
  return await db.snapshots.add({
    username,
    timestamp: Date.now(),
    followers,
    following,
  });
};

export const getSnapshots = async (username: string) => {
  return await db.snapshots.where("username").equals(username).toArray();
};

export const compareSnapshots = async (
  username: string,
  snapshotId1: number,
  snapshotId2: number
) => {
  const snap1 = await db.snapshots.get(snapshotId1);
  const snap2 = await db.snapshots.get(snapshotId2);

  if (!snap1 || !snap2) throw new Error("Snapshot not found");

  const followers1 = new Set(snap1.followers);
  const followers2 = new Set(snap2.followers);
  const following1 = new Set(snap1.following);
  const following2 = new Set(snap2.following);

  const newFollowers = Array.from(followers2).filter(
    (f) => !followers1.has(f)
  );
  const lostFollowers = Array.from(followers1).filter(
    (f) => !followers2.has(f)
  );
  const newFollowing = Array.from(following2).filter(
    (f) => !following1.has(f)
  );
  const unfollowed = Array.from(following1).filter((f) => !following2.has(f));

  const comparison = {
    username,
    snapshotId1,
    snapshotId2,
    newFollowers,
    lostFollowers,
    newFollowing,
    unfollowed,
    timestamp: Date.now(),
  };

  await db.comparisons.add(comparison);
  return comparison;
};

export const getComparisons = async (username: string) => {
  return await db.comparisons.where("username").equals(username).toArray();
};

export const deleteSnapshot = async (id: number) => {
  await db.snapshots.delete(id);
};
