import { requestJson, requestMultipart, resolveApiUrl } from '@/api/http';
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
  imageUrl: string | null;
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

export function getCustomerConsultations(accessToken: string) {
  return requestJson<ConsultationResponse[]>('/api/customer/consultations', {
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

export function getCustomerConsultation(accessToken: string, postId: number) {
  return requestJson<ConsultationResponse>(`/api/customer/consultations/${postId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    unauthorizedBehavior: 'notify',
  } as RequestInit & { unauthorizedBehavior: 'notify' });
}

export function sendPartnerConsultationTextMessage(
  accessToken: string,
  postId: number,
  content: string,
) {
  return requestJson<ConsultationResponse>(`/api/partner/consultations/${postId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ content }),
    unauthorizedBehavior: 'notify',
  } as RequestInit & { unauthorizedBehavior: 'notify' });
}

export function sendCustomerConsultationTextMessage(
  accessToken: string,
  postId: number,
  content: string,
) {
  return requestJson<ConsultationResponse>(`/api/customer/consultations/${postId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ content }),
    unauthorizedBehavior: 'notify',
  } as RequestInit & { unauthorizedBehavior: 'notify' });
}

export function sendCustomerDesiredSchedules(
  accessToken: string,
  postId: number,
  options: ConsultationApiScheduleOption[],
) {
  return requestJson<ConsultationResponse>(`/api/customer/consultations/${postId}/desired-schedules`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ options }),
    unauthorizedBehavior: 'notify',
  } as RequestInit & { unauthorizedBehavior: 'notify' });
}

export function sendPartnerBookingRequest(
  accessToken: string,
  postId: number,
  bookingData: ConsultationApiBookingSelection,
) {
  return requestJson<ConsultationResponse>(`/api/partner/consultations/${postId}/booking-request`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(bookingData),
    unauthorizedBehavior: 'notify',
  } as RequestInit & { unauthorizedBehavior: 'notify' });
}

export function completeCustomerConsultationPayment(
  accessToken: string,
  postId: number,
) {
  return requestJson<ConsultationResponse>(`/api/customer/consultations/${postId}/payment-complete`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    unauthorizedBehavior: 'notify',
  } as RequestInit & { unauthorizedBehavior: 'notify' });
}

export function closePartnerConsultation(
  accessToken: string,
  postId: number,
) {
  return requestJson<ConsultationResponse>(`/api/partner/consultations/${postId}/close`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    unauthorizedBehavior: 'notify',
  } as RequestInit & { unauthorizedBehavior: 'notify' });
}

type UploadConsultationImageInput = {
  uri: string;
  name: string;
  mimeType: string;
  content?: string;
};

export function sendCustomerConsultationImage(
  accessToken: string,
  postId: number,
  image: UploadConsultationImageInput,
) {
  const formData = new FormData();
  formData.append('file', {
    uri: image.uri,
    name: image.name,
    type: image.mimeType,
  } as unknown as Blob);

  if (image.content?.trim()) {
    formData.append('content', image.content.trim());
  }

  return requestMultipart<ConsultationResponse>(
    `/api/customer/consultations/${postId}/images`,
    formData,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      unauthorizedBehavior: 'notify',
    },
  );
}

export function sendPartnerConsultationImage(
  accessToken: string,
  postId: number,
  image: UploadConsultationImageInput,
) {
  const formData = new FormData();
  formData.append('file', {
    uri: image.uri,
    name: image.name,
    type: image.mimeType,
  } as unknown as Blob);

  if (image.content?.trim()) {
    formData.append('content', image.content.trim());
  }

  return requestMultipart<ConsultationResponse>(
    `/api/partner/consultations/${postId}/images`,
    formData,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      unauthorizedBehavior: 'notify',
    },
  );
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
      imageUri: message.imageUrl ? resolveApiUrl(message.imageUrl) : undefined,
      desiredScheduleOptions: message.desiredScheduleOptions ?? undefined,
      bookingData: message.bookingData ?? undefined,
    })),
  };
}
