import DatePickerComponent from "@/components/core-ui/datepicker";
import TextAreaComponent from "@/components/core-ui/textArea";
import TextInputComponent from "@/components/core-ui/textinput";
import { uiColors } from "@/constants/Colors";
import { sizes } from "@/constants/fonts&sizes";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Index() {
  const priorities = ["Low", "Medium", "High"];
  const [selectedPriority, setSelectedPriority] = useState("Low");

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
        <Pressable onPress={()=> router.navigate("/(tabs)/")}>
          <AntDesign name="back" size={24} color="white" />
        </Pressable>
      </View>
  <Text style={{
    marginTop:sizes.marginSM,
        color: uiColors.white,
        fontSize: sizes.fontSize[4] * 2,
           fontWeight:"400"
  }}>
    New Task 🎯
  </Text>
      <Formik
        initialValues={{
          title: "",
          description: "",
          due_date: "",
          time: "",
          priority: "",
        }}
        onSubmit={async (values, { resetForm }) => {
          if (!location) {
            alert("Please select a location.");
            return;
          }

          console.log("new", values);

          resetForm();
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
              {priorities?.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    flexDirection: "row",
                    padding: sizes.marginSM,
                    justifyContent: "center",
                    alignItems: "center",
                    minWidth: 125,
                    borderRadius:10,
                    backgroundColor:
                      selectedPriority === item ? uiColors.light_blue : "transparent",
                  }}
                  onPress={() => {
                    setSelectedPriority(item);
                  }}
                >
                  <Text
                    style={{
                      color: selectedPriority === item ? uiColors.dark : "white",
                    }}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
}
 