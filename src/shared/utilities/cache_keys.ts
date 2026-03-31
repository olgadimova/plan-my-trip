export const CacheKeys = {
  destinations: (userId: string) => `destinations:${userId}`,
  activities: (destinationId: string, userId: string) =>
    `activities:${userId}:${destinationId}`,
};
