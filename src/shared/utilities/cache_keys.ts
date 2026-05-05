export const CacheKeys = {
  destinations: (userId: string) => `destinations:${userId}:version`,
  destinationsByVersion: ({ userId, version, page, perPage }) =>
    `destinations:${userId}:v${version}:page:${page}:per_page:${perPage}`,
  activities: ({
    destinationId,
    userId,
  }: {
    destinationId: string;
    userId: string;
  }) => `activities:${userId}:${destinationId}:version`,
  activitiesByVersion: ({ userId, destinationId, version, page, perPage }) =>
    `activities:${userId}:${destinationId}:v${version}:page:${page}:per_page:${perPage}`,
};
