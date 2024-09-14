import { Tabs } from "expo-router";
import React from "react";

import { Colors, uiColors } from "@/constants/Colors";
import { sizes } from "@/constants/fonts&sizes";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Add, Folder, Home2, User, Notification } from "iconsax-react-native";
import { Pressable, View, Text } from "react-native";
import CustomTabBar from "@/components/navigation/customTabBar";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs

      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: uiColors.dark,
          height: sizes.screenHeight / 10,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home2
              size="26"
              variant={focused ? "Bold" : "Linear"}
              color={Colors.light.background}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, focused }) => (
            <Folder
              size="26"
              variant={focused ? "Bold" : "Linear"}
              color={Colors.light.background}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="createTask"
        options={{
          title: "Create",
          href:"/create",
          
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                padding: sizes.marginSM,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: uiColors.white,
                borderRadius: 50,
              }}
            >
              <Add size="32" color={uiColors.dark} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color, focused }) => (
            <Notification
              size="26"
              variant={focused ? "Bold" : "Linear"}
              color={Colors.light.background}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <User
              size="26"
              variant={focused ? "Bold" : "Linear"}
              color={Colors.light.background}
            />
          ),
        }}
      />
    </Tabs>
  );
}
