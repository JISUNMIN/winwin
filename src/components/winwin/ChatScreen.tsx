import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookingPicker } from '@/components/winwin/BookingPicker';
import type { DesiredScheduleOption } from '@/components/winwin/BookingPicker';
import { BookingRequestCard } from '@/components/winwin/BookingRequestCard';
import type { BookingData } from '@/components/winwin/BookingRequestCard';
import { DesiredScheduleCard } from '@/components/winwin/DesiredScheduleCard';
import { ImageMessageCard } from '@/components/winwin/ImageMessageCard';
import { PaymentModal } from '@/components/winwin/PaymentModal';
import { ShopScheduleReviewCard } from '@/components/winwin/ShopScheduleReviewCard';
import { mockMatchings } from '@/data/matchings';

export type ViewerRole = 'customer' | 'shopOwner';

type Message = {
  id: string;
  senderRole: ViewerRole;
  type:
    | 'text'
    | 'image'
    | 'desired-schedule'
    | 'shop-schedule-review'
    | 'booking-request';
  content: string;
  timestamp: Date;
  imageUri?: string;
  bookingData?: BookingData;
  desiredScheduleOptions?: DesiredScheduleOption[];
};

type ChatScreenProps = {
  initialViewerRole: ViewerRole;
  allowRoleSwitch?: boolean;
};

function formatMessageTime(date: Date) {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ChatScreen({
  initialViewerRole,
  allowRoleSwitch = false,
}: ChatScreenProps) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const matching = mockMatchings.find((item) => item.id === id);
  const scrollRef = useRef<ScrollView>(null);
  const [viewerRole, setViewerRole] = useState<ViewerRole>(initialViewerRole);
  const [inputMessage, setInputMessage] = useState('');
  const [showBookingPicker, setShowBookingPicker] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderRole: 'shopOwner',
      type: 'text',
      content: `안녕하세요! ${matching?.shopName ?? '매장'}입니다. 지원해주셔서 감사합니다.`,
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      senderRole: 'customer',
      type: 'text',
      content: '안녕하세요. 일정이 맞으면 방문해서 시술받고 싶어요.',
      timestamp: new Date(Date.now() - 3550000),
    },
    {
      id: '3',
      senderRole: 'shopOwner',
      type: 'text',
      content: '상담을 위해 현재 상태와 가능한 방문 시간을 알려주세요.',
      timestamp: new Date(Date.now() - 3500000),
    },
  ]);

  useEffect(() => {
    setViewerRole(initialViewerRole);
  }, [initialViewerRole]);

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages]);

  if (!matching) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>채팅 정보를 찾을 수 없습니다</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>돌아가기</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleSendMessage = () => {
    const trimmedMessage = inputMessage.trim();

    if (!trimmedMessage) {
      return;
    }

    const userMessage: Message = {
      id: String(Date.now()),
      senderRole: viewerRole,
      type: 'text',
      content: trimmedMessage,
      timestamp: new Date(),
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInputMessage('');

    setTimeout(() => {
      const replyMessage: Message = {
        id: String(Date.now() + 1),
        senderRole: viewerRole === 'customer' ? 'shopOwner' : 'customer',
        type: 'text',
        content:
          viewerRole === 'customer'
            ? '네, 확인했습니다. 가능한 일정 확인 후 안내드릴게요.'
            : '네, 확인했어요. 안내 기다리고 있을게요.',
        timestamp: new Date(),
      };

      setMessages((currentMessages) => [...currentMessages, replyMessage]);
    }, 700);
  };

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('앨범 권한 필요', '사진을 보내려면 앨범 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.82,
      allowsEditing: false,
    });

    if (result.canceled) {
      return;
    }

    const selectedAsset = result.assets[0];

    if (!selectedAsset) {
      return;
    }

    const imageMessage: Message = {
      id: String(Date.now()),
      senderRole: viewerRole,
      type: 'image',
      content: selectedAsset.fileName ?? '첨부 사진',
      imageUri: selectedAsset.uri,
      timestamp: new Date(),
    };

    setMessages((currentMessages) => [...currentMessages, imageMessage]);

    setTimeout(() => {
      const replyMessage: Message = {
        id: String(Date.now() + 1),
        senderRole: viewerRole === 'customer' ? 'shopOwner' : 'customer',
        type: 'text',
        content:
          viewerRole === 'customer'
            ? '사진 확인했습니다. 상태에 맞춰 상담 도와드릴게요.'
            : '사진 잘 받았어요. 확인 감사합니다.',
        timestamp: new Date(),
      };

      setMessages((currentMessages) => [...currentMessages, replyMessage]);
    }, 700);
  };

  const handleSendDesiredSchedule = (options: DesiredScheduleOption[]) => {
    if (viewerRole !== 'customer') {
      return;
    }

    const desiredScheduleMessage: Message = {
      id: String(Date.now()),
      senderRole: 'customer',
      type: 'desired-schedule',
      content: '희망 일정을 보냈습니다.',
      timestamp: new Date(),
      desiredScheduleOptions: options,
    };

    setMessages((currentMessages) => [...currentMessages, desiredScheduleMessage]);
    setShowBookingPicker(false);

    setTimeout(() => {
      const replyTime = Date.now();
      const shopReply: Message = {
        id: String(replyTime),
        senderRole: 'shopOwner',
        type: 'text',
        content:
          options.length > 1
            ? '보내주신 일정 중 가능한 시간을 골라 예약 요청을 보낼게요.'
            : '보내주신 일정 확인했어요. 아래에서 예약 요청을 진행할게요.',
        timestamp: new Date(replyTime),
      };
      const shopScheduleReviewMessage: Message = {
        id: String(replyTime + 1),
        senderRole: 'shopOwner',
        type: 'shop-schedule-review',
        content: '가능한 일정을 선택해 예약 요청을 보냅니다.',
        timestamp: new Date(replyTime + 1),
        desiredScheduleOptions: options,
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        shopReply,
        shopScheduleReviewMessage,
      ]);
    }, 700);
  };

  const handleSelectShopSchedule = (
    reviewMessageId: string,
    selectedOption: DesiredScheduleOption,
  ) => {
    const bookingData: BookingData = {
      date: selectedOption.date,
      time: selectedOption.time,
      deposit: matching.deposit ?? 5000,
    };

    setMessages((currentMessages) => {
      const nextMessages = currentMessages.filter((message) => message.id !== reviewMessageId);
      const replyTime = Date.now();

      return [
        ...nextMessages,
        {
          id: String(replyTime),
          senderRole: 'shopOwner',
          type: 'text',
          content: `${selectedOption.time} 일정으로 가능해요. 아래 요청에서 예약을 확정해주세요.`,
          timestamp: new Date(replyTime),
        },
        {
          id: String(replyTime + 1),
          senderRole: 'shopOwner',
          type: 'booking-request',
          content: '예약 확정 요청을 보냈습니다.',
          timestamp: new Date(replyTime + 1),
          bookingData,
        },
      ];
    });
  };

  const handleAcceptBooking = (bookingData: BookingData) => {
    setSelectedBooking(bookingData);
  };

  const handlePaymentComplete = (bookingData: BookingData) => {
    const confirmMessage: Message = {
      id: String(Date.now()),
      senderRole: 'customer',
      type: 'text',
      content: `${bookingData.date} ${bookingData.time} 예약을 확정했어요. 보증금 결제도 완료했습니다.`,
      timestamp: new Date(),
    };

    setMessages((currentMessages) => [...currentMessages, confirmMessage]);
    setSelectedBooking(null);
  };

  const isCustomerViewer = viewerRole === 'customer';
  const modeLabel = isCustomerViewer ? '고객 보기' : '샵 보기';
  const modeDescription = isCustomerViewer
    ? '고객 기준으로 메시지와 예약 액션을 보여주고 있어요.'
    : '샵 기준으로 메시지와 일정 선택 액션을 보여주고 있어요.';

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardArea}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#15181D" />
          </Pressable>

          <Image source={{ uri: matching.image }} style={styles.shopImage} contentFit="cover" />

          <View style={styles.headerText}>
            <Text numberOfLines={1} style={styles.shopName}>
              {matching.shopName}
            </Text>
            <Text numberOfLines={1} style={styles.service}>
              {matching.service}
            </Text>
          </View>

          {allowRoleSwitch && (
            <View style={styles.roleSwitcher}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setViewerRole('customer')}
                style={[styles.roleButton, isCustomerViewer && styles.roleButtonActive]}>
                <Text
                  style={[
                    styles.roleButtonText,
                    isCustomerViewer && styles.roleButtonTextActive,
                  ]}>
                  고객
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => setViewerRole('shopOwner')}
                style={[styles.roleButton, !isCustomerViewer && styles.roleButtonActive]}>
                <Text
                  style={[
                    styles.roleButtonText,
                    !isCustomerViewer && styles.roleButtonTextActive,
                  ]}>
                  샵
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messageList}
          keyboardShouldPersistTaps="handled">
          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>{modeLabel}</Text>
            <Text style={styles.noticeSubtext}>{modeDescription}</Text>
          </View>

          {messages.map((message) => {
            const isMine = message.senderRole === viewerRole;

            return (
              <View key={message.id} style={[styles.messageRow, isMine && styles.userMessageRow]}>
                {message.type === 'image' && message.imageUri ? (
                  <View style={styles.cardMessage}>
                    <ImageMessageCard imageUri={message.imageUri} caption={message.content} />
                    <Text style={[styles.cardTimeText, isMine && styles.userCardTimeText]}>
                      {formatMessageTime(message.timestamp)}
                    </Text>
                  </View>
                ) : message.type === 'desired-schedule' && message.desiredScheduleOptions ? (
                  <View style={styles.cardMessage}>
                    <DesiredScheduleCard options={message.desiredScheduleOptions} />
                    <Text style={[styles.cardTimeText, isMine && styles.userCardTimeText]}>
                      {formatMessageTime(message.timestamp)}
                    </Text>
                  </View>
                ) : message.type === 'booking-request' && message.bookingData ? (
                  <View style={styles.cardMessage}>
                    <BookingRequestCard
                      bookingData={message.bookingData}
                      canAccept={isCustomerViewer}
                      onAccept={handleAcceptBooking}
                    />
                    <Text style={[styles.cardTimeText, isMine && styles.userCardTimeText]}>
                      {formatMessageTime(message.timestamp)}
                    </Text>
                  </View>
                ) : message.type === 'shop-schedule-review' &&
                  message.desiredScheduleOptions ? (
                  <View style={styles.cardMessage}>
                    <ShopScheduleReviewCard
                      options={message.desiredScheduleOptions}
                      deposit={matching.deposit ?? 5000}
                      selectable={!isCustomerViewer}
                      onSelectOption={(option) => handleSelectShopSchedule(message.id, option)}
                    />
                    <Text style={[styles.cardTimeText, isMine && styles.userCardTimeText]}>
                      {formatMessageTime(message.timestamp)}
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.bubble, isMine ? styles.userBubble : styles.shopBubble]}>
                    <Text style={[styles.messageText, isMine && styles.userMessageText]}>
                      {message.content}
                    </Text>
                    <Text style={[styles.timeText, isMine && styles.userTimeText]}>
                      {formatMessageTime(message.timestamp)}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputBar}>
          <Pressable
            accessibilityRole="button"
            onPress={handlePickPhoto}
            style={styles.iconButton}>
            <Ionicons name="image-outline" size={22} color="#747B87" />
          </Pressable>

          {isCustomerViewer && (
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowBookingPicker(true)}
              style={styles.iconButton}>
              <Ionicons name="calendar-outline" size={22} color="#747B87" />
            </Pressable>
          )}

          <TextInput
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder={
              isCustomerViewer ? '고객 메시지를 입력하세요' : '샵 메시지를 입력하세요'
            }
            placeholderTextColor="#8A8F98"
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={handleSendMessage}
          />

          <Pressable
            accessibilityRole="button"
            onPress={handleSendMessage}
            style={[styles.sendButton, !inputMessage.trim() && styles.sendButtonDisabled]}>
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        <BookingPicker
          visible={showBookingPicker}
          availableDates={matching.availableDates ?? []}
          onClose={() => setShowBookingPicker(false)}
          onConfirm={handleSendDesiredSchedule}
        />

        <PaymentModal
          visible={selectedBooking !== null}
          bookingData={selectedBooking}
          shopName={matching.shopName}
          onClose={() => setSelectedBooking(null)}
          onComplete={handlePaymentComplete}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  keyboardArea: {
    flex: 1,
  },
  header: {
    minHeight: 64,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBF0',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8EBF0',
  },
  headerText: {
    flex: 1,
  },
  shopName: {
    color: '#15181D',
    fontSize: 16,
    fontWeight: '900',
  },
  service: {
    marginTop: 3,
    color: '#747B87',
    fontSize: 12,
    fontWeight: '700',
  },
  roleSwitcher: {
    flexDirection: 'row',
    borderRadius: 999,
    backgroundColor: '#F1F3F6',
    padding: 3,
    gap: 4,
  },
  roleButton: {
    minHeight: 30,
    borderRadius: 999,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#6D5DFB',
  },
  roleButtonText: {
    color: '#747B87',
    fontSize: 12,
    fontWeight: '900',
  },
  roleButtonTextActive: {
    color: '#FFFFFF',
  },
  messageList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    gap: 10,
  },
  noticeBox: {
    alignSelf: 'center',
    maxWidth: 280,
    borderRadius: 999,
    backgroundColor: '#E8EBF0',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  noticeText: {
    color: '#555B66',
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  noticeSubtext: {
    marginTop: 4,
    color: '#555B66',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  shopBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 6,
  },
  userBubble: {
    backgroundColor: '#6D5DFB',
    borderBottomRightRadius: 6,
  },
  messageText: {
    color: '#15181D',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  timeText: {
    marginTop: 5,
    color: '#8A8F98',
    fontSize: 11,
    fontWeight: '700',
  },
  userTimeText: {
    color: '#DDD8FF',
  },
  cardMessage: {
    maxWidth: '82%',
  },
  cardTimeText: {
    marginTop: 5,
    color: '#8A8F98',
    fontSize: 11,
    fontWeight: '700',
  },
  userCardTimeText: {
    color: '#8A8F98',
    textAlign: 'right',
  },
  inputBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8EBF0',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1F3F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minHeight: 42,
    borderRadius: 21,
    backgroundColor: '#F1F3F6',
    color: '#15181D',
    fontSize: 14,
    paddingHorizontal: 14,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#6D5DFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#B8BEC9',
  },
  notFound: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundTitle: {
    color: '#15181D',
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  secondaryButton: {
    marginTop: 16,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: '#15181D',
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
