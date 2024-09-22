import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { uiColors } from "@/constants/Colors";
import { sizes } from "@/constants/fonts&sizes";
import { useUserContext } from "@/context/context";
import axios from "axios";
import { formatDateAndTime } from "@/utils";
import TaskItem from "@/components/core-ui/taskItem";
import { RefreshControl } from 'react-native';
import { ActivityIndicator } from "react-native-paper";

export default function HomeScreen() {
  const [days, setDays] = useState([]);
  const [currentDay, setCurrentDay] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { userData } = useUserContext();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filterTasksByDate = async () => {
    setLoading(true);
    const formattedDate = formatDateAndTime(`${selectedDay}`, "date");
    console.log(formattedDate);
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/taskbyDate`, {
        params: { created_at: formattedDate },
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      });
      if (res.data?.status) {
        setTasks(res.data?.data);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const { getData } = useUserContext();

  const formatDay = (date) => {
    return {
      dayOfWeek: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayOfMonth: date.toLocaleDateString("en-US", { day: "numeric" }),
    };
  };

  const generateWeekDays = (currentDate) => {
    const dayList = [];
    const dayOfWeek = currentDate.getDay();
    const sunday = new Date(currentDate);
    sunday.setDate(currentDate.getDate() - dayOfWeek);

    for (let i = 0; i < 7; i++) {
      const newDate = new Date(sunday);
      newDate.setDate(sunday.getDate() + i);
      const formattedDate = formatDay(newDate);
      dayList.push({
        key: i.toString(),
        date: newDate,
        dayOfWeek: formattedDate.dayOfWeek,
        dayOfMonth: formattedDate.dayOfMonth,
      });
    }

    setDays(dayList);
    setSelectedDay(dayList[0].date);
  };

  useEffect(() => {
    generateWeekDays(new Date());
    const intervalId = setInterval(() => {
      const now = new Date();
      if (now.getDate() !== currentDay.getDate()) {
        setCurrentDay(now);
        generateWeekDays(now);
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [currentDay]);

  const handleDayPress = async (day) => {
    if (selectedDay?.toDateString() !== day.date.toDateString()) {
      setSelectedDay(day.date);
      console.log("Selected day:", day.date); // Debugging log
      await filterTasksByDate();
    }
  };

  const handleDateChange = async (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDay(selectedDate);
      generateWeekDays(selectedDate);
      await filterTasksByDate();
    }
  };

  useEffect(() => {
    getData();
    filterTasksByDate();
  }, []);

  useEffect(() => {
    if (selectedDay) {
      filterTasksByDate();
    }
  }, [selectedDay]);

  const onRefresh = async () => {
    setRefreshing(true);
    await filterTasksByDate();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Manage</Text>
        <Text style={styles.headerText}>your tasks ✏️</Text>
      </View>

      <View>
        <Text
          style={{
            paddingHorizontal: sizes.marginSM,
            paddingVertical: sizes.marginSM * 2,
            color: uiColors.light_blue,
            fontSize: sizes.fontSize[5] + 2,
            fontWeight: "700",
          }}
        >
          {selectedDay?.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </Text>

        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          horizontal
        >
          {days.map((item, index) => (
            <Pressable
              key={index}
              style={[styles.dayContainer, item?.date.toDateString() === selectedDay?.toDateString() ? styles.selectedDay : null]}
              onPress={() => handleDayPress(item)}
            >
              <View style={styles.dateView}>
                <Text style={styles.dayOfWeekText}>{item.dayOfWeek}</Text>
                <Text
                  style={[styles.dayOfMonthText, item?.date.toDateString() === selectedDay?.toDateString() ? styles.selectedDayText : null]}
                >
                  {item?.dayOfMonth}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.moreButtonContainer}>
          <Pressable
            style={styles.moreButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.moreButtonText}>More</Text>
          </Pressable>
        </View>

        {showDatePicker && (
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDay || new Date()}
              mode="date"
              is24Hour={true}
              display="calendar"
              onChange={handleDateChange}
            />
          </View>
        )}
      </View>

      <ScrollView
        style={styles.taskListContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading ? (
          <ActivityIndicator size="small" color={uiColors.white} />
        ) : tasks.length > 0 ? (
          tasks.map((item, index) => <TaskItem key={index} item={item} index={index} />)
        ) : (
          <Text style={styles.noTasksText}>No events found</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: uiColors.dark,
  },
  header: {
    padding: sizes.marginSM,
  },
  headerText: {
    color: uiColors.white,
    fontSize: sizes.fontSize[4] * 3,
  },
  scrollViewContent: {
    width: sizes.screenWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxHeight: 90,
    marginBottom: 10,
    gap: 3,
  },
  dayContainer: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  selectedDay: {
    backgroundColor: uiColors.white,
  },
  dateView: {
    alignItems: "center",
    gap: sizes.marginSM + 5,
    width: "100%",
    height: "100%",
    flexDirection: "column",
  },
  dayOfWeekText: {
    fontSize: 16,
    color: "#888888",
  },
  dayOfMonthText: {
    fontSize: sizes.fontSize[5] + 1,
    fontWeight: "500",
    color: uiColors.white,
  },
  selectedDayText: {
    color: "black",
    fontSize: sizes.fontSize[5] + 1,
    fontWeight: "500",
  },
  taskListContainer: {
    flex: 1,
  },
  noTasksText: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 16,
    marginTop: 20,
  },
  moreButtonContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: sizes.marginSM,
    position: "relative",
  },
  moreButton: {
    padding: sizes.marginSM,
  },
  moreButtonText: {
    color: uiColors.white,
  },
  datePickerContainer: {
    right: 15,
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: uiColors.dark,
    paddingBottom: sizes.marginSM,
  },
});
