export const CacheKeys = {
  destinations: (userId: string) => `destinations:${userId}`,
  activities: (destinationId: string) => `activities:${destinationId}`,
};
