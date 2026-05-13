import { requestJson } from '@/api/http';
import type {
  ConsultationBookingStatus,
  ConsultationMessageType,
  ConsultationStatusTone,
  ConsultationViewerRole,
  PartnerConsultation,
} from '@/data/consultations';

type ConsultationApiScheduleOption = {
  date: string;
  time: string;
};

type ConsultationApiBookingSelection = {
  date: string;
  time: string;
  deposit: number;
};

type ConsultationApiMessage = {
  id: string;
  senderRole: ConsultationViewerRole;
  type: ConsultationMessageType;
  content: string;
  createdAt: string;
  desiredScheduleOptions: ConsultationApiScheduleOption[] | null;
  bookingData: ConsultationApiBookingSelection | null;
};

export type ConsultationResponse = {
  postId: number;
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
    selectedBooking: ConsultationApiBookingSelection | null;
  };
  messages: ConsultationApiMessage[];
};

export function getPartnerConsultations(accessToken: string) {
  return requestJson<ConsultationResponse[]>('/api/partner/consultations', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    unauthorizedBehavior: 'notify',
  } as RequestInit & { unauthorizedBehavior: 'notify' });
}

export function getPartnerConsultation(accessToken: string, postId: number) {
  return requestJson<ConsultationResponse>(`/api/partner/consultations/${postId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    unauthorizedBehavior: 'notify',
  } as RequestInit & { unauthorizedBehavior: 'notify' });
}

function toMinutesAgo(createdAt: string) {
  const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
  return Math.max(1, diff);
}

export function mapConsultationResponseToPartnerConsultation(
  response: ConsultationResponse,
): PartnerConsultation {
  return {
    matchingId: String(response.postId),
    customerName: response.customerName,
    customerNote: response.customerNote,
    statusLabel: response.statusLabel,
    statusTone: response.statusTone,
    summary: response.summary,
    unreadCount: response.unreadCount,
    updatedAt: response.updatedAt,
    bookingFlow: {
      status: response.bookingFlow.status,
      desiredScheduleCount: response.bookingFlow.desiredScheduleCount,
      selectedBooking: response.bookingFlow.selectedBooking,
    },
    messages: response.messages.map((message) => ({
      id: message.id,
      senderRole: message.senderRole,
      type: message.type,
      content: message.content,
      minutesAgo: toMinutesAgo(message.createdAt),
      desiredScheduleOptions: message.desiredScheduleOptions ?? undefined,
      bookingData: message.bookingData ?? undefined,
    })),
  };
}
