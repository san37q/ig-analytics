export interface SnapshotData {
  username: string;
  followers: string[];
  following: string[];
  timestamp?: number;
}

export interface ComparisonResult {
  newFollowers: string[];
  lostFollowers: string[];
  newFollowing: string[];
  unfollowed: string[];
  stats: {
    totalNewFollowers: number;
    totalLostFollowers: number;
    totalNewFollowing: number;
    totalUnfollowed: number;
    netFollowerChange: number;
  };
}
