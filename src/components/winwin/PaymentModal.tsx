import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { BookingData } from '@/components/winwin/BookingRequestCard';
import { formatKoreanDate } from '@/data/matchings';

type PaymentModalProps = {
  visible: boolean;
  bookingData: BookingData | null;
  shopName: string;
  onClose: () => void;
  onComplete: (bookingData: BookingData) => void;
};

export function PaymentModal({
  visible,
  bookingData,
  shopName,
  onClose,
  onComplete,
}: PaymentModalProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleClose = () => {
    setIsCompleted(false);
    onClose();
  };

  const handleTransferReported = () => {
    if (!bookingData) {
      return;
    }

    setIsCompleted(true);

    setTimeout(() => {
      setIsCompleted(false);
      onComplete(bookingData);
    }, 800);
  };

  if (!bookingData) {
    return null;
  }

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>예약금 입금 안내</Text>
            <Pressable
              accessibilityLabel="닫기"
              accessibilityRole="button"
              disabled={isCompleted}
              onPress={handleClose}
              style={[styles.closeButton, isCompleted && styles.closeButtonDisabled]}>
              <Ionicons name="close" size={22} color="#15181D" />
            </Pressable>
          </View>

          {isCompleted ? (
            <View style={styles.completedContent}>
              <View style={styles.completedIcon}>
                <Ionicons name="checkmark" size={44} color="#16A34A" />
              </View>
              <Text style={styles.completedTitle}>입금 알림 완료</Text>
              <Text style={styles.completedText}>샵이 실제 입금을 확인하면 예약이 확정됩니다.</Text>
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
                  <Text style={styles.depositLabel}>예약금</Text>
                  <Text style={styles.depositDescription}>샵에서 안내한 계좌로 직접 입금해 주세요.</Text>
                </View>
                <Text style={styles.depositValue}>{bookingData.deposit.toLocaleString()}원</Text>
              </View>

              <View style={styles.accountBox}>
                <Text style={styles.sectionTitle}>입금 계좌</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>은행</Text>
                  <Text style={styles.infoValue}>{bookingData.bankName}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>계좌번호</Text>
                  <Text style={styles.infoValue}>{bookingData.accountNumber}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>예금주</Text>
                  <Text style={styles.infoValue}>{bookingData.accountHolder}</Text>
                </View>
              </View>

              <View style={styles.policyBox}>
                <Text style={styles.policyTitle}>안내</Text>
                <Text style={styles.policyText}>예약금 송금은 샵과 고객이 직접 진행합니다.</Text>
                <Text style={styles.policyText}>
                  WinWin은 계좌이체, 환불, 분쟁에 대한 책임을 지지 않습니다.
                </Text>
                <Text style={styles.policyText}>
                  입금 후 이 화면에서 알리면, 파트너가 실제 입금을 확인한 뒤 예약을 확정합니다.
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={handleTransferReported}
                style={styles.payButton}>
                <Text style={styles.payButtonText}>입금했고 확인 요청할게요</Text>
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
  accountBox: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1E4EA',
    backgroundColor: '#FFFFFF',
    padding: 14,
    gap: 10,
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
