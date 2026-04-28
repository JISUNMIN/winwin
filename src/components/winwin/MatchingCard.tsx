import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getCategoryLabel, getDaysUntil } from '@/data/matchings';
import type { Matching } from '@/data/matchings';

interface MatchingCardProps {
  matching: Matching;
  onPress?: () => void;
}

export function MatchingCard({ matching, onPress }: MatchingCardProps) {
  const daysLeft = getDaysUntil(matching.deadline);
  const isUrgent = daysLeft === '오늘 마감' || daysLeft === '내일 마감';

  return (
    <View style={styles.card}>
      {matching.premium && (
        <View style={styles.premiumBadge}>
          <Ionicons name="trending-up-outline" size={15} color="#FFFFFF" />
          <Text style={styles.premiumText}>프리미엄 매칭</Text>
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.mainRow}>
          <View style={styles.imageWrap}>
            <Image
              source={{ uri: matching.image }}
              style={styles.image}
              contentFit="cover"
              transition={120}
            />
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{getCategoryLabel(matching.category)}</Text>
            </View>
          </View>

          <View style={styles.info}>
            <Text style={styles.shopName} numberOfLines={1}>
              {matching.shopName}
            </Text>
            <Text style={styles.service} numberOfLines={1}>
              {matching.service}
            </Text>

            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={13} color="#747B87" />
              <Text style={styles.metaText} numberOfLines={1}>
                {matching.location}
              </Text>
            </View>

            <View style={[styles.deadlineBadge, isUrgent && styles.deadlineBadgeUrgent]}>
              <Ionicons
                name="time-outline"
                size={13}
                color={isUrgent ? '#D33A2C' : '#747B87'}
              />
              <Text style={[styles.deadlineText, isUrgent && styles.deadlineTextUrgent]}>
                {daysLeft}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.requirements}>
          {matching.requirements.map((requirement) => (
            <View key={requirement} style={styles.requirementChip}>
              <Text style={styles.requirementText}>{requirement}</Text>
            </View>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={!onPress}
          onPress={onPress}
          style={({ pressed }) => [
            styles.actionButton,
            !onPress && styles.actionButtonDisabled,
            pressed && styles.actionButtonPressed,
          ]}>
          <Text style={styles.actionText}>
            {onPress ? '지원하기' : '상세 화면 다음 단계'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EBF0',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  premiumBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  body: {
    padding: 14,
  },
  mainRow: {
    flexDirection: 'row',
    gap: 12,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: '#E8EBF0',
  },
  categoryBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    borderRadius: 7,
    backgroundColor: '#6D5DFB',
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  shopName: {
    color: '#15181D',
    fontSize: 16,
    fontWeight: '800',
  },
  service: {
    marginTop: 5,
    color: '#555B66',
    fontSize: 14,
    lineHeight: 19,
  },
  metaRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    flex: 1,
    color: '#747B87',
    fontSize: 12,
    fontWeight: '600',
  },
  deadlineBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    borderRadius: 999,
    backgroundColor: '#F1F3F6',
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deadlineBadgeUrgent: {
    backgroundColor: '#FDEDEC',
  },
  deadlineText: {
    color: '#747B87',
    fontSize: 12,
    fontWeight: '800',
  },
  deadlineTextUrgent: {
    color: '#D33A2C',
  },
  requirements: {
    marginTop: 14,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: '#ECEFF4',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  requirementChip: {
    borderRadius: 999,
    backgroundColor: '#F1F3F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  requirementText: {
    color: '#555B66',
    fontSize: 12,
    fontWeight: '700',
  },
  actionButton: {
    marginTop: 14,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: '#6D5DFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#C6C9D1',
  },
  actionButtonPressed: {
    opacity: 0.78,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
