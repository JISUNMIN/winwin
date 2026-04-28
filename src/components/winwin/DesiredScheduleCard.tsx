import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import type { DesiredScheduleOption } from '@/components/winwin/BookingPicker';
import { formatKoreanDate } from '@/data/matchings';

type DesiredScheduleCardProps = {
  options: DesiredScheduleOption[];
};

export function DesiredScheduleCard({ options }: DesiredScheduleCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <View style={styles.iconBox}>
          <Ionicons name="calendar-outline" size={19} color="#6D5DFB" />
        </View>
        <Text style={styles.title}>희망 일정 {options.length}개</Text>
      </View>

      <View style={styles.infoList}>
        {options.map((option, index) => (
          <View key={`${option.date}-${option.time}`} style={styles.infoRow}>
            <View style={styles.optionBadge}>
              <Text style={styles.optionBadgeText}>{index + 1}</Text>
            </View>
            <Text style={styles.infoText}>
              {formatKoreanDate(option.date)} {option.time}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.noticeText}>
        샵이 가능한 일정을 골라 예약 확정 요청을 보내요.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    maxWidth: 300,
    borderRadius: 18,
    backgroundColor: '#6D5DFB',
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
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
  optionBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBadgeText: {
    color: '#6D5DFB',
    fontSize: 11,
    fontWeight: '900',
  },
  infoText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  noticeText: {
    marginTop: 12,
    color: '#EEEAFE',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
});
