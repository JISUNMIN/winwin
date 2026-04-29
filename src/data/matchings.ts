export type Category = 'all' | 'hair' | 'nail' | 'eyelash' | 'food' | 'accommodation';

export type MatchingCategory = Exclude<Category, 'all'>;

export interface MatchingCoordinates {
  latitude: number;
  longitude: number;
}

export type MatchingPostStatus = 'open' | 'closed';

export interface Matching {
  id: string;
  category: MatchingCategory;
  image: string;
  shopName: string;
  location: string;
  locationCoordinates?: MatchingCoordinates;
  locationDetail?: string;
  locationDetailCoordinates?: MatchingCoordinates;
  locationVisibility?: 'summary-only' | 'exact-public';
  service: string;
  requirements: string[];
  deadline: string;
  availableDates?: string[];
  premium?: boolean;
  description?: string;
  portfolio?: string[];
  deposit?: number;
  postStatus?: MatchingPostStatus;
}

export type MatchingPostDraft = {
  category: MatchingCategory;
  shopName: string;
  location: string;
  locationCoordinates: MatchingCoordinates;
  locationDetail?: string;
  locationDetailCoordinates: MatchingCoordinates;
  locationVisibility: 'summary-only' | 'exact-public';
  service: string;
  requirements: string[];
  availableDates: string[];
  deposit: number;
  description?: string;
};

export const categoryLabels: Record<MatchingCategory, string> = {
  hair: '헤어',
  nail: '네일',
  eyelash: '속눈썹',
  food: '음식/카페',
  accommodation: '숙박',
};

export function getCategoryLabel(category: MatchingCategory) {
  return categoryLabels[category];
}

function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getDaysUntil(dateString: string): string {
  const deadline = parseLocalDate(dateString);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return '오늘 마감';
  }

  if (diffDays === 1) {
    return '내일 마감';
  }

  if (diffDays < 0) {
    return '마감';
  }

  return `${diffDays}일 남음`;
}

export function formatKoreanDate(dateString: string) {
  return parseLocalDate(dateString).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

export const mockMatchings: Matching[] = [
  {
    id: '1',
    category: 'hair',
    image: 'https://images.unsplash.com/photo-1554519934-e32b1629d9ee?w=600',
    shopName: '블룸 헤어살롱',
    location: '강남구 역삼동',
    service: '발레야쥬 염색 + 컷',
    requirements: ['장발 (어깨 이하)', '탈색 가능', '리뷰 필수'],
    deadline: '2026-04-26',
    availableDates: ['2026-04-28', '2026-04-29', '2026-05-01', '2026-05-02'],
    premium: true,
    description: '발레야쥬 염색 전문 살롱입니다. 포트폴리오 촬영을 위한 모델을 모집합니다.',
    portfolio: [
      'https://images.unsplash.com/photo-1554519934-e32b1629d9ee?w=600',
      'https://images.unsplash.com/photo-1638064432604-8da1fc75de09?w=600',
    ],
    deposit: 5000,
  },
  {
    id: '2',
    category: 'nail',
    image: 'https://images.unsplash.com/photo-1754799670410-b282791342c3?w=600',
    shopName: '네일샵 러블리',
    location: '마포구 홍대입구',
    service: '젤네일 + 네일아트',
    requirements: ['손톱 길이 3mm 이상', 'SNS 인증 필수'],
    deadline: '2026-04-25',
    availableDates: ['2026-04-26', '2026-04-27'],
    description: '신규 오픈 네일샵입니다. SNS 홍보용 모델을 찾습니다.',
    portfolio: ['https://images.unsplash.com/photo-1754799670410-b282791342c3?w=600'],
    deposit: 3000,
  },
  {
    id: '3',
    category: 'eyelash',
    image: 'https://images.unsplash.com/photo-1674049406467-824ea37c7184?w=600',
    shopName: '아이래쉬 스튜디오',
    location: '송파구 잠실동',
    service: '속눈썹 연장 (볼륨 래쉬)',
    requirements: ['첫 시술 가능', '2시간 소요'],
    deadline: '2026-04-27',
    availableDates: ['2026-04-28', '2026-04-30', '2026-05-01'],
    premium: true,
    description: '볼륨 래쉬 전문 스튜디오입니다.',
    deposit: 5000,
  },
  {
    id: '4',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1653491948158-9044bcbb9c5a?w=600',
    shopName: '브런치 카페 모닝',
    location: '서초구 강남역',
    service: '브런치 세트 2인',
    requirements: ['인스타그램 포스팅', '해시태그 5개 이상'],
    deadline: '2026-04-24',
    availableDates: ['2026-04-26', '2026-04-27', '2026-04-28'],
    description: '신규 오픈 브런치 카페입니다.',
    deposit: 10000,
  },
  {
    id: '5',
    category: 'accommodation',
    image: 'https://images.unsplash.com/photo-1725962269029-e845b85e5ebf?w=600',
    shopName: '호텔 더 스카이',
    location: '중구 명동',
    service: '디럭스룸 1박 (주중)',
    requirements: ['블로그 리뷰 필수', '사진 10장 이상'],
    deadline: '2026-05-01',
    availableDates: ['2026-05-05', '2026-05-06', '2026-05-07', '2026-05-08'],
    premium: true,
    description: '신규 리모델링 호텔입니다.',
    deposit: 30000,
  },
  {
    id: '6',
    category: 'hair',
    image: 'https://images.unsplash.com/photo-1638064432604-8da1fc75de09?w=600',
    shopName: '스타일 헤어',
    location: '성동구 성수동',
    service: '펌 + 클리닉 케어',
    requirements: ['중단발 이상', '평일 오후 2시'],
    deadline: '2026-04-28',
    availableDates: ['2026-04-29', '2026-04-30'],
    deposit: 5000,
  },
  {
    id: '7',
    category: 'nail',
    image: 'https://images.unsplash.com/photo-1754799670312-8e7da8e40ad7?w=600',
    shopName: '네일 앤 스파',
    location: '강남구 신사동',
    service: '페디큐어 + 핸드케어',
    requirements: ['예약금 5천원', '노쇼 시 환불 불가'],
    deadline: '2026-04-26',
    availableDates: ['2026-04-28', '2026-04-29'],
    deposit: 5000,
  },
  {
    id: '8',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1678095302340-68c83a06bdfb?w=600',
    shopName: '로스터리 카페',
    location: '용산구 이태원',
    service: '스페셜티 커피 + 디저트',
    requirements: ['리뷰 작성', '방문 인증샷'],
    deadline: '2026-04-25',
    availableDates: ['2026-04-26', '2026-04-27'],
    deposit: 5000,
  },
];

const userPostedMatchings: Matching[] = [];

export function getAllMatchings() {
  return [...userPostedMatchings, ...mockMatchings];
}

export function getDiscoverableMatchings() {
  return getAllMatchings().filter((matching) => (matching.postStatus ?? 'open') === 'open');
}

export function addPostedMatching(draft: MatchingPostDraft) {
  const newMatching: Matching = {
    id: `posted-${Date.now()}`,
    category: draft.category,
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600',
    shopName: draft.shopName,
    location: draft.location,
    locationCoordinates: draft.locationCoordinates,
    locationDetail: draft.locationDetail,
    locationDetailCoordinates: draft.locationDetailCoordinates,
    locationVisibility: draft.locationVisibility,
    service: draft.service,
    requirements: draft.requirements,
    deadline: draft.availableDates[0] ?? new Date().toISOString().slice(0, 10),
    availableDates: draft.availableDates,
    description: draft.description,
    deposit: draft.deposit,
    postStatus: 'open',
  };

  userPostedMatchings.unshift(newMatching);
  return newMatching;
}

export function getPostedMatchings() {
  return [...userPostedMatchings];
}

export function getPostedMatchingById(id: string) {
  return userPostedMatchings.find((matching) => matching.id === id) ?? null;
}

export function updatePostedMatchingStatus(id: string, status: MatchingPostStatus) {
  const target = userPostedMatchings.find((matching) => matching.id === id);

  if (!target) {
    return null;
  }

  target.postStatus = status;
  return target;
}

export function updatePostedMatching(id: string, draft: MatchingPostDraft) {
  const target = userPostedMatchings.find((matching) => matching.id === id);

  if (!target) {
    return null;
  }

  target.category = draft.category;
  target.shopName = draft.shopName;
  target.location = draft.location;
  target.locationCoordinates = draft.locationCoordinates;
  target.locationDetail = draft.locationDetail;
  target.locationDetailCoordinates = draft.locationDetailCoordinates;
  target.locationVisibility = draft.locationVisibility;
  target.service = draft.service;
  target.requirements = [...draft.requirements];
  target.availableDates = [...draft.availableDates];
  target.deadline = draft.availableDates[0] ?? target.deadline;
  target.description = draft.description;
  target.deposit = draft.deposit;

  return target;
}
