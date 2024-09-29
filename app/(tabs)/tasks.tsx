import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, Pressable, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { uiColors } from '@/constants/Colors';
import { sizes } from '@/constants/fonts&sizes';
import { TaskSquare } from 'iconsax-react-native';
import { useUserContext } from '@/context/context';
import TaskItem from "@/components/core-ui/taskItem";

export default function Tasks() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { getAllTasks, tasks } = useUserContext();

  const filters = [
    { label: 'All', value: 'all', count: tasks.length },
    { label: 'Completed', value: 'completed', count: tasks.filter(task => task.status === 'Completed').length },
    { label: 'Pending', value: 'pending', count: tasks.filter(task => task.status === 'Pending').length },
    { label: 'High', value: 'high', count: tasks.filter(task => task.priority === 'High').length },
    { label: 'Low', value: 'low', count: tasks.filter(task => task.priority === 'Low').length },
    { label: 'Medium', value: 'medium', count: tasks.filter(task => task.priority === 'Medium').length },
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    await getAllTasks();
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getAllTasks();
    setRefreshing(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'completed') return task.status === 'Completed';
    if (activeFilter === 'pending') return task.status === 'Pending';
    if (activeFilter === 'high') return task.priority === 'High';
    if (activeFilter === 'low') return task.priority === 'Low';
    if (activeFilter === 'medium') return task.priority === 'Medium';
    return true;
  });

  const noTasksMessage = `No ${activeFilter} tasks`;

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
        style={styles.scrollView}
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

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={uiColors.white} />
        </View>
      ) : filteredTasks.length === 0 ? ( 
        <View style={styles.noTasksContainer}>
          <Text style={styles.noTasksText}>{noTasksMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={({ item, index }) => <TaskItem item={item} index={index} />}
          keyExtractor={(item) => item?.task_id?.toString() || ''}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
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
    padding: sizes.marginSM,
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
    flexDirection: 'row',
  },
  scrollView: {
    maxHeight: 50,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: uiColors.dark_tint,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: sizes.marginSM,
  },
  circleText: {
    color: uiColors.white,
    fontWeight: 'bold',
    fontSize: sizes.fontSize[3],
  },
  filterText: {
    color: uiColors.white,
    fontSize: sizes.fontSize[4],
  },
  activeFilterText: {
    color: uiColors.dark,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTasksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTasksText: {
    color: uiColors.white,
    fontSize: sizes.fontSize[3],
  },
});
