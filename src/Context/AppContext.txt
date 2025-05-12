import {View, Text} from 'react-native';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
const AppContext = createContext<any>(null);

import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of the context
interface AppContextType {
  userAuthInfo: {
    user: string | null;
    setUser: React.Dispatch<React.SetStateAction<string | null>>;
  };
  tokenMemo: {
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
  };
  netConnection: {
    isConnected: boolean;
    setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  };
  loader: boolean;
}
interface AppProviderType {
  children: any;
}

export default function AppProvider({children}: AppProviderType) {
  const [user, setUser] = useState<string | null>(null);
  const [connection, setConnection] = useState<boolean | null>(true);
  const [token, setToken] = useState<String | null>(null);
  const [loader, setLoader] = useState<boolean>(true);

  useEffect(() => {
    checkUser();
    hideLoader();
  }, []);

  const checkUser = async () => {
    const loggedUser = await AsyncStorage.getItem('user');
    const storedToken = await AsyncStorage.getItem('token');
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
      setToken(storedToken);
    }
  };

  const hideLoader = () => {
    setTimeout(() => {
      setLoader(false);
    }, 600);
  };

  const userAuthInfo = useMemo(() => ({user, setUser}), [user]);
  const tokenMemo = useMemo(() => ({token, setToken}), [token]);
  const netConnection = useMemo(
    () => ({connection, setConnection}),
    [connection],
  );
  return (
    <AppContext.Provider
      value={{userAuthInfo, tokenMemo, netConnection, loader}}>
      {children}
    </AppContext.Provider>
  );
}
export const useAppContext = () => {
  return useContext(AppContext);
};
