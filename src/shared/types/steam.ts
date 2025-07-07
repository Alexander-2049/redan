export const enum UGCQueryType {
  RankedByVote = 0,
  RankedByPublicationDate = 1,
  AcceptedForGameRankedByAcceptanceDate = 2,
  RankedByTrend = 3,
  FavoritedByFriendsRankedByPublicationDate = 4,
  CreatedByFriendsRankedByPublicationDate = 5,
  RankedByNumTimesReported = 6,
  CreatedByFollowedUsersRankedByPublicationDate = 7,
  NotYetRated = 8,
  RankedByTotalVotesAsc = 9,
  RankedByVotesUp = 10,
  RankedByTextSearch = 11,
  RankedByTotalUniqueSubscriptions = 12,
  RankedByPlaytimeTrend = 13,
  RankedByTotalPlaytime = 14,
  RankedByAveragePlaytimeTrend = 15,
  RankedByLifetimeAveragePlaytime = 16,
  RankedByPlaytimeSessionsTrend = 17,
  RankedByLifetimePlaytimeSessions = 18,
  RankedByLastUpdatedDate = 19,
}
export const enum UGCType {
  Items = 0,
  ItemsMtx = 1,
  ItemsReadyToUse = 2,
  Collections = 3,
  Artwork = 4,
  Videos = 5,
  Screenshots = 6,
  AllGuides = 7,
  WebGuides = 8,
  IntegratedGuides = 9,
  UsableInGame = 10,
  ControllerBindings = 11,
  GameManagedItems = 12,
  All = 13,
}
export const enum UserListType {
  Published = 0,
  VotedOn = 1,
  VotedUp = 2,
  VotedDown = 3,
  Favorited = 4,
  Subscribed = 5,
  UsedOrPlayed = 6,
  Followed = 7,
}
export const enum UserListOrder {
  CreationOrderAsc = 0,
  CreationOrderDesc = 1,
  TitleAsc = 2,
  LastUpdatedDesc = 3,
  SubscriptionDateDesc = 4,
  VoteScoreDesc = 5,
  ForModeration = 6,
}
export interface WorkshopItemStatistic {
  numSubscriptions?: bigint;
  numFavorites?: bigint;
  numFollowers?: bigint;
  numUniqueSubscriptions?: bigint;
  numUniqueFavorites?: bigint;
  numUniqueFollowers?: bigint;
  numUniqueWebsiteViews?: bigint;
  reportScore?: bigint;
  numSecondsPlayed?: bigint;
  numPlaytimeSessions?: bigint;
  numComments?: bigint;
  numSecondsPlayedDuringTimePeriod?: bigint;
  numPlaytimeSessionsDuringTimePeriod?: bigint;
}
export interface WorkshopItem {
  publishedFileId: bigint;
  creatorAppId?: number;
  consumerAppId?: number;
  title: string;
  description: string;
  owner: PlayerSteamId;
  /** Time created in unix epoch seconds format */
  timeCreated: number;
  /** Time updated in unix epoch seconds format */
  timeUpdated: number;
  /** Time when the user added the published item to their list (not always applicable), provided in Unix epoch format (time since Jan 1st, 1970). */
  timeAddedToUserList: number;
  visibility: UgcItemVisibility;
  banned: boolean;
  acceptedForUse: boolean;
  tags: Array<string>;
  tagsTruncated: boolean;
  url: string;
  numUpvotes: number;
  numDownvotes: number;
  numChildren: number;
  previewUrl?: string;
  statistics: WorkshopItemStatistic;
}
export interface WorkshopPaginatedResult {
  items: Array<WorkshopItem | undefined | null>;
  returnedResults: number;
  totalResults: number;
  wasCached: boolean;
}
export interface WorkshopItemsResult {
  items: Array<WorkshopItem | undefined | null>;
  wasCached: boolean;
}
export interface WorkshopItemQueryConfig {
  cachedResponseMaxAge?: number;
  includeMetadata?: boolean;
  includeLongDescription?: boolean;
  includeAdditionalPreviews?: boolean;
  onlyIds?: boolean;
  onlyTotal?: boolean;
  language?: string;
  matchAnyTag?: boolean;
  requiredTags?: Array<string>;
  excludedTags?: Array<string>;
  searchText?: string;
  rankedByTrendDays?: number;
}
export interface AppIDs {
  creator?: number;
  consumer?: number;
}
export type UgcItemVisibility = 'Public' | 'FriendsOnly' | 'Private' | 'Unlisted';
export interface PlayerSteamId {
  steamId64: bigint;
  steamId32: string;
  accountId: number;
}
export interface DownloadInfo {
  current: bigint;
  total: bigint;
}
export interface InstallInfo {
  folder: string;
  sizeOnDisk: bigint;
  timestamp: number;
}
export interface UgcUpdate {
  title?: string;
  description?: string;
  changeNote?: string;
  previewPath?: string;
  contentPath?: string;
  tags?: Array<string>;
}
