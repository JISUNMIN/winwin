import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  categoryLabels,
  formatKoreanDate,
  type Matching,
  type MatchingCoordinates,
  type MatchingCategory,
  type MatchingPostDraft,
} from '@/data/matchings';
import { formatFullLocationText, formatPublicLocationText } from '@/utils/location-text';

const categoryOptions = Object.entries(categoryLabels) as [MatchingCategory, string][];
const requirementSuggestions = ['리뷰 필수', '평일 가능', '노쇼 금지', '사진 촬영 가능'];
const weekDayLabels = ['일', '월', '화', '수', '목', '금', '토'];
type VerificationState = 'idle' | 'loading' | 'verified' | 'error';

type ShopPostFormProps = {
  mode: 'create' | 'edit';
  initialMatching?: Matching;
  onBack: () => void;
  onSubmit: (draft: MatchingPostDraft) => void;
};

function buildPublicLocationLabel(
  address: Location.LocationGeocodedAddress | null | undefined,
  fallback: string,
) {
  return formatPublicLocationText(address, fallback);
}

function buildSummaryLocationFromDetail(detailAddress: string) {
  const tokens = detailAddress
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return tokens.slice(0, 3).join(' ') || detailAddress.trim();
}

function buildCombinedDetailLocation(baseAddress: string, extraDetail: string) {
  const normalizedBase = baseAddress.trim();
  const normalizedExtra = extraDetail.trim();

  if (!normalizedExtra) {
    return normalizedBase;
  }

  return `${normalizedBase}, ${normalizedExtra}`;
}

function buildDetailLocationLabel(
  address: Location.LocationGeocodedAddress | null | undefined,
  fallback: string,
) {
  return formatFullLocationText(address, fallback.trim());
}

function getDateOnly(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addMonths(baseDate: Date, monthOffset: number) {
  return new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1);
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatMonthLabel(date: Date) {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
  });
}

function isSameMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

function createCalendarDays(monthDate: Date) {
  const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const startDay = startOfMonth.getDay();
  const calendarStart = new Date(startOfMonth);
  calendarStart.setDate(startOfMonth.getDate() - startDay);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(calendarStart);
    day.setDate(calendarStart.getDate() + index);
    return day;
  });
}

export function ShopPostForm({
  mode,
  initialMatching,
  onBack,
  onSubmit,
}: ShopPostFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<MatchingCategory>(
    initialMatching?.category ?? 'hair',
  );
  const [shopName, setShopName] = useState(initialMatching?.shopName ?? '');
  const [service, setService] = useState(initialMatching?.service ?? '');
  const [baseLocation, setBaseLocation] = useState(
    initialMatching?.locationDetail ?? initialMatching?.location ?? '',
  );
  const [detailLocationExtra, setDetailLocationExtra] = useState('');
  const [detailLocationCoordinates, setDetailLocationCoordinates] = useState<MatchingCoordinates | null>(
    initialMatching?.locationDetailCoordinates ?? initialMatching?.locationCoordinates ?? null,
  );
  const [detailLocationState, setDetailLocationState] = useState<VerificationState>(
    initialMatching?.locationDetailCoordinates || initialMatching?.locationCoordinates
      ? 'verified'
      : 'idle',
  );
  const [detailLocationFeedback, setDetailLocationFeedback] = useState(
    initialMatching?.location
      ? `현재 저장된 공개 위치 ${initialMatching.location}`
      : '',
  );
  const [locationVisibility, setLocationVisibility] = useState<'summary-only' | 'exact-public'>(
    initialMatching?.locationVisibility ?? 'summary-only',
  );
  const [description, setDescription] = useState(initialMatching?.description ?? '');
  const [requirementInput, setRequirementInput] = useState('');
  const [requirements, setRequirements] = useState<string[]>(initialMatching?.requirements ?? []);
  const [selectedDates, setSelectedDates] = useState<string[]>(initialMatching?.availableDates ?? []);
  const [deposit, setDeposit] = useState(String(initialMatching?.deposit ?? 0));
  const [isImportingCurrentLocation, setIsImportingCurrentLocation] = useState(false);
  const [visibleMonthOffset, setVisibleMonthOffset] = useState(0);
  const today = getDateOnly(new Date());
  const minimumSelectableDate = new Date(today);
  minimumSelectableDate.setDate(today.getDate() + 1);
  const visibleMonth = addMonths(today, visibleMonthOffset);
  const calendarDays = createCalendarDays(visibleMonth);

  const isValid =
    shopName.trim().length > 0 &&
    service.trim().length > 0 &&
    baseLocation.trim().length > 0 &&
    detailLocationCoordinates !== null &&
    requirements.length > 0 &&
    selectedDates.length > 0;

  const handleAddRequirement = (value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue || requirements.includes(trimmedValue)) {
      return;
    }

    setRequirements((current) => [...current, trimmedValue]);
    setRequirementInput('');
  };

  const handleRemoveRequirement = (valueToRemove: string) => {
    setRequirements((current) => current.filter((value) => value !== valueToRemove));
  };

  const toggleDate = (date: string) => {
    setSelectedDates((currentDates) =>
      currentDates.includes(date)
        ? currentDates.filter((item) => item !== date)
        : [...currentDates, date].sort(),
    );
  };

  const importCurrentLocation = async () => {
    setIsImportingCurrentLocation(true);
    setDetailLocationState('loading');
    setDetailLocationFeedback('현재 위치에서 주소를 불러오고 있어요...');

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        setDetailLocationState('error');
        setDetailLocationFeedback('위치 권한이 없어 현재 위치를 불러오지 못했어요.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      const reverseResults = await Location.reverseGeocodeAsync(coordinates);
      const reverseAddress = reverseResults[0];
      const nextDetailLocation = buildDetailLocationLabel(reverseAddress, '현재 위치 주소');

      if (nextDetailLocation) {
        const publicSummary = buildPublicLocationLabel(reverseAddress, nextDetailLocation);
        const fallbackSummary = buildSummaryLocationFromDetail(nextDetailLocation);

        setBaseLocation(nextDetailLocation);
        setDetailLocationCoordinates(coordinates);
        setDetailLocationState('verified');
        setDetailLocationFeedback(
          `현재 위치 반영 완료 · 공개 위치 ${publicSummary || fallbackSummary} · 상세 위치 ${nextDetailLocation}`,
        );
        return;
      }

      setDetailLocationCoordinates(null);
      setDetailLocationState('error');
      setDetailLocationFeedback('현재 위치 주소를 읽지 못했어요. 잠시 후 다시 시도해 주세요.');
    } catch (error) {
      setDetailLocationCoordinates(null);
      setDetailLocationState('error');
      setDetailLocationFeedback('현재 위치를 가져오지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsImportingCurrentLocation(false);
    }
  };

  const handleSubmit = () => {
    if (!isValid || !detailLocationCoordinates) {
      return;
    }

    const normalizedDetailLocation = buildCombinedDetailLocation(baseLocation, detailLocationExtra);
    const derivedPublicLocation =
      locationVisibility === 'summary-only'
        ? buildSummaryLocationFromDetail(baseLocation)
        : normalizedDetailLocation;

    onSubmit({
      category: selectedCategory,
      shopName: shopName.trim(),
      location: derivedPublicLocation,
      locationCoordinates: detailLocationCoordinates,
      locationDetail: normalizedDetailLocation || undefined,
      locationDetailCoordinates: detailLocationCoordinates,
      locationVisibility,
      service: service.trim(),
      requirements,
      availableDates: selectedDates,
      deposit: Number(deposit.trim() || '0'),
      description: description.trim() || undefined,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#15181D" />
          </Pressable>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>{mode === 'edit' ? '공고 수정' : '공고 등록'}</Text>
          <Text style={styles.subtitle}>
            {mode === 'edit'
              ? '등록한 공고의 조건, 날짜, 위치를 다시 조정할 수 있습니다.'
              : '샵에서 새 매칭 공고를 올릴 수 있는 기본 입력 화면입니다.'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>카테고리</Text>
          <View style={styles.categoryRow}>
            {categoryOptions.map(([key, label]) => {
              const isSelected = selectedCategory === key;

              return (
                <Pressable
                  accessibilityRole="button"
                  key={key}
                  onPress={() => setSelectedCategory(key)}
                  style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}>
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextSelected,
                    ]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>샵 이름</Text>
          <TextInput
            value={shopName}
            onChangeText={setShopName}
            placeholder="예: 블룸 헤어살롱"
            placeholderTextColor="#8A8F98"
            style={styles.input}
          />

          <Text style={styles.inputLabel}>서비스명</Text>
          <TextInput
            value={service}
            onChangeText={setService}
            placeholder="예: 발레야쥬 염색 + 컷"
            placeholderTextColor="#8A8F98"
            style={styles.input}
          />

          <Text style={styles.inputLabel}>상세 위치 공개 방식</Text>
          <View style={styles.optionRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setLocationVisibility('summary-only')}
              style={[
                styles.optionChip,
                locationVisibility === 'summary-only' && styles.optionChipSelected,
              ]}>
              <Text
                style={[
                  styles.optionChipText,
                  locationVisibility === 'summary-only' && styles.optionChipTextSelected,
                ]}>
                예약 후 상세 위치 안내
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => setLocationVisibility('exact-public')}
              style={[
                styles.optionChip,
                locationVisibility === 'exact-public' && styles.optionChipSelected,
              ]}>
              <Text
                style={[
                  styles.optionChipText,
                  locationVisibility === 'exact-public' && styles.optionChipTextSelected,
                ]}>
                처음부터 상세 위치 공개
              </Text>
            </Pressable>
          </View>

          <Text style={styles.inputLabel}>기본 주소</Text>
          <View style={styles.locationPreviewBox}>
            <Text style={styles.locationPreviewText}>
              {baseLocation || '아직 불러온 주소가 없어요'}
            </Text>
          </View>
          <View style={styles.inlineInputRow}>
            <Pressable
              accessibilityRole="button"
              onPress={importCurrentLocation}
              style={[
                styles.secondaryActionButton,
                isImportingCurrentLocation && styles.secondaryActionButtonDisabled,
              ]}>
              <Text style={styles.secondaryActionButtonText}>
                {isImportingCurrentLocation ? '불러오는 중...' : '현재 위치 불러오기'}
              </Text>
            </Pressable>
          </View>
          <Text style={styles.inputHint}>
            큰 주소는 현재 위치로 불러오고, 아래에는 필요할 때만 `1층 102호` 같은 상세 안내를 적어주세요.
          </Text>
          {detailLocationFeedback ? (
            <Text
              style={[
                styles.statusText,
                detailLocationState === 'verified'
                  ? styles.statusTextVerified
                  : detailLocationState === 'error'
                    ? styles.statusTextError
                    : styles.statusTextNeutral,
              ]}>
              {detailLocationFeedback}
            </Text>
          ) : null}

          <Text style={styles.inputLabel}>추가 상세주소</Text>
          <TextInput
            value={detailLocationExtra}
            onChangeText={setDetailLocationExtra}
            placeholder="예: 1층 102호, 뒷문 옆"
            placeholderTextColor="#8A8F98"
            style={styles.input}
          />
          <Text style={styles.inputHint}>
            상세주소는 선택 입력입니다. 예약 후 안내가 필요하면 비워둬도 됩니다.
          </Text>

          <Text style={styles.inputLabel}>상세 설명</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="시술 설명, 모집 목적, 안내사항 등을 적어보세요"
            placeholderTextColor="#8A8F98"
            style={[styles.input, styles.multilineInput]}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.inputLabel}>지원 조건</Text>
          <View style={styles.inlineInputRow}>
            <TextInput
              value={requirementInput}
              onChangeText={setRequirementInput}
              placeholder="지원 조건을 입력하세요"
              placeholderTextColor="#8A8F98"
              style={[styles.input, styles.inlineInput]}
              onSubmitEditing={() => handleAddRequirement(requirementInput)}
            />

            <Pressable
              accessibilityRole="button"
              onPress={() => handleAddRequirement(requirementInput)}
              style={styles.inlineAddButton}>
              <Text style={styles.inlineAddButtonText}>추가</Text>
            </Pressable>
          </View>

          <View style={styles.suggestionRow}>
            {requirementSuggestions.map((item) => (
              <Pressable
                accessibilityRole="button"
                key={item}
                onPress={() => handleAddRequirement(item)}
                style={styles.suggestionChip}>
                <Text style={styles.suggestionChipText}>{item}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.selectedChipRow}>
            {requirements.map((item) => (
              <Pressable
                accessibilityRole="button"
                key={item}
                onPress={() => handleRemoveRequirement(item)}
                style={styles.selectedChip}>
                <Text style={styles.selectedChipText}>{item}</Text>
                <Ionicons name="close" size={14} color="#6D5DFB" />
              </Pressable>
            ))}
          </View>
          <Text style={styles.inputHint}>지원 조건은 최소 1개 이상 추가해야 합니다.</Text>

          <Text style={styles.inputLabel}>가능 날짜</Text>
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <Pressable
                accessibilityRole="button"
                disabled={visibleMonthOffset === 0}
                onPress={() => setVisibleMonthOffset((current) => Math.max(0, current - 1))}
                style={[
                  styles.calendarNavButton,
                  visibleMonthOffset === 0 && styles.calendarNavButtonDisabled,
                ]}>
                <Ionicons name="chevron-back" size={18} color="#15181D" />
              </Pressable>

              <Text style={styles.calendarMonthLabel}>{formatMonthLabel(visibleMonth)}</Text>

              <Pressable
                accessibilityRole="button"
                onPress={() => setVisibleMonthOffset((current) => current + 1)}
                style={styles.calendarNavButton}>
                <Ionicons name="chevron-forward" size={18} color="#15181D" />
              </Pressable>
            </View>

            <View style={styles.weekRow}>
              {weekDayLabels.map((label) => (
                <Text key={label} style={styles.weekDayText}>
                  {label}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {calendarDays.map((date) => {
                const dateKey = toDateKey(date);
                const isSelected = selectedDates.includes(dateKey);
                const isCurrentMonth = isSameMonth(date, visibleMonth);
                const isDisabled = date < minimumSelectableDate;

                return (
                  <Pressable
                    accessibilityRole="button"
                    disabled={isDisabled}
                    key={dateKey}
                    onPress={() => toggleDate(dateKey)}
                    style={[
                      styles.calendarDateCell,
                      !isCurrentMonth && styles.calendarDateCellOutsideMonth,
                      isSelected && styles.calendarDateCellSelected,
                      isDisabled && styles.calendarDateCellDisabled,
                    ]}>
                    <Text
                      style={[
                        styles.calendarDateText,
                        !isCurrentMonth && styles.calendarDateTextOutsideMonth,
                        isSelected && styles.calendarDateTextSelected,
                        isDisabled && styles.calendarDateTextDisabled,
                      ]}>
                      {date.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {selectedDates.length > 0 ? (
            <View style={styles.selectedDateRow}>
              {selectedDates.map((date) => (
                <Pressable
                  accessibilityRole="button"
                  key={date}
                  onPress={() => toggleDate(date)}
                  style={styles.selectedDateChip}>
                  <Text style={styles.selectedDateChipText}>{formatKoreanDate(date)}</Text>
                  <Ionicons name="close" size={14} color="#6D5DFB" />
                </Pressable>
              ))}
            </View>
          ) : null}
          <Text style={styles.inputHint}>가능 날짜는 최소 1개 이상 선택해야 합니다.</Text>

          <Text style={styles.inputLabel}>예약금</Text>
          <TextInput
            value={deposit}
            onChangeText={setDeposit}
            placeholder="예: 5000"
            placeholderTextColor="#8A8F98"
            keyboardType="numeric"
            style={styles.input}
          />
          <Text style={styles.inputHint}>
            {mode === 'edit'
              ? '수정하려면 상세 위치를 다시 확인 완료한 상태여야 합니다.'
              : '등록하려면 상세 위치를 확인 완료한 상태여야 합니다.'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable
          accessibilityRole="button"
          disabled={!isValid}
          onPress={handleSubmit}
          style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}>
          <Text style={styles.submitButtonText}>
            {mode === 'edit' ? '공고 수정 저장하기' : '공고 등록하기'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 120,
  },
  topBar: {
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    color: '#15181D',
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 8,
    color: '#555B66',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#15181D',
    fontSize: 15,
    fontWeight: '900',
  },
  categoryRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    minHeight: 38,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipSelected: {
    backgroundColor: '#6D5DFB',
  },
  categoryChipText: {
    color: '#555B66',
    fontSize: 13,
    fontWeight: '800',
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
  },
  optionRow: {
    marginTop: 10,
    gap: 8,
  },
  optionChip: {
    minHeight: 42,
    borderRadius: 14,
    backgroundColor: '#F1F3F6',
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionChipSelected: {
    backgroundColor: '#15181D',
  },
  optionChipText: {
    color: '#555B66',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  optionChipTextSelected: {
    color: '#FFFFFF',
  },
  formCard: {
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  inputLabel: {
    marginTop: 14,
    color: '#15181D',
    fontSize: 13,
    fontWeight: '900',
  },
  input: {
    minHeight: 44,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: '#F1F3F6',
    color: '#15181D',
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  locationPreviewBox: {
    marginTop: 8,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: '#F1F3F6',
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  locationPreviewText: {
    color: '#15181D',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  multilineInput: {
    minHeight: 88,
  },
  inlineInputRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  inlineInput: {
    flex: 1,
    marginTop: 0,
  },
  inlineAddButton: {
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: '#6D5DFB',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineAddButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  secondaryActionButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 12,
    backgroundColor: '#E9ECF3',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionButtonDisabled: {
    opacity: 0.6,
  },
  secondaryActionButtonText: {
    color: '#333842',
    fontSize: 12,
    fontWeight: '900',
  },
  suggestionRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    minHeight: 34,
    borderRadius: 999,
    backgroundColor: '#F1F3F6',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionChipText: {
    color: '#555B66',
    fontSize: 12,
    fontWeight: '800',
  },
  selectedChipRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedChip: {
    minHeight: 36,
    borderRadius: 999,
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  selectedChipText: {
    color: '#6D5DFB',
    fontSize: 12,
    fontWeight: '900',
  },
  calendarCard: {
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendarNavButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarNavButtonDisabled: {
    opacity: 0.35,
  },
  calendarMonthLabel: {
    color: '#15181D',
    fontSize: 13,
    fontWeight: '900',
  },
  weekRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekDayText: {
    width: '14.28%',
    textAlign: 'center',
    color: '#8A8F98',
    fontSize: 10,
    fontWeight: '800',
  },
  calendarGrid: {
    marginTop: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDateCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDateCellOutsideMonth: {
    opacity: 0.42,
  },
  calendarDateCellSelected: {
    backgroundColor: '#6D5DFB',
    borderRadius: 10,
  },
  calendarDateCellDisabled: {
    opacity: 0.24,
  },
  calendarDateText: {
    color: '#555B66',
    fontSize: 11,
    fontWeight: '800',
  },
  calendarDateTextOutsideMonth: {
    color: '#8A8F98',
  },
  calendarDateTextSelected: {
    color: '#FFFFFF',
  },
  calendarDateTextDisabled: {
    color: '#AAB1BB',
  },
  selectedDateRow: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  selectedDateChip: {
    minHeight: 32,
    borderRadius: 999,
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  selectedDateChipText: {
    color: '#6D5DFB',
    fontSize: 11,
    fontWeight: '900',
  },
  inputHint: {
    marginTop: 6,
    color: '#8A8F98',
    fontSize: 11,
    fontWeight: '700',
  },
  statusText: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '800',
  },
  statusTextVerified: {
    color: '#15803D',
  },
  statusTextError: {
    color: '#DC2626',
  },
  statusTextNeutral: {
    color: '#6B7280',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8EBF0',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  submitButton: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: '#6D5DFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#B8BEC9',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
