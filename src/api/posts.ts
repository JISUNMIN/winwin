import { requestJson } from '@/api/http';
import type {
  Matching,
  MatchingCategory,
  MatchingCoordinates,
  MatchingPostDraft,
  MatchingPostStatus,
} from '@/data/matchings';

export type PostApiCategory = 'HAIR' | 'NAIL' | 'EYELASH' | 'FOOD' | 'ACCOMMODATION';
export type PostApiStatus = 'OPEN' | 'CLOSED';
export type PostApiLocationVisibility = 'SUMMARY_ONLY' | 'EXACT_PUBLIC';

export type CreatePostPayload = {
  category: PostApiCategory;
  shopName: string;
  location: string;
  locationLatitude: number;
  locationLongitude: number;
  locationDetail?: string;
  locationDetailLatitude?: number;
  locationDetailLongitude?: number;
  locationVisibility: PostApiLocationVisibility;
  service: string;
  requirements: string[];
  availableDates: string[];
  deposit: number;
  description?: string;
};

export type PostResponse = {
  id: number;
  category: PostApiCategory;
  shopName: string;
  location: string;
  locationLatitude: number;
  locationLongitude: number;
  locationDetail: string | null;
  locationDetailLatitude: number | null;
  locationDetailLongitude: number | null;
  locationVisibility: PostApiLocationVisibility;
  service: string;
  requirements: string[];
  availableDates: string[];
  deposit: number;
  description: string | null;
  status: PostApiStatus;
  ownerId: number;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
};

export function getDiscoverablePosts() {
  return requestJson<PostResponse[]>('/api/posts', {
    method: 'GET',
  });
}

export function getPartnerPosts(accessToken: string) {
  return requestJson<PostResponse[]>('/api/partner/posts', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    unauthorizedBehavior: 'notify',
  } as RequestInit & { unauthorizedBehavior: 'notify' });
}

export function createPartnerPost(accessToken: string, payload: CreatePostPayload) {
  return requestJson<PostResponse>('/api/partner/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
    unauthorizedBehavior: 'notify',
  } as RequestInit & { unauthorizedBehavior: 'notify' });
}

export function updatePartnerPostStatus(
  accessToken: string,
  postId: number,
  status: PostApiStatus,
) {
  return requestJson<PostResponse>(`/api/partner/posts/${postId}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ status }),
    unauthorizedBehavior: 'notify',
  } as RequestInit & { unauthorizedBehavior: 'notify' });
}

export function getPartnerPost(accessToken: string, postId: number) {
  return requestJson<PostResponse>(`/api/partner/posts/${postId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    unauthorizedBehavior: 'notify',
  } as RequestInit & { unauthorizedBehavior: 'notify' });
}

export function updatePartnerPost(
  accessToken: string,
  postId: number,
  payload: CreatePostPayload,
) {
  return requestJson<PostResponse>(`/api/partner/posts/${postId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
    unauthorizedBehavior: 'notify',
  } as RequestInit & { unauthorizedBehavior: 'notify' });
}

export function mapCategoryToApi(category: MatchingCategory): PostApiCategory {
  switch (category) {
    case 'hair':
      return 'HAIR';
    case 'nail':
      return 'NAIL';
    case 'eyelash':
      return 'EYELASH';
    case 'food':
      return 'FOOD';
    case 'accommodation':
      return 'ACCOMMODATION';
  }
}

export function mapApiCategoryToMatching(category: PostApiCategory): MatchingCategory {
  switch (category) {
    case 'HAIR':
      return 'hair';
    case 'NAIL':
      return 'nail';
    case 'EYELASH':
      return 'eyelash';
    case 'FOOD':
      return 'food';
    case 'ACCOMMODATION':
      return 'accommodation';
  }
}

export function mapPostDraftToCreatePayload(draft: MatchingPostDraft): CreatePostPayload {
  return {
    category: mapCategoryToApi(draft.category),
    shopName: draft.shopName,
    location: draft.location,
    locationLatitude: draft.locationCoordinates.latitude,
    locationLongitude: draft.locationCoordinates.longitude,
    locationDetail: draft.locationDetail,
    locationDetailLatitude: draft.locationDetailCoordinates.latitude,
    locationDetailLongitude: draft.locationDetailCoordinates.longitude,
    locationVisibility:
      draft.locationVisibility === 'summary-only' ? 'SUMMARY_ONLY' : 'EXACT_PUBLIC',
    service: draft.service,
    requirements: draft.requirements,
    availableDates: draft.availableDates,
    deposit: draft.deposit,
    description: draft.description,
  };
}

function toCoordinates(latitude: number, longitude: number): MatchingCoordinates {
  return { latitude, longitude };
}

export function mapPostResponseToMatching(post: PostResponse): Matching {
  return {
    id: String(post.id),
    category: mapApiCategoryToMatching(post.category),
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600',
    shopName: post.shopName,
    location: post.location,
    locationCoordinates: toCoordinates(post.locationLatitude, post.locationLongitude),
    locationDetail: post.locationDetail ?? undefined,
    locationDetailCoordinates:
      post.locationDetailLatitude !== null && post.locationDetailLongitude !== null
        ? toCoordinates(post.locationDetailLatitude, post.locationDetailLongitude)
        : undefined,
    locationVisibility:
      post.locationVisibility === 'SUMMARY_ONLY' ? 'summary-only' : 'exact-public',
    service: post.service,
    requirements: post.requirements,
    deadline: post.availableDates[0] ?? new Date().toISOString().slice(0, 10),
    availableDates: post.availableDates,
    description: post.description ?? undefined,
    deposit: post.deposit,
    postStatus: post.status === 'OPEN' ? 'open' : 'closed',
  };
}

export function mapPostStatusToApi(status: MatchingPostStatus): PostApiStatus {
  return status === 'open' ? 'OPEN' : 'CLOSED';
}
