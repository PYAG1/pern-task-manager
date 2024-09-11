import { Children, createContext, useContext, useState } from "react";

const UserContext = createContext(null)

export const useUserContext=()=>{
    const context = useContext(UserContext)
    if (!context) {
        throw new Error("useUserContext must be used within a UserContextProvider");
      }
      return context 
}

export const UserContextProvider = ({children})=>{
const [loading,setLoading]= useState(false);
const [userData,setUserData]=useState();
const [tasks,SetTasks]=useState()

return <UserContext.Provider value={{}}>{children}</UserContext.Provider>
}