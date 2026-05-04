export const CacheKeys = {
  destinations: (userId: string) => `destinations:${userId}:version`,
  destinationsByVersion: ({ userId, version, page, perPage }) =>
    `destinations:${userId}:v${version}:page:${page}:per_page:${perPage}`,
  activities: (destinationId: string, userId: string) =>
    `activities:${userId}:${destinationId}`,
};
