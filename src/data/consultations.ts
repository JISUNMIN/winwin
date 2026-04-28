import type { BookingData } from '@/components/winwin/BookingRequestCard';
import type { DesiredScheduleOption } from '@/components/winwin/BookingPicker';

export type ConsultationStatusTone = 'review' | 'payment' | 'confirmed' | 'waiting';
export type ConsultationBookingStatus =
  | 'idle'
  | 'reviewing-schedules'
  | 'booking-request-sent'
  | 'payment-completed';
export type ConsultationMessageType =
  | 'text'
  | 'desired-schedule'
  | 'shop-schedule-review'
  | 'booking-request';
export type ConsultationViewerRole = 'customer' | 'shopOwner';

export type ConsultationSeedMessage = {
  id: string;
  senderRole: ConsultationViewerRole;
  type: ConsultationMessageType;
  content: string;
  minutesAgo: number;
  desiredScheduleOptions?: DesiredScheduleOption[];
  bookingData?: BookingData;
};

export type ShopConsultation = {
  matchingId: string;
  customerName: string;
  customerNote: string;
  statusLabel: string;
  statusTone: ConsultationStatusTone;
  summary: string;
  unreadCount: number;
  updatedAt: string;
  bookingFlow: {
    status: ConsultationBookingStatus;
    desiredScheduleCount: number;
    selectedBooking: BookingData | null;
  };
  messages: ConsultationSeedMessage[];
};

export const mockShopConsultations: ShopConsultation[] = [
  {
    matchingId: '1',
    customerName: '김하늘',
    customerNote: '평일 오후 방문 가능, 발레야쥬 시술 경험 있음',
    statusLabel: '검토중',
    statusTone: 'review',
    summary: '고객이 희망 일정 3개를 보냈어요. 가능한 시간을 골라 예약 요청을 보내세요.',
    unreadCount: 2,
    updatedAt: '2026-04-28T13:45:00+09:00',
    bookingFlow: {
      status: 'reviewing-schedules',
      desiredScheduleCount: 3,
      selectedBooking: null,
    },
    messages: [
      {
        id: 'm1',
        senderRole: 'shopOwner',
        type: 'text',
        content: '안녕하세요! 블룸 헤어살롱입니다. 지원해주셔서 감사합니다.',
        minutesAgo: 110,
      },
      {
        id: 'm2',
        senderRole: 'customer',
        type: 'text',
        content: '안녕하세요. 탈색 이력 괜찮고 평일 오후 위주로 방문 가능해요.',
        minutesAgo: 105,
      },
      {
        id: 'm3',
        senderRole: 'shopOwner',
        type: 'text',
        content: '좋아요. 가능한 방문 시간을 몇 개 알려주시면 확인해볼게요.',
        minutesAgo: 100,
      },
      {
        id: 'm4',
        senderRole: 'customer',
        type: 'desired-schedule',
        content: '희망 일정을 보냈습니다.',
        minutesAgo: 18,
        desiredScheduleOptions: [
          { date: '2026-04-29', time: '14:00' },
          { date: '2026-04-30', time: '15:00' },
          { date: '2026-05-01', time: '11:00' },
        ],
      },
      {
        id: 'm5',
        senderRole: 'shopOwner',
        type: 'text',
        content: '보내주신 일정 확인했어요. 가능한 시간을 골라 예약 요청을 보낼게요.',
        minutesAgo: 12,
      },
      {
        id: 'm6',
        senderRole: 'shopOwner',
        type: 'shop-schedule-review',
        content: '가능한 일정을 선택해 예약 요청을 보냅니다.',
        minutesAgo: 11,
        desiredScheduleOptions: [
          { date: '2026-04-29', time: '14:00' },
          { date: '2026-04-30', time: '15:00' },
          { date: '2026-05-01', time: '11:00' },
        ],
      },
    ],
  },
  {
    matchingId: '2',
    customerName: '박서연',
    customerNote: '손톱 길이 충분, 주말 오전 선호',
    statusLabel: '결제대기',
    statusTone: 'payment',
    summary: '예약 요청을 보낸 상태예요. 고객 결제 완료 여부를 확인해보세요.',
    unreadCount: 1,
    updatedAt: '2026-04-28T12:15:00+09:00',
    bookingFlow: {
      status: 'booking-request-sent',
      desiredScheduleCount: 2,
      selectedBooking: {
        date: '2026-04-27',
        time: '11:00',
        deposit: 3000,
      },
    },
    messages: [
      {
        id: 'm1',
        senderRole: 'shopOwner',
        type: 'text',
        content: '안녕하세요! 네일샵 러블리입니다. 상담 이어가볼게요.',
        minutesAgo: 240,
      },
      {
        id: 'm2',
        senderRole: 'customer',
        type: 'desired-schedule',
        content: '희망 일정을 보냈습니다.',
        minutesAgo: 95,
        desiredScheduleOptions: [
          { date: '2026-04-26', time: '10:00' },
          { date: '2026-04-27', time: '11:00' },
        ],
      },
      {
        id: 'm3',
        senderRole: 'shopOwner',
        type: 'text',
        content: '4월 27일 11시 일정으로 가능해요. 아래 요청에서 예약을 확정해주세요.',
        minutesAgo: 80,
      },
      {
        id: 'm4',
        senderRole: 'shopOwner',
        type: 'booking-request',
        content: '예약 확정 요청을 보냈습니다.',
        minutesAgo: 79,
        bookingData: {
          date: '2026-04-27',
          time: '11:00',
          deposit: 3000,
        },
      },
      {
        id: 'm5',
        senderRole: 'customer',
        type: 'text',
        content: '확인했어요. 잠시 후 결제할게요.',
        minutesAgo: 74,
      },
    ],
  },
  {
    matchingId: '5',
    customerName: '이소민',
    customerNote: '명동 방문 경험 있음, 체크인 시간 조율 요청',
    statusLabel: '확정',
    statusTone: 'confirmed',
    summary: '보증금 결제가 완료됐어요. 방문 전 최종 안내만 남았습니다.',
    unreadCount: 0,
    updatedAt: '2026-04-28T09:20:00+09:00',
    bookingFlow: {
      status: 'payment-completed',
      desiredScheduleCount: 1,
      selectedBooking: {
        date: '2026-05-05',
        time: '16:00',
        deposit: 30000,
      },
    },
    messages: [
      {
        id: 'm1',
        senderRole: 'shopOwner',
        type: 'text',
        content: '안녕하세요! 호텔 더 스카이입니다. 예약 일정 확인 도와드릴게요.',
        minutesAgo: 480,
      },
      {
        id: 'm2',
        senderRole: 'customer',
        type: 'desired-schedule',
        content: '희망 일정을 보냈습니다.',
        minutesAgo: 420,
        desiredScheduleOptions: [{ date: '2026-05-05', time: '16:00' }],
      },
      {
        id: 'm3',
        senderRole: 'shopOwner',
        type: 'booking-request',
        content: '예약 확정 요청을 보냈습니다.',
        minutesAgo: 390,
        bookingData: {
          date: '2026-05-05',
          time: '16:00',
          deposit: 30000,
        },
      },
      {
        id: 'm4',
        senderRole: 'customer',
        type: 'text',
        content: '2026-05-05 16:00 예약을 확정했어요. 보증금 결제도 완료했습니다.',
        minutesAgo: 380,
      },
      {
        id: 'm5',
        senderRole: 'shopOwner',
        type: 'text',
        content: '결제 확인됐습니다. 방문 전날 체크인 안내 메시지 드릴게요.',
        minutesAgo: 370,
      },
    ],
  },
  {
    matchingId: '3',
    customerName: '최유진',
    customerNote: '첫 시술 가능, 속눈썹 연장 경험 없음',
    statusLabel: '대기',
    statusTone: 'waiting',
    summary: '아직 일정 조율 전 단계예요. 고객의 현재 상태와 가능 시간을 먼저 확인해보세요.',
    unreadCount: 3,
    updatedAt: '2026-04-28T14:05:00+09:00',
    bookingFlow: {
      status: 'idle',
      desiredScheduleCount: 0,
      selectedBooking: null,
    },
    messages: [
      {
        id: 'm1',
        senderRole: 'shopOwner',
        type: 'text',
        content: '안녕하세요! 아이래쉬 스튜디오입니다. 시술 가능 여부 먼저 확인할게요.',
        minutesAgo: 45,
      },
      {
        id: 'm2',
        senderRole: 'customer',
        type: 'text',
        content: '첫 시술이라 궁금한 게 많아요. 시술 시간과 관리 방법도 알고 싶어요.',
        minutesAgo: 20,
      },
    ],
  },
];

export function getShopConsultationByMatchingId(matchingId: string) {
  return mockShopConsultations.find((item) => item.matchingId === matchingId);
}

export function formatConsultationUpdatedText(updatedAt: string) {
  const updatedDate = new Date(updatedAt);
  const diffMinutes = Math.max(1, Math.floor((Date.now() - updatedDate.getTime()) / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  if (diffMinutes < 1440) {
    return `${Math.floor(diffMinutes / 60)}시간 전`;
  }

  return updatedDate.toLocaleDateString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
  });
}
