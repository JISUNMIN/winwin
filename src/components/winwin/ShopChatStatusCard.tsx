import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

type ShopChatStatusCardProps = {
  customerMessageCount: number;
  desiredScheduleCount: number;
  bookingStatusLabel: string;
  nextActionText: string;
};

export function ShopChatStatusCard({
  customerMessageCount,
  desiredScheduleCount,
  bookingStatusLabel,
  nextActionText,
}: ShopChatStatusCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <Ionicons name="briefcase-outline" size={19} color="#1D4ED8" />
        </View>
        <View style={styles.headerTextBox}>
          <Text style={styles.title}>샵 상담 요약</Text>
          <Text style={styles.subtitle}>고객 대응 전에 지금 상태를 빠르게 확인할 수 있어요.</Text>
        </View>
      </View>

      <View style={styles.metricRow}>
        <View style={styles.metricBox}>
          <Text style={styles.metricValue}>{customerMessageCount}</Text>
          <Text style={styles.metricLabel}>고객 메시지</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricValue}>{desiredScheduleCount}</Text>
          <Text style={styles.metricLabel}>희망 일정</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricValue}>{bookingStatusLabel}</Text>
          <Text style={styles.metricLabel}>예약 요청</Text>
        </View>
      </View>

      <View style={styles.nextActionBox}>
        <Ionicons name="flash-outline" size={16} color="#1D4ED8" />
        <Text style={styles.nextActionText}>{nextActionText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    padding: 14,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextBox: {
    flex: 1,
  },
  title: {
    color: '#15181D',
    fontSize: 15,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 3,
    color: '#555B66',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBox: {
    flex: 1,
    minHeight: 72,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  metricValue: {
    color: '#1D4ED8',
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  metricLabel: {
    marginTop: 4,
    color: '#555B66',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  nextActionBox: {
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  nextActionText: {
    flex: 1,
    color: '#1E3A8A',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
  },
});
