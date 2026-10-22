import api from '@/lib/axios';
import type { ApiResponse, FeedData } from '@/types';

export async function getFeed(
  page = 1,
  limit = 20
): Promise<ApiResponse<FeedData>> {
  const response = await api.get<ApiResponse<FeedData>>('/api/feed', {
    params: {
      page,
      limit,
    },
  });

  return response.data;
}
