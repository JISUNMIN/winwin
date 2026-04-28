import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { DesiredScheduleOption } from '@/components/winwin/BookingPicker';
import { formatKoreanDate } from '@/data/matchings';

type ShopScheduleReviewCardProps = {
  options: DesiredScheduleOption[];
  deposit: number;
  selectable?: boolean;
  onSelectOption: (option: DesiredScheduleOption) => void;
};

export function ShopScheduleReviewCard({
  options,
  deposit,
  selectable = true,
  onSelectOption,
}: ShopScheduleReviewCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <View style={styles.iconBox}>
          <Ionicons name="checkmark-done-outline" size={20} color="#0F766E" />
        </View>
        <View style={styles.titleTextBox}>
          <Text style={styles.title}>가능한 일정 선택</Text>
          <Text style={styles.subtitle}>샵이 가능한 시간 하나를 골라 예약 요청을 보냅니다.</Text>
        </View>
      </View>

      <View style={styles.optionList}>
        {options.map((option) => (
          <View key={`${option.date}-${option.time}`} style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <Text style={styles.optionDate}>{formatKoreanDate(option.date)}</Text>
              <Text style={styles.optionTime}>{option.time}</Text>
            </View>

            {selectable ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => onSelectOption(option)}
                style={styles.selectButton}>
                <Text style={styles.selectButtonText}>이 일정 선택</Text>
              </Pressable>
            ) : (
              <View style={styles.readOnlyBadge}>
                <Text style={styles.readOnlyBadgeText}>샵 검토 중</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>
          예약 요청에는 보증금 {deposit.toLocaleString()}원이 함께 안내됩니다.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    maxWidth: 320,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#99F6E4',
    backgroundColor: '#F0FDFA',
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleTextBox: {
    flex: 1,
  },
  title: {
    color: '#134E4A',
    fontSize: 15,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 3,
    color: '#0F766E',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
  optionList: {
    marginTop: 12,
    gap: 8,
  },
  optionRow: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 10,
    gap: 10,
  },
  optionInfo: {
    gap: 2,
  },
  optionDate: {
    color: '#15181D',
    fontSize: 13,
    fontWeight: '800',
  },
  optionTime: {
    color: '#0F766E',
    fontSize: 13,
    fontWeight: '900',
  },
  selectButton: {
    minHeight: 38,
    borderRadius: 11,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  readOnlyBadge: {
    minHeight: 38,
    borderRadius: 11,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  readOnlyBadgeText: {
    color: '#0F766E',
    fontSize: 13,
    fontWeight: '900',
  },
  noticeBox: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  noticeText: {
    color: '#065F46',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
});
