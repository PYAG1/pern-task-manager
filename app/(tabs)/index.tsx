import { Colors, uiColors } from "@/constants/Colors";
import { sizes } from "@/constants/fonts&sizes";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [days, setDays] = useState([]);
  const [currentDay, setCurrentDay] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null); // Track the selected day

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
    setSelectedDay(day.date); // Update the selected day
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Manage</Text>
        <Text style={styles.headerText}>your tasks ✏️</Text>
      </View>

   <View>
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
    marginBottom: sizes.marginSM,
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
    gap: 3,

  },
  dayContainer: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center", // Center the text vertically
  },
  selectedDay: {
    backgroundColor: uiColors.white, // Highlight selected day
  },
  dateView: {
    alignItems: "center", // Stack dayOfWeek and dayOfMonth vertically
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
    marginTop: 10, // Adjusted margin to reduce space
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    width: "90%",
    alignSelf: "center", // Center content container
  },
  contentText: {
    fontSize: 16,
    color: "#333",
  },
});
