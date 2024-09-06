// CustomTabBar.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, uiColors } from "@/constants/Colors";
import { sizes } from "@/constants/fonts&sizes";

// Define your TabBarIcon component here or import it if it's already defined elsewhere.
const TabBarIcon = ({ focused, icon: Icon, color }) => (
  <Icon
    size="26"
    variant={focused ? "Bold" : "Linear"}
    color={color}
  />
);

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabButtons}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (route.name === 'createTask') {
            return null; // Don't render the createTask tab button here
          }

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
            >
              {options.tabBarIcon && (
                <TabBarIcon
                  focused={isFocused}
                  icon={options.tabBarIcon}
                  color={Colors.light.background}
                />
              )}
              <Text style={{ color: isFocused ? Colors.light.tint : "#aaa" }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Custom Button */}
      <TouchableOpacity
        style={styles.customButton}
        onPress={() => {
          // Handle custom button press here
        }}
      >
        <Text style={styles.customButtonText}>Custom</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: uiColors.dark,
    height: sizes.screenHeight / 10,
    borderTopWidth: 0,
    paddingHorizontal: sizes.marginSM,
    position: "relative",
  },
  tabButtons: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  customButton: {
    position: "absolute",
    bottom: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: uiColors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Adds shadow for Android
    shadowColor: "#000", // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  customButtonText: {
    color: uiColors.dark,
    fontWeight: "bold",
  },
});

export default CustomTabBar;
