import { subtask } from "@/@types";
import DatePickerComponent from "@/components/core-ui/datepicker";
import TextAreaComponent from "@/components/core-ui/textArea";
import TextInputComponent from "@/components/core-ui/textinput";
import { uiColors } from "@/constants/Colors";
import { sizes } from "@/constants/fonts&sizes";
import { useUserContext } from "@/context/context";
import { formatDateAndTime, timeToTimestamp } from "@/utils";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Index() {
  const priorities = ["Low", "Medium", "High"];

  const { userData, loading, setLoading } = useUserContext();
  const { tasks, setTasks, task, getSingleTasks,editTask } = useUserContext();
  const { taskId } = useLocalSearchParams();
  const [selectedPriority, setSelectedPriority] = useState(
    task?.priority || "Low"
  );

  useEffect(() => {
    getSingleTasks(taskId as string);
 
  }, []);




  return (
    <SafeAreaView
      style={{
        backgroundColor: uiColors.dark,
        flex: 1,
        paddingHorizontal: sizes.marginSM,
        paddingVertical: sizes.marginSM * 1.5,
      }}
    >
      <StatusBar barStyle="light-content" />
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
        "Edit Task 🎯"
      </Text>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Formik
          enableReinitialize
          initialValues={{
            title: task?.title || "",
            description: task?.description || "",
            due_date: task?.due_date || "",
            time: timeToTimestamp(task?.time) || "",
            priority: task?.priority || selectedPriority,
          }}
          onSubmit={async (values, { resetForm }) => {
            const requestData = {
              ...values,
              due_date: formatDateAndTime(values.due_date, "date"),
              time: formatDateAndTime(values.time, "time"),
              priority: selectedPriority,
            };
            await editTask(requestData,taskId as string);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            values,
            touched,
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
                    {taskId ? "Update Task" : "Create Task"}
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
