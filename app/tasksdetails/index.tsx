import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  ScrollView,
  RefreshControl,
  TextInput,
  Alert,
} from "react-native";
import { uiColors } from "@/constants/Colors";
import { sizes } from "@/constants/fonts&sizes";
import { ArrowLeft2, Calendar, Check, Edit2, Task, Trash } from "iconsax-react-native";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useUserContext } from "@/context/context";
import Toast from "react-native-toast-message";
import { subtask } from "@/@types";
import RBSheet from "react-native-raw-bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator } from "react-native-paper";
import { Entypo, Feather } from "@expo/vector-icons";
import { formatDateAndTime } from "@/utils";
import { Check as CheckIcon } from '@tamagui/lucide-icons'
import { CheckboxProps, XStack,Checkbox, Label } from "tamagui";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const [showFullDescription, setShowFullDescription] = useState(false);
  const {
    userData,
    loading,
    setLoading,
    getAllTasks,
    getSingleTasks,
    task,
    setTask,
    editTask,
    subtasks,
    setSubtasks,
  } = useUserContext();
  const { task_id, title,due_date  } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);

  const refRBSheet = useRef<any>();
  const [subtask, setSubtask] = useState<subtask>({
    subtask_id: Math.ceil(Math.random() * 10000),
    title: "",
    is_completed: false,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    getSingleTasks(task_id as string);
  }, []);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  const openBottomSheet = () => {
    setIsVisible(true);
    refRBSheet.current.open();
  };

  const closeBottomSheet = () => {
    setIsVisible(false);
    refRBSheet.current.close();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getSingleTasks(task_id as string);
    setRefreshing(false);
  };
  const handleAddSubtask = useCallback(() => {
    if (subtask.title.trim() === "") return;

    const newSubtask = {
      subtask_id: Math.ceil(Math.random() * 10000),
      title: subtask.title,
      is_completed: false,
    };

    setSubtasks((prev) => [...prev, newSubtask]);
    Toast.show({ type: "success", text1: "Subtask added successfully" });
    setSubtask({
      subtask_id: Math.ceil(Math.random() * 10000),
      title: "",
      is_completed: false,
    });
    closeBottomSheet();
  }, [subtask]);

  const handleDeleteSubtask = useCallback((subtask_id: number) => {
    setSubtasks((prev) =>
      prev.filter((subtask) => subtask.subtask_id !== subtask_id)
    );
    Toast.show({ type: "success", text1: "Subtask deleted successfully" });
  }, []);

  const handleToggleCompletion = useCallback((subtask_id: number) => {
    setSubtasks((prev) =>
      prev.map((subtask) =>
        subtask.subtask_id === subtask_id
          ? { ...subtask, is_completed: !subtask.is_completed }
          : subtask
      )
    );
  }, []);

  const deleteTask = async () => {
    try {
      const res = await axios.delete(
        `${process.env.EXPO_PUBLIC_API_URL}/tasks/${task_id}`,
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );
      if (res?.data?.status) {
        Toast.show({
          type: "success",
          text1: "Task deleted successfully",
        });
        router.back();
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
  const DeleleButtonAlert = async () =>
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      {
        text: "Cancel",
        onPress: () => console.log(""),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          deleteTask();
        },
      },
    ]);


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          backgroundColor: uiColors.light_blue,
          height: 300,
          padding: sizes.marginSM,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: sizes.marginSM * 3,
          }}
        >
          <Pressable
            onPress={async () => {
              await editTask(
                { ...task, subtasks: subtasks },
                task_id as string
              );
              router.navigate("/(tabs)/");
            }}
          >
            <ArrowLeft2 size="28" color={uiColors.dark} />
          </Pressable>
          <View style={{ flexDirection: "row", gap: 30 }}>
            <Pressable
              onPress={() => router.navigate(`/editTasks?taskId=${task_id}`)}
            >
              <Edit2 size="24" color={uiColors.dark} />
            </Pressable>
            <Pressable onPress={DeleleButtonAlert}>
              <Trash size="24" color={uiColors.dark} />
            </Pressable>
          </View>
        </View>
        <Text style={styles.headerText}>{title}</Text>

        <View style={styles.dateContainer}>
          <View style={styles.calendarIconContainer}>
            <Calendar size="24" color={uiColors.dark} variant="Outline" />
          </View>
          <View>
            <Text style={styles.dateLabel}>Due Date</Text>
            <Text style={styles.dateValue}>
              { formatDateAndTime(due_date, 'date')}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: uiColors.dark,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          padding: sizes.marginSM,
        }}
      >
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, activeTab === "overview" && styles.activeTab]}
            onPress={() => setActiveTab("overview")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "overview" && styles.activeTabText,
              ]}
            >
              Overview
            </Text>
            <View
              style={{
                width: "100%",
                borderBottomWidth: 2,
                marginTop: 10,
                borderColor:
                  activeTab === "overview"
                    ? uiColors.light_blue
                    : uiColors.dark_tint,
              }}
            ></View>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === "activity" && styles.activeTab]}
            onPress={() => setActiveTab("activity")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "activity" && styles.activeTabText,
              ]}
            >
              Activity
            </Text>
            <View
              style={{
                width: "100%",
                borderBottomWidth: 2,
                marginTop: 10,
                borderColor:
                  activeTab === "activity"
                    ? uiColors.light_blue
                    : uiColors.dark_tint,
              }}
            ></View>
          </Pressable>
        </View>
        <View style={styles.tabContent}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={uiColors.light_blue} />
            </View>
          ) : (
            <>
              {activeTab === "overview" ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                >
                  <View style={{ paddingHorizontal: 10, width: "100%" }}>
                    <Text
                      style={[
                        styles.contentText,
                        !showFullDescription && {
                          maxHeight: 60,
                          overflow: "hidden",
                        },
                      ]}
                      numberOfLines={showFullDescription ? undefined : 3}
                    >
                      {task?.description}
                    </Text>
                    {task?.description && task.description.length > 100 && (
                      <Pressable
                        onPress={toggleDescription}
                        style={styles.readMoreButton}
                      >
                        <Text style={styles.readMoreText}>
                          {showFullDescription ? "Read Less" : "Read More"}
                        </Text>
                      </Pressable>
                    )}

                    <Text
                      style={{
                        color: uiColors.dark_tint,
                        fontSize: sizes.fontSize[3],
                        marginVertical: sizes.marginSM,
                      }}
                    >
                      Subtask
                    </Text>
                    <View>
                      <View
                        style={{
                          flexDirection: "column",
                          gap: 10,
                          marginBottom: sizes.marginSM * 2,
                        }}
                      >
                        {subtasks?.map((item) => (
                          <SubtaskItem
                            key={item.subtask_id}
                            item={item}
                            onToggle={handleToggleCompletion}
                            onDelete={handleDeleteSubtask}
                          />
                        ))}
                      </View>
                      <Pressable
                        onPress={openBottomSheet}
                        style={{
                          backgroundColor: "transparent",
                          borderWidth: 1,
                          borderColor: uiColors.light_blue,
                          paddingHorizontal: sizes.marginSM,
                          paddingVertical: sizes.marginSM,
                          borderRadius: 10,
                          width: "100%",
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            color: uiColors.white,
                            fontSize: sizes.fontSize[3],
                          }}
                        >
                          Add Subtask
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </ScrollView>
              ) : (
                <Text style={styles.contentText}>Activity Content</Text>
              )}
            </>
          )}
          <RBSheet
            ref={refRBSheet}
            useNativeDriver={false}
            customStyles={{
              container: {
                backgroundColor: "transparent",

                height: 270,
              },
              wrapper: {
                backgroundColor: "rgba(0,0,0,0.5)",
              },
              draggableIcon: {
                backgroundColor: "#000",
              },
            }}
            customModalProps={{
              animationType: "slide",
              statusBarTranslucent: true,
            }}
            customAvoidingViewProps={{
              enabled: true,
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: uiColors.dark,
                borderRadius: 30,
                paddingHorizontal: sizes.marginSM,
                paddingVertical: sizes.marginSM + 5,
                flexDirection: "column",
                gap: 10,
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: uiColors.dark_light,
                    borderRadius: 100,
                    justifyContent: "center",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Task size="28" color={uiColors.light_blue} variant="Bulk" />
                </View>
                <Pressable onPress={closeBottomSheet}>
                  <Ionicons
                    name="close-outline"
                    size={24}
                    color={uiColors.dark_tint}
                  />
                </Pressable>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: sizes.fontSize[5] + 2,
                    marginBottom: 8,
                    color: uiColors.white,
                  }}
                >
                  Add a subtask
                </Text>
              </View>
              <View style={{ flexDirection: "column", gap: 15 }}>
                <TextInput
                  value={subtask?.title}
                  onChangeText={(text) =>
                    setSubtask((prev) => ({
                      subtask_id: Math.ceil(Math.random() * 10000),
                      title: text,
                      is_completed: false,
                    }))
                  }
                  placeholder="Add a subtask"
                  style={{
                    backgroundColor: uiColors.dark_light,
                    padding: sizes.marginSM,
                    borderRadius: 10,
                    color: uiColors.white,
                  }}
                  maxLength={50}
                />
                <Pressable
                  onPress={() => {
                    handleAddSubtask();
                  }}
                  style={{
                    width: "30%",
                    backgroundColor: uiColors.light_blue,
                    padding: sizes.marginSM,
                    borderRadius: 10,
                    alignSelf: "flex-end",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {false ? (
                      <ActivityIndicator animating={true} color={"white"} />
                    ) : (
                      <Text
                        style={{
                          textAlign: "center",

                          fontWeight: "600",
                          color: uiColors.dark,
                        }}
                      >
                        Add
                      </Text>
                    )}
                  </View>
                </Pressable>
              </View>
            </View>
          </RBSheet>
        </View>
      </View>
    </View>
  );
};

const SubtaskItem = React.memo(
  ({
    item,
    onToggle,
    onDelete,
  }: {
    item: subtask;
    onToggle: Function;
    onDelete: Function;
  }) => {
    return (
      <View
        style={{
          backgroundColor: uiColors.light_blue,
          borderWidth: 1,
          borderColor: uiColors.light_blue,
          paddingHorizontal: sizes.marginSM,
          paddingVertical: sizes.marginSM,
          borderRadius: 10,
          width: "100%",
          position: "relative",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
  
        <CheckboxWithLabel
          size="$4" 
          label={item.title}
          checked={item.is_completed}
          onCheckedChange={() => onToggle(item.subtask_id)}
        />

        <Pressable
          onPress={() => onDelete(item.subtask_id)}
          style={{ position: "absolute", right: 5, top: 5 }}
        >
          <Ionicons name="close-outline" size={20} color={uiColors.dark} />
        </Pressable>
      </View>
    );
  }
);



export function CheckboxWithLabel({
  size,
  label,
  checked,
  onCheckedChange,
  ...checkboxProps
}: CheckboxProps & { label?: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  const id = `checkbox-${(size || '').toString().slice(1)}`;
  
  return (
    <XStack width={300} alignItems="center" gap="$4">
      <Checkbox
        id={id}
        size={size}
        checked={checked} 
        onCheckedChange={onCheckedChange} 
        {...checkboxProps}
      >
        <Checkbox.Indicator>
        <CheckIcon color={uiColors.white}  />
        </Checkbox.Indicator>
      </Checkbox>

      {label && (
        <Label size={size} htmlFor={id} style={{color:uiColors.dark,fontWeight:"bold"}}>
          {label}
        </Label>
      )}
    </XStack>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: uiColors.light_blue,
  },
  headerText: {
    color: uiColors.dark,
    fontSize: sizes.fontSize[4] * 2,
    paddingTop: sizes.marginSM * 2,
    paddingHorizontal: sizes.marginSM,
    textAlign: "justify",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 0,
    marginBottom: sizes.marginSM,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tab: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 20,
    width: "50%",
  },
  activeTab: {},
  tabText: {
    color: uiColors.dark_tint,
    fontSize: sizes.fontSize[3],
  },
  activeTabText: {
    color: uiColors.white,
  },
  tabContent: {
    flex: 1,
  },
  contentText: {
    color: uiColors.white,
    fontSize: sizes.fontSize[2],
    textAlign: "justify",
    lineHeight: 20,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    alignItems: "center",
    marginTop: sizes.marginSM,
    paddingHorizontal: sizes.marginSM,
  },
  dateLabel: {
    fontSize: sizes.fontSize[2],
    color: uiColors.dark_light,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: sizes.fontSize[3],
    color: uiColors.dark,
    fontWeight: "bold",
  },
  calendarIconContainer: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: uiColors.dark,
    borderStyle: "dashed",
    borderRadius: 10000,
    justifyContent: "center",
    alignItems: "center",
  },
  readMoreButton: {
    marginTop: 5,
    alignSelf: "flex-start",
  },
  readMoreText: {
    color: uiColors.light_blue,
    fontSize: sizes.fontSize[2],
    fontWeight: "bold",
  },
});

export default Index;
