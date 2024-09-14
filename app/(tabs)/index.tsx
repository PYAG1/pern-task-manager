import DateTimePicker from "@react-native-community/datetimepicker"; // Import the DatePicker
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { uiColors } from "@/constants/Colors";
import { sizes } from "@/constants/fonts&sizes";
import { useUserContext } from "@/context/context";
import { router } from "expo-router";

export default function HomeScreen() {
  const [days, setDays] = useState([]);
  const [currentDay, setCurrentDay] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date()); // Track the selected day
  const [showCalendar, setShowCalendar] = useState(false); // Modal visibility for calendar
  const [showDatePicker, setShowDatePicker] = useState(false); // DatePicker state
const {getData}=useUserContext()
  // Helper function to format the day as 'Day Date' (e.g., 'Mon 19')
  const formatDay = (date) => {
    return {
      dayOfWeek: date.toLocaleDateString("en-US", { weekday: "short" }), // Format day (e.g., 'Mon')
      dayOfMonth: date.toLocaleDateString("en-US", { day: "numeric" }), // Format date (e.g., '19')
    };
  };

  // Function to generate the week (Sunday to Saturday) containing the current day
  const generateWeekDays = (currentDate) => {
    const dayList = [];
    const dayOfWeek = currentDate.getDay(); // Get the current day of the week (0 for Sunday, 6 for Saturday)

    // Get the Sunday of the current week
    const sunday = new Date(currentDate);
    sunday.setDate(currentDate.getDate() - dayOfWeek);

    // Generate the days from Sunday to Saturday
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(sunday);
      newDate.setDate(sunday.getDate() + i); // Add i days to Sunday
      const formattedDate = formatDay(newDate);
      dayList.push({
        key: i.toString(), // Unique key
        date: newDate,
        dayOfWeek: formattedDate.dayOfWeek,
        dayOfMonth: formattedDate.dayOfMonth,
      });
    }

    setDays(dayList);
    setSelectedDay(dayList[0].date); // Set the first day (Sunday) as default
  };

  useEffect(() => {
    // Generate the initial week
    generateWeekDays(new Date());

    // Set an interval to check every 60 seconds (60000 ms) if the day has changed
    const intervalId = setInterval(() => {
      const now = new Date();
      if (now.getDate() !== currentDay.getDate()) {
        setCurrentDay(now); // Update the current day
        generateWeekDays(now); // Regenerate the list of days for the new week
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId); // Cleanup the interval on unmount
  }, [currentDay]);

  // Function to handle when a date is clicked
  const handleDayPress = (day) => {
    setSelectedDay(day.date); 
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDay(selectedDate); 
      generateWeekDays(selectedDate)
    }
  };
useEffect(()=>{

  getData()
},[])
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
{
    selectedDay?.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric"
      })
   }
</Text>

        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          horizontal
        >
          {days.map((item) => (
            <Pressable
              key={item.key} // Ensure a unique key is provided
              style={[
                styles.dayContainer,
                item?.date.toDateString() === selectedDay?.toDateString()
                  ? styles.selectedDay
                  : null,
              ]}
              onPress={() => handleDayPress(item)}
            >
              <View style={styles.dateView}>
                <Text style={styles.dayOfWeekText}>{item.dayOfWeek}</Text>
                <Text
                  style={[
                    styles.dayOfMonthText,
                    item?.date.toDateString() === selectedDay?.toDateString()
                      ? styles.selectedDayText
                      : null,
                  ]}
                >
                  {item.dayOfMonth}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* More Button */}
        <View style={styles.moreButtonContainer}>
          <Pressable
            style={styles.moreButton}
            onPress={() => setShowDatePicker(true)} // Show the DatePicker when More is pressed
          >
            <Text style={styles.moreButtonText}>More</Text>
          </Pressable>
        </View>

        {showDatePicker && (
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDay || new Date()} // Use selectedDay or default to current date
              mode="date"
              is24Hour={true}
              display="calendar"
              onChange={handleDateChange}
             
            />
          </View>
        )}
      </View>

      {/* Display content for the selected day */}
      <View style={styles.contentContainer}>
        {selectedDay ? (
          <Text style={styles.contentText}>
            Content for{" "}
            {selectedDay.toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
            })}
          </Text>
        ) : (
          <Text style={styles.contentText}>Select a day to see content</Text>
        )}
      </View>
      <Pressable onPress={()=>{
router.navigate("/onboarding")
      }}>
        <Text>Go to onboardin</Text>
      </Pressable>
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
    marginBottom:10,
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
  contentContainer: {
    marginTop: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    width: "90%",
    alignSelf: "center",
  },
  contentText: {
    fontSize: 16,
    color: "#333",
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
    right:15,

    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: uiColors.dark, // Optional: to match the screen background
    paddingBottom: sizes.marginSM, // Optional: for padding below the DatePicker
  },
});
