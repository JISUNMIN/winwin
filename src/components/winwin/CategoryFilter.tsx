import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Category } from '@/data/matchings';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface CategoryFilterProps {
  selected: Category;
  onSelect: (category: Category) => void;
}

const categories: Array<{
  id: Category;
  label: string;
  icon: IoniconName;
}> = [
  { id: 'all', label: '전체', icon: 'apps-outline' },
  { id: 'hair', label: '헤어', icon: 'cut-outline' },
  { id: 'nail', label: '네일', icon: 'sparkles-outline' },
  { id: 'eyelash', label: '속눈썹', icon: 'eye-outline' },
  { id: 'food', label: '음식/카페', icon: 'cafe-outline' },
  { id: 'accommodation', label: '숙박', icon: 'bed-outline' },
];

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>카테고리</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}>
        {categories.map((category) => {
          const isSelected = selected === category.id;
          const iconColor = isSelected ? '#FFFFFF' : '#6D5DFB';

          return (
            <Pressable
              key={category.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelect(category.id)}
              style={({ pressed }) => [
                styles.chip,
                isSelected && styles.chipSelected,
                pressed && styles.chipPressed,
              ]}>
              <Ionicons name={category.icon} size={16} color={iconColor} />
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {category.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
  },
  title: {
    marginBottom: 10,
    color: '#15181D',
    fontSize: 15,
    fontWeight: '800',
  },
  list: {
    gap: 8,
    paddingRight: 4,
  },
  chip: {
    minHeight: 38,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4EA',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipSelected: {
    backgroundColor: '#6D5DFB',
    borderColor: '#6D5DFB',
  },
  chipPressed: {
    opacity: 0.76,
  },
  chipText: {
    color: '#333842',
    fontSize: 14,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
});
