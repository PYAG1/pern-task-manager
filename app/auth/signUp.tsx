import { userData } from "@/@types";
import TextInputComponent from "@/components/core-ui/textinput";
import { uiColors } from "@/constants/Colors";
import { sizes } from "@/constants/fonts&sizes";
import axios from "axios";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Index() {
  const [loading, setLoading] = useState(false);

  const signUp = async (username: string, password: string, email: string) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/register`,
        {
          username: username,
          password: password,
          email: email,
        }
      );

      if (res?.data?.status) {
        Toast.show({
          type: "success",
          text1: `${res?.data?.message}`,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: uiColors.dark,
        width: sizes.screenWidth,
      }}
    >
      <KeyboardAvoidingView
    
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
  
            paddingVertical: sizes.marginSM * 2,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              width: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              marginBottom: sizes.marginSM * 2,
            }}
          >
            <Image
              source={require("../../assets/images/LOGO.png")}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
            <Text
              style={{
                color: uiColors.light_blue,
                fontSize: sizes.fontSize[5] * 2,
              }}
            >
              SupTasks
            </Text>
            <Text
              style={{ color: uiColors.dark_tint, fontSize: sizes.fontSize[4] }}
            >
              Achieve More, Stress Less
            </Text>
          </View>

          <View style={{ width: "100%", padding: sizes.marginSM }}>
            <Text
              style={{ fontSize: sizes.fontSize[5], color: uiColors.light_blue }}
            >
              Sign Up to get started!
            </Text>
          </View>

          <Formik
            initialValues={{
              username: "",
              password: "",
              email: "",
            }}
            onSubmit={async (values, { resetForm }) => {
              await signUp(values.username, values.password, values.email);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              errors,
              values,
              touched,
            }) => (
              <View
                style={{
                  flexDirection: "column",
                  gap: 35,
                  width: "100%",
                  paddingHorizontal: sizes.marginSM  * 1.5,
                }}
              >
                <TextInputComponent
                  label="Your Username"
                  placeholder="johnDoe123"
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  id={"username"}
                  errors={errors}
                  touched={touched}
                />
                <TextInputComponent
                  label="Your Email Address"
                  placeholder="johndoe@gmail.com"
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  id={"email"}
                  errors={errors}
                  touched={touched}
                />
                <TextInputComponent
                  label="Choose a Password"
                  placeholder="min * characters"
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  id={"password"}
                  errors={errors}
                  type="password"
                  touched={touched}
                />
                <Pressable onPress={() => router.push("/auth/signIn")}>
                  <Text
                    style={{
                      fontSize: sizes.fontSize[2],
                      textDecorationLine: "underline",
                      color: uiColors.white,
                    }}
                  >
                    Have an account?
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleSubmit as any}
                  disabled={loading} // Disable the button when loading
                  style={{
                    width: "100%",
                    backgroundColor: loading
                      ? uiColors.dark_tint
                      : uiColors.light_blue, // Show a different color if loading
                    padding: sizes.marginSM * 1.2,
                    borderRadius: 200,
                    position: "relative",
                  }}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={uiColors.dark_tint} />
                  ) : (
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "500",
                        fontSize: sizes.fontSize[3],
                        color:uiColors.dark_light
                      }}
                    >
                      Continue
                    </Text>
                  )}
                </Pressable>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
