import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { USER_ROUTES } from "../api/users/routes";

interface AuthState {
  access_token: string;
  refresh_token: string;
  expires: number;
}

interface AuthContextProps {
  authState: AuthState | null;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState | null>>;
  isFetching: boolean;
  isValid?: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isValid, setIsValid] = useState(true);

  const setAndStoreAuthState = async (newState: AuthState) => {
    setAuthState(newState);
    if (newState) {
      await AsyncStorage.setItem("authState", JSON.stringify(newState));
    } else {
      await AsyncStorage.removeItem("authState");
    }
  };

  const refreshAuth = async (refreshToken: string) => {
    try {
      const response = await api.post(
        USER_ROUTES.REFRESH_TOKEN,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      const data = await response.data;
      const oldState = await AsyncStorage.getItem("authState");

      const newAuthState: AuthState = {
        ...JSON.parse(oldState!),
        access_token: data.access_token,
        expires: data.expires,
      };

      setAndStoreAuthState(newAuthState);
    } catch (error) {
      setIsValid(false);
    }
  };

  useEffect(() => {
    const fetchTokens = async () => {
      const storedAuthState = await AsyncStorage.getItem("authState");
      if (storedAuthState) {
        await refreshAuth(JSON.parse(storedAuthState).refresh_token);
        const updatedState = await AsyncStorage.getItem("authState");
        setAuthState(JSON.parse(updatedState!));
      }
      setIsFetching(false);
    };

    fetchTokens();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState: setAndStoreAuthState as any,
        isFetching,
        isValid,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
