import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatKoreanDate } from '@/data/matchings';

export type BookingData = {
  date: string;
  time: string;
  deposit: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
};

type BookingRequestCardProps = {
  bookingData: BookingData;
  canReportTransfer?: boolean;
  canConfirmTransfer?: boolean;
  isTransferReported?: boolean;
  isConfirmed?: boolean;
  onReportTransfer?: (bookingData: BookingData) => void;
  onConfirmTransfer?: (bookingData: BookingData) => void;
};

export function BookingRequestCard({
  bookingData,
  canReportTransfer = false,
  canConfirmTransfer = false,
  isTransferReported = false,
  isConfirmed = false,
  onReportTransfer,
  onConfirmTransfer,
}: BookingRequestCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <View style={styles.iconBox}>
          <Ionicons name="calendar-outline" size={20} color="#2563EB" />
        </View>
        <Text style={styles.title}>예약 확정 요청</Text>
      </View>

      <View style={styles.infoList}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={16} color="#747B87" />
          <Text style={styles.infoText}>{formatKoreanDate(bookingData.date)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color="#747B87" />
          <Text style={styles.infoText}>{bookingData.time}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="card-outline" size={16} color="#747B87" />
          <Text style={styles.infoText}>예약금 {bookingData.deposit.toLocaleString()}원</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="business-outline" size={16} color="#747B87" />
          <Text style={styles.infoText}>
            {bookingData.bankName} {bookingData.accountNumber}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color="#747B87" />
          <Text style={styles.infoText}>예금주 {bookingData.accountHolder}</Text>
        </View>
      </View>

      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>
          예약금은 샵 계좌로 직접 입금합니다. 송금과 환불 책임은 샵과 고객에게 있으며, WinWin은 이에 대한 책임을 지지 않습니다.
        </Text>
      </View>

      {canConfirmTransfer ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => onConfirmTransfer?.(bookingData)}
          style={styles.acceptButton}>
          <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
          <Text style={styles.acceptButtonText}>입금 확인 후 예약 확정</Text>
        </Pressable>
      ) : canReportTransfer ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => onReportTransfer?.(bookingData)}
          style={styles.acceptButton}>
          <Ionicons name="wallet-outline" size={18} color="#FFFFFF" />
          <Text style={styles.acceptButtonText}>계좌 확인 후 입금했어요</Text>
        </Pressable>
      ) : isConfirmed ? (
        <View style={styles.pendingBox}>
          <Ionicons name="checkmark-circle" size={16} color="#2563EB" />
          <Text style={styles.pendingText}>예약이 확정되었습니다.</Text>
        </View>
      ) : isTransferReported ? (
        <View style={styles.pendingBox}>
          <Ionicons name="time-outline" size={16} color="#2563EB" />
          <Text style={styles.pendingText}>샵이 실제 입금을 확인하면 예약이 확정됩니다.</Text>
        </View>
      ) : (
        <View style={styles.pendingBox}>
          <Ionicons name="time-outline" size={16} color="#2563EB" />
          <Text style={styles.pendingText}>고객이 예약금 입금 후 알려주면 예약이 확정됩니다.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    maxWidth: 310,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#15181D',
    fontSize: 15,
    fontWeight: '900',
  },
  infoList: {
    marginTop: 12,
    gap: 7,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  infoText: {
    color: '#333842',
    fontSize: 13,
    fontWeight: '800',
  },
  noticeBox: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  noticeText: {
    color: '#555B66',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
  acceptButton: {
    minHeight: 42,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  pendingBox: {
    minHeight: 42,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  pendingText: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
});
