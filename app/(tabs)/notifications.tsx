import { uiColors } from '@/constants/Colors';
import { sizes } from '@/constants/fonts&sizes';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Notifications() {
  const [notificationsOn, setNotificationsOn] = useState(true); // Check if notifications are enabled
  const notifications = [
    {
      id: 1,
      title: 'Event Reminder',
      email: 'user@example.com',
      date: '2024-09-06',
    },
    {
      id: 2,
      title: 'New Event Posted',
      email: 'info@campusconnect.com',
      date: '2024-09-05',
    },
  ]; // Example notifications array, you can replace this with your dynamic data

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: uiColors.dark, padding: sizes.marginSM }}>
      <Text
        style={{
          marginTop: sizes.marginSM,
          color: uiColors.white,
          fontSize: sizes.fontSize[4] * 2,
          fontWeight: '500',
        }}
      >
        Notifications 🔔
      </Text>

      {!notificationsOn ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: uiColors.white, fontSize: sizes.fontSize[3] ,textAlign:"center"}}>
            Notifications are turned off. Please enable them in the profile page.
          </Text>
          <Pressable
            onPress={() => {
              router.navigate("/(tabs)/profile")
            }}
            style={{
              marginTop: sizes.marginSM,
              padding: sizes.marginSM,
              backgroundColor: uiColors.light_blue,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: uiColors.dark}}>Go to Profile</Text>
          </Pressable>
        </View>
      ) : notifications.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: uiColors.white, fontSize: sizes.fontSize[3] }}>
            No Notifications
          </Text>
        </View>
      ) : (
        <ScrollView style={{ marginTop: sizes.marginSM }}>
          {notifications.map((notification) => (
            <View
              key={notification.id}
              style={{
                backgroundColor: uiColors.dark_light,
                borderRadius: 10,
                padding: sizes.marginSM,
                marginBottom: sizes.marginSM,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flexDirection: 'column' }}>
                <Text
                  style={{
                    color: uiColors.white,
                    fontSize: sizes.fontSize[3],
                    fontWeight: '600',
                  }}
                >
                  {notification.title}
                </Text>
                <Text style={{ color: uiColors.dark_tint, fontSize: sizes.fontSize[2] }}>
                  {notification.email}
                </Text>
              </View>
              <Text
                style={{
                  color: uiColors.dark_tint,
                  fontSize: sizes.fontSize[2],
                }}
              >
                {notification.date}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
