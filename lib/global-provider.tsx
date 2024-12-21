import {createContext, ReactNode, useContext} from "react";
import {useAppWrite} from "@/lib/useAppWrite";
import {getCurrentUser} from "@/lib/appwrite";

interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

interface GlobalContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  refetch: (newParams?: Record<string, string | number>) => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: userData,
    loading,
    refetch
  } = useAppWrite({
    fn: getCurrentUser,
  })

  const user: User | null = userData ? {
    $id: userData.$id,
    name: userData.name,
    email: userData.email,
    avatar: userData.avatar
  } : null

  const isLoggedIn = !!user

  return (
    <GlobalContext.Provider value={{
      isLoggedIn,
      user,
      loading,
      refetch
    }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () : GlobalContextType => {
  const context = useContext(GlobalContext);

  if (!context) throw new Error("useGlobalContext must be used within global context");

  return context;
}

export default GlobalProvider;