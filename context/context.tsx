import { subtask, TaskData, userData } from "@/@types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import Toast from "react-native-toast-message";

interface UserContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userData: userData | null;
  setUserData: React.Dispatch<React.SetStateAction<userData | null>>;
  tasks: TaskData[];
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>;
  subtasks: subtask[];
  setSubtasks: React.Dispatch<React.SetStateAction<subtask[]>>;
  getAllTasks: () => Promise<void>;
  getData: () => Promise<void>;
  getSingleTasks: (task_id: string | number) => Promise<void>;
  task: TaskData | null;
  setTask: React.Dispatch<React.SetStateAction<TaskData | null>>;
  editTask: (data: TaskData, taskId: string) => Promise<void>;
  setStats: React.Dispatch<React.SetStateAction<any[]>>;
  stats: any[];
  getStats: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};

interface UserContextProviderProps {
  children: ReactNode;
}
export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<userData | null>(null);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [subtasks, setSubtasks] = useState<subtask[]>([]);
  const [task, setTask] = useState<TaskData| null>(null);
  const [stats, setStats] = useState<any[]>([]);
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userData");
      jsonValue != null ? setUserData(JSON.parse(jsonValue)) : null;
      if (null) {
        router.navigate("/auth/signIn");
      }
    } catch (e) {
      router.navigate("/auth/signIn");
    }
  };

  const getAllTasks = async () => {
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      });
      if (res.data?.status) {
        setTasks(res.data?.data);
        // setSubtasks(res.data?.data?.subtasks);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      Toast.show({
        type: "error",
        text1: `${errorMessage} HERE`,
      });
    }
  };

  const getSingleTasks = async (task_id: string | number) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/tasks/${task_id}`,
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );
      if (res.data?.status) {
        setTask(res.data?.data);
        setSubtasks(res.data?.data?.subtasks);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      Toast.show({
        type: "error",
        text1: `${errorMessage} `,
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const editTask = async (data: TaskData, taskId: string) => {
    if (!userData?.token) {
      Toast.show({
        type: "error",
        text1: "User is not authenticated. Please log in.",
      });
      return;
    }

    setLoading(true);
    if (data?.subtasks) {
      if (
        data?.subtasks?.filter((subtask: subtask) => subtask.is_completed)
          .length === data?.subtasks?.length
      ) {
        data.status = "Completed";
      }
    }
    try {
      const { data: responseData } = await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/tasks/${taskId}`,
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
          text1: "Task Updated Successfully!",
        });
        router.navigate("/(tabs)/");
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to Update Task",
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
        text1: "Error Updating Task",
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
      getAllTasks();
    }
  };
  const getStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/getStats`,
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;

        setStats([
          { title: "Total", stat: data.totalTasks || 0 },
          { title: "Completed", stat: data.completedTasks || 0 },
          { title: "Pending", stat: data.totalTasks - data.completedTasks || 0 },
        ]);
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to fetch stats",
          text2: "Unknown error occurred.",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";

      Toast.show({
        type: "error",
        text1: "Error fetching stats",
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    getStats();
  }, []);
  return (
    <UserContext.Provider
      value={{
        loading,
        setLoading,
        userData,
        setUserData,
        tasks,
        setTasks,
        subtasks,
        setSubtasks,
        getAllTasks,
        getData,
        getSingleTasks,
        task,
        setTask,
        editTask,
        stats,
        setStats,
        getStats,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
