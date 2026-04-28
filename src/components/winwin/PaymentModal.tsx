import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { BookingData } from '@/components/winwin/BookingRequestCard';
import { formatKoreanDate } from '@/data/matchings';

type PaymentMethod = 'card' | 'kakao' | 'toss';
type IoniconName = ComponentProps<typeof Ionicons>['name'];

type PaymentModalProps = {
  visible: boolean;
  bookingData: BookingData | null;
  shopName: string;
  onClose: () => void;
  onComplete: (bookingData: BookingData) => void;
};

const paymentMethods: Array<{
  id: PaymentMethod;
  name: string;
  icon: IoniconName;
}> = [
  { id: 'card', name: '신용/체크카드', icon: 'card-outline' },
  { id: 'kakao', name: '카카오페이', icon: 'chatbubble-outline' },
  { id: 'toss', name: '토스', icon: 'phone-portrait-outline' },
];

export function PaymentModal({
  visible,
  bookingData,
  shopName,
  onClose,
  onComplete,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleClose = () => {
    if (isProcessing) {
      return;
    }

    setIsCompleted(false);
    onClose();
  };

  const handlePayment = () => {
    if (!bookingData || isProcessing) {
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);

      setTimeout(() => {
        setIsCompleted(false);
        onComplete(bookingData);
      }, 800);
    }, 1000);
  };

  if (!bookingData) {
    return null;
  }

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>보증금 결제</Text>
            <Pressable
              accessibilityLabel="닫기"
              accessibilityRole="button"
              disabled={isProcessing || isCompleted}
              onPress={handleClose}
              style={[
                styles.closeButton,
                (isProcessing || isCompleted) && styles.closeButtonDisabled,
              ]}>
              <Ionicons name="close" size={22} color="#15181D" />
            </Pressable>
          </View>

          {isCompleted ? (
            <View style={styles.completedContent}>
              <View style={styles.completedIcon}>
                <Ionicons name="checkmark" size={44} color="#16A34A" />
              </View>
              <Text style={styles.completedTitle}>결제 완료</Text>
              <Text style={styles.completedText}>예약이 확정되었습니다.</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.content}>
              <View style={styles.bookingBox}>
                <Text style={styles.sectionTitle}>예약 정보</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>상호명</Text>
                  <Text numberOfLines={1} style={styles.infoValue}>
                    {shopName}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>예약 날짜</Text>
                  <Text style={styles.infoValue}>{formatKoreanDate(bookingData.date)}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>예약 시간</Text>
                  <Text style={styles.infoValue}>{bookingData.time}</Text>
                </View>
              </View>

              <View style={styles.depositBox}>
                <View>
                  <Text style={styles.depositLabel}>노쇼 방지 보증금</Text>
                  <Text style={styles.depositDescription}>
                    시술 완료 후 전액 환불됩니다.
                  </Text>
                </View>
                <Text style={styles.depositValue}>
                  {bookingData.deposit.toLocaleString()}원
                </Text>
              </View>

              <View>
                <Text style={styles.sectionTitle}>결제 수단</Text>
                <View style={styles.methodList}>
                  {paymentMethods.map((method) => {
                    const isSelected = selectedMethod === method.id;

                    return (
                      <Pressable
                        accessibilityRole="button"
                        key={method.id}
                        onPress={() => setSelectedMethod(method.id)}
                        style={[styles.methodButton, isSelected && styles.methodButtonSelected]}>
                        <Ionicons name={method.icon} size={22} color="#15181D" />
                        <Text style={styles.methodText}>{method.name}</Text>
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={22} color="#6D5DFB" />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.policyBox}>
                <Text style={styles.policyTitle}>환불 안내</Text>
                <Text style={styles.policyText}>시술 완료 후 24시간 이내 자동 환불</Text>
                <Text style={styles.policyText}>예약 시간 24시간 전 취소 시 전액 환불</Text>
                <Text style={styles.policyText}>노쇼 시 보증금 환불 불가</Text>
              </View>

              <Pressable
                accessibilityRole="button"
                disabled={isProcessing}
                onPress={handlePayment}
                style={[styles.payButton, isProcessing && styles.payButtonDisabled]}>
                {isProcessing ? (
                  <View style={styles.processingRow}>
                    <ActivityIndicator color="#FFFFFF" />
                    <Text style={styles.payButtonText}>결제 처리 중...</Text>
                  </View>
                ) : (
                  <Text style={styles.payButtonText}>
                    {bookingData.deposit.toLocaleString()}원 결제하기
                  </Text>
                )}
              </Pressable>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '88%',
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  header: {
    minHeight: 58,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBF0',
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#15181D',
    fontSize: 18,
    fontWeight: '900',
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F3F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonDisabled: {
    opacity: 0.45,
  },
  content: {
    padding: 18,
    gap: 16,
  },
  bookingBox: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDD8FF',
    backgroundColor: '#F7F5FF',
    padding: 14,
    gap: 10,
  },
  sectionTitle: {
    color: '#15181D',
    fontSize: 15,
    fontWeight: '900',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  infoLabel: {
    color: '#747B87',
    fontSize: 13,
    fontWeight: '700',
  },
  infoValue: {
    flex: 1,
    color: '#15181D',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'right',
  },
  depositBox: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  depositLabel: {
    color: '#15181D',
    fontSize: 14,
    fontWeight: '900',
  },
  depositDescription: {
    marginTop: 5,
    color: '#555B66',
    fontSize: 12,
    fontWeight: '700',
  },
  depositValue: {
    color: '#2563EB',
    fontSize: 22,
    fontWeight: '900',
  },
  methodList: {
    marginTop: 10,
    gap: 8,
  },
  methodButton: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E1E4EA',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  methodButtonSelected: {
    borderColor: '#6D5DFB',
    backgroundColor: '#F7F5FF',
  },
  methodText: {
    flex: 1,
    color: '#15181D',
    fontSize: 14,
    fontWeight: '800',
  },
  policyBox: {
    borderRadius: 14,
    backgroundColor: '#F1F3F6',
    padding: 14,
    gap: 5,
  },
  policyTitle: {
    marginBottom: 3,
    color: '#15181D',
    fontSize: 13,
    fontWeight: '900',
  },
  policyText: {
    color: '#555B66',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
  payButton: {
    minHeight: 52,
    borderRadius: 15,
    backgroundColor: '#6D5DFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonDisabled: {
    opacity: 0.72,
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  completedContent: {
    minHeight: 260,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedIcon: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedTitle: {
    marginTop: 18,
    color: '#15181D',
    fontSize: 22,
    fontWeight: '900',
  },
  completedText: {
    marginTop: 8,
    color: '#555B66',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
