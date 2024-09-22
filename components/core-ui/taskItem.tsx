import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Calendar } from 'iconsax-react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { uiColors } from '@/constants/Colors';
import { sizes } from '@/constants/fonts&sizes';
import { formatDateAndTime } from '@/utils';
import { router } from 'expo-router';

// Reusable TaskItem Component
const TaskItem = ({ item, index }) => {
  return (
    <Pressable
      onPress={() => router.push({ pathname: "/tasksdetails", params: { task_id: item.task_id } })}
      style={{ width: '100%', flexDirection: 'column', padding: sizes.marginSM + 5 }}
    >
      <View style={[styles.taskCard, index === 0 ? styles.firstTaskCard : styles.otherTaskCard]}>
        <View style={index === 0 ? styles.highlightedTask : styles.normalTask}>
          <Text style={{ textAlign: 'center', color: index === 0 ? uiColors.dark : uiColors.white }}>
            {item?.priority}
          </Text>
        </View>
        <Text style={index === 0 ? styles.highlightedTitle : styles.normalTitle}>{item?.title}</Text>
        <View style={styles?.taskInfo}>
          <Calendar size="26" color={index === 0 ? uiColors.dark : uiColors.white} />
          <Text style={{ fontSize: sizes.fontSize[4], color: index === 0 ? uiColors.dark : uiColors.white }}>
            {formatDateAndTime(item?.created_at, 'date')}
          </Text>
        </View>
        <View style={styles?.subTaskContainer}>
          <View style={styles?.subTaskInfo}>
            <Octicons name="checklist" size={22} color={uiColors.dark_tint} />
            <Text style={styles?.subTaskText}>0</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  taskCard: {
    maxHeight: 250,
    borderRadius: 10,
    padding: sizes.marginSM,
    flexDirection: 'column',
    gap: 20,
  },
  firstTaskCard: {
    backgroundColor: uiColors.light_blue,
  },
  otherTaskCard: {
    backgroundColor: "#313030",
    elevation: 5,
  },
  highlightedTask: {
    backgroundColor: 'white',
    maxWidth: 70,
    padding: 10,
    borderRadius: 30,
  },
  normalTask: {
    backgroundColor: "#4e4f4e",
    maxWidth: 70,
    padding: 10,
    borderRadius: 30,
  },
  highlightedTitle: {
    color: uiColors.dark,
    fontSize: sizes.fontSize[5] * 1.5,
  },
  normalTitle: {
    color: uiColors.white,
    fontSize: sizes.fontSize[5] * 1.5,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  subTaskContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  subTaskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  subTaskText: {
    fontSize: sizes.fontSize[3],
    color: uiColors.dark_tint,
  },
});
