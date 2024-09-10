import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, Pressable } from 'react-native';
import { uiColors } from '@/constants/Colors';
import { sizes } from '@/constants/fonts&sizes';
import { TaskSquare } from 'iconsax-react-native';

export default function Tasks() {
  const [activeFilter, setActiveFilter] = useState('completed'); // Default active filter

  const filters = [
    { label: 'Completed', value: 'completed', count: 5 },
    { label: 'Pending', value: 'pending', count: 8 },
    { label: 'High', value: 'high', count: 3 },
    { label: 'Low', value: 'low', count: 7 },
    { label: 'Medium', value: 'medium', count: 2 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <TaskSquare size="32" color={uiColors.dark} />
        </View>
        <Text style={styles.headerText}>Task List</Text>
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.filterScrollView}
        showsHorizontalScrollIndicator={false}
      >
        {filters.map((filter) => (
          <Pressable
            key={filter.value}
            style={[
              styles.filterItem,
              activeFilter === filter.value && styles.activeFilter,
            ]}
            onPress={() => setActiveFilter(filter.value)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter.value && styles.activeFilterText,
              ]}
            >
              {filter.label}
            </Text>
            <View style={styles.circleContainer}>
              <View style={styles.circle}>
                <Text style={styles.circleText}>{filter.count}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: uiColors.dark,
    padding: sizes.marginSM,
  },
  header: {
    flexDirection: 'row',
    gap: 10,
    padding:sizes.marginSM,
    alignItems: 'center',
  },
  iconContainer: {
    width: 45,
    height: 45,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: uiColors.white,
    fontSize: sizes.fontSize[4] * 2,
    fontWeight: '500',
  },
  filterScrollView: {
    marginVertical: sizes.marginSM,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: sizes.marginSM,
    paddingHorizontal: sizes.marginSM,
    borderRadius: 20, 
    height: 40, 
    backgroundColor: uiColors.dark_light,
    justifyContent: 'space-between', 
  },
  activeFilter: {
    backgroundColor: uiColors.white,
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 28, // Circle size
    height: 28, // Circle size
    borderRadius: 14, // Circle shape
    backgroundColor: uiColors.dark_tint, // Change this color as needed
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: sizes.marginSM, // Space between text and circle
  },
  circleText: {
    color: uiColors.white,
    fontWeight: 'bold',
    fontSize: sizes.fontSize[3], // Adjust font size if needed
  },
  filterText: {
    color: uiColors.white,
    fontSize: sizes.fontSize[4],
  },
  activeFilterText: {
    color: uiColors.dark,
  },
});
