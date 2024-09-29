import { uiColors } from "@/constants/Colors";
import { sizes } from "@/constants/fonts&sizes";
import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import user from "../../assets/images/user.png";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ArrowRight } from "iconsax-react-native";
import { router } from "expo-router";
import { useUserContext } from "@/context/context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {

const {userData,setLoading,stats,getStats}=useUserContext()
useEffect(()=>{
  getStats()
},[])

const LogoutButtonAlert = async () =>
  Alert.alert("Logout", "Are you sure you want to logout?", [
    {
      text: "Cancel",
      onPress: () => console.log(""),
      style: "cancel",
    },
    {
      text: "OK",
      onPress: () => {
   AsyncStorage.removeItem("userData")
   router.replace("/auth/signIn")
      },
    },
  ]);



  const navigationOptions = [
    {
      title: "Details",
      icon: <MaterialCommunityIcons name="account-details" size={24} color={uiColors.dark_light} />,
      action: () => {

      },
    },
    {
      title: "Support",
      icon: <MaterialIcons name="support" size={28} color={uiColors.dark_light} />,
      action: () => {

      },
    },
    {
      title: "Change Password",
      icon: <MaterialIcons name="password" size={28} color={uiColors.dark_light} />,
      action: () => {
        router.push("/changePassword")
      },
    },
    {
      title: "Logout",
      icon: <MaterialIcons name="logout" size={28} color={uiColors.dark_light} />,
      action: () => {
        LogoutButtonAlert()
      },
    },
  ];

  const Separator = () => (
    <View style={{ width: "100%", paddingHorizontal: sizes.marginSM }}>
      <View style={{ borderWidth: 1, borderColor: uiColors.light_blue }} />
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: uiColors.dark,
        padding: sizes.marginSM,
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <View
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            backgroundColor: uiColors.light_blue,
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <Image
            source={user}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "cover",
            }}
          />
        </View>
        <View>
          <Text
            style={{
              fontSize: sizes.fontSize[5],
              color: uiColors.white,
              fontWeight: "900",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
         {userData?.user.username}
          </Text>
          <Text
            style={{
              fontSize: sizes.fontSize[3],
              color: uiColors.dark_tint,
              textAlign: "center",
            }}
          >
          {userData?.user.email}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          justifyContent: "space-between",
          flexDirection: "row",
          marginTop: sizes.marginSM * 2,
          paddingHorizontal:sizes.marginSM
        }}
      >
        {stats?.map((item,index) => (
          <View
            key={index}
            style={{ justifyContent: "center", alignItems: "center", gap: 10 }}
          >
            <Text
              style={{
                color: uiColors.white,
                fontSize: sizes.fontSize[5] * 1.2,
                fontWeight: "700",
              }}
            >
              {item.stat}
            </Text>
            <Text style={{ color: uiColors.white, fontSize: sizes.fontSize[3] }}>
              {item.title}
            </Text>
          </View>
        ))}
      </View>
      <View style={{ width: "100%", marginTop: sizes.marginSM * 2 }}>
        <View
          style={{
            backgroundColor: uiColors.dark_light,
            flexDirection: "column",
            gap: 10,
            borderRadius: 15,
            borderWidth: 1,
            borderColor: uiColors.light_blue, 
          }}
        >
          {navigationOptions.map((item, index) => (
            <React.Fragment key={item.title}>
              <Pressable
                style={{
                  padding:12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent:"space-between",
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
                onPress={item.action}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 45,
                      height: 45,
                      backgroundColor: "white",
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {item.icon}
                  </View>
                  <Text style={{ color: "white", marginLeft: 10 }}>{item.title}</Text>
                </View>
                <ArrowRight size="32" color={uiColors.dark_tint }/>
              </Pressable>
              {/* Add separator after Support and Change Password */}
              {(index === 1 || index === 2 || index === 0) && <Separator />}
            </React.Fragment>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
