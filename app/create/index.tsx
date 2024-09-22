import DatePickerComponent from "@/components/core-ui/datepicker";
import TextAreaComponent from "@/components/core-ui/textArea";
import TextInputComponent from "@/components/core-ui/textinput";
import { uiColors } from "@/constants/Colors";
import { sizes } from "@/constants/fonts&sizes";
import { useUserContext } from "@/context/context";
import { formatDateAndTime } from "@/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Index() {
  const priorities = ["Low", "Medium", "High"];
  const [selectedPriority, setSelectedPriority] = useState("Low");
  const { userData, loading, setLoading } = useUserContext();

  interface TaskData {
    title: string;
    due_date: string;
    description?: string;
    time?: string;
    priority?: string;
  }

  const createTask = async (data: TaskData) => {
    if (!userData?.token) {
      Toast.show({
        type: "error",
        text1: "User is not authenticated. Please log in.",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: responseData } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/tasks`,
        data,
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );

      if (responseData?.status) {
        Toast.show({
          type: "success",
          text1: "Task Created Successfully!",
        });
        router.navigate("/(tabs)/");
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to Create Task",
          text2: responseData?.data?.message || "Unknown error",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      const errorStatus = error?.response?.status;

      console.error(`Error (${errorStatus}):`, errorMessage);

      Toast.show({
        type: "error",
        text1: "Error Creating Task",
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: uiColors.dark,
        flex: 1,
        paddingHorizontal: sizes.marginSM,
        paddingVertical: sizes.marginSM * 1.5,
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Pressable onPress={() => router.navigate("/(tabs)/")}>
          <AntDesign name="back" size={24} color="white" />
        </Pressable>
      </View>

      <Text
        style={{
          marginTop: sizes.marginSM,
          color: uiColors.white,
          fontSize: sizes.fontSize[4] * 2,
          fontWeight: "400",
        }}
      >
        New Task 🎯
      </Text>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Formik
          initialValues={{
            title: "",
            description: "",
            due_date: "",
            time: "",
            priority: selectedPriority,
          }}
          onSubmit={async (values, { resetForm }) => {
            console.log(values);
            const requestData = {
              ...values,
              due_date: formatDateAndTime(values.due_date, "date"),
              time: formatDateAndTime(values.time, "time"),
            };
            console.log("here", requestData);
          //  await createTask(requestData);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            values,
            touched,
            setFieldValue,
            isValid,
            dirty,
          }) => (
            <View
              style={{
                flexDirection: "column",
                gap: 10,
                width: "100%",
                marginTop: sizes.marginSM,
                paddingVertical: sizes.marginSM * 1.5,
              }}
            >
              <TextInputComponent
                placeholder="Title"
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                id={"title"}
                errors={errors}
                touched={touched}
              />
              <TextAreaComponent
                label={"Description"}
                placeholder="Enter description"
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                id={"description"}
                errors={errors}
                touched={touched}
              />

              <DatePickerComponent
                values={values}
                label={"Due Date"}
                id={"due_date"}
                handleChange={handleChange}
                touched={touched}
                Datemode={"date"}
                errors={errors}
              />

              <DatePickerComponent
                values={values}
                label={"Time"}
                id={"time"}
                handleChange={handleChange}
                touched={touched}
                Datemode={"time"}
                errors={errors}
              />

              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderRadius: 10,
                  padding: 8,
                  backgroundColor: uiColors.dark_light,
                  marginTop: sizes.marginSM * 2,
                }}
              >
                {priorities.map((item, index) => (
                  <Pressable
                    key={index}
                    style={{
                      flexDirection: "row",
                      padding: sizes.marginSM,
                      justifyContent: "center",
                      alignItems: "center",
                      minWidth: 125,
                      borderRadius: 10,
                      backgroundColor:
                        selectedPriority === item
                          ? uiColors.light_blue
                          : "transparent",
                    }}
                    onPress={() => setSelectedPriority(item)}
                  >
                    <Text
                      style={{
                        color:
                          selectedPriority === item ? uiColors.dark : "white",
                      }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Pressable
                onPress={() => handleSubmit()}
                disabled={loading || !(isValid && dirty)}
                style={{
                  width: "100%",
                  backgroundColor:
                    loading || !(isValid && dirty)
                      ? uiColors.dark_tint
                      : uiColors.light_blue,
                  padding: sizes.marginSM * 1.2,
                  borderRadius: 200,
                  position: "relative",
                  marginTop: sizes.marginSM * 3,
                }}
              >
                {loading ? (
                  <ActivityIndicator animating={true} color={"white"} />
                ) : (
                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: "500",
                      fontSize: sizes.fontSize[3],
                      color: uiColors.dark_light,
                    }}
                  >
                    Create
                  </Text>
                )}
              </Pressable>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
}
