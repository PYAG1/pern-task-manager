import { userData } from "@/@types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import Toast from "react-native-toast-message";


interface UserContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  userData: userData | null;
  setUserData: React.Dispatch<React.SetStateAction<userData | null>>,
  tasks: any[];
  setTasks: (tasks: any[]) => void;
  subTasks: any[];
  setSubTasks: (subTasks: any[]) => void;
  getAllTasks: () => Promise<void>,
  getData: () => Promise<void>

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
  const [userData, setUserData] = useState<userData| null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [subTasks, setSubTasks] = useState<any[]>([]);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userData');
  jsonValue != null ? setUserData(JSON.parse(jsonValue)) : null;
      if(null){
        router.navigate("/auth/signIn")      
      }
    } catch (e) {
  router.navigate("/auth/signIn")
    }
  };
const getAllTasks=async ()=>{
  try {
    const res =await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/tasks`,{
      headers:{
        Authorization: `Bearer ${userData?.token}`
      }
    })
    if(res.data?.status){
      setTasks(res.data?.data)
    }
  } catch (error:any) {
    const errorMessage =
    error?.response?.data?.message ||
    error.message ||
    "An unexpected error occurred.";
  Toast.show({
    type: "error",
    text1: errorMessage,
  });
  }
}
useEffect(()=>{
getData()

},[])
  return (
    <UserContext.Provider
      value={{
        loading,
        setLoading,
        userData,
        setUserData,
        tasks,
        setTasks,
        subTasks,
        setSubTasks,
        getAllTasks,
        getData
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
