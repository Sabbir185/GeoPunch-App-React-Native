import React, { createContext, useReducer, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { showToast } from "@/services/toastConfig";
import { useRouter } from "expo-router";
import config from "@/config";
import useCurrentLocation from "@/hooks/useCurrentLocation";

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  checkStatus: string;
  image: string;
  totalActiveTime: string;
  token: string;
  gender: string;
  dateOfBirth: string | Date;
  designation: string;
  department: string;
  activityStatus: string;
  activityLog: any; // Adjust type as needed
}

interface UserContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, authToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserProfile: (tokenOverride?: string) => Promise<any>;
  location: {
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    error: string | null;
    loading: boolean;
  };
}

export const UserContext = createContext<UserContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  fetchUserProfile: async () => {},
  location: {
    latitude: null,
    longitude: null,
    address: null,
    error: null,
    loading: true,
  },
});

type Action = { type: "LOGIN"; payload: User } | { type: "LOGOUT" };

const userReducer = (state: User | null, action: Action): User | null => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      return null;
    default:
      return state;
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, dispatch] = useReducer(userReducer, null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { latitude, longitude, address, error, loading } = useCurrentLocation();
  const router = useRouter();

  const login = async (userData: User, authToken?: string) => {
    try {
      if (authToken) {
        await AsyncStorage.setItem("token", authToken);
        setToken(authToken);
      }
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      dispatch({ type: "LOGIN", payload: userData });
    } catch (error) {
      console.log("Error in login context:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["user", "token"]);
      setToken(null);
      dispatch({ type: "LOGOUT" });
      router.replace("/login");
    } catch (error) {
      console.log("Error in logout context:", error);
    }
  };

  const fetchUserProfile = async (tokenOverride?: string) => {
    const accessToken =
      tokenOverride || token || (await AsyncStorage.getItem("token"));
    if (!accessToken) {
      await logout();
      return null;
    }

    try {
      const response = await axios.get(config?.API_URL + "/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 10000,
      });
      const userProfile = response?.data?.data || response?.data || {};
      if (userProfile && (userProfile.id || userProfile.email || userProfile.name)) {
        await AsyncStorage.setItem("user", JSON.stringify(userProfile));
        dispatch({ type: "LOGIN", payload: userProfile });
      }
      return userProfile;
    } catch (error: any) {
      console.log(
        "fetchUserProfile error:",
        error?.response?.status,
        error?.message
      );
      // Only logout if server explicitly says 401 Unauthorized
      if (error?.response?.status === 401) {
        showToast("error", "Session expired. Please login again.");
        await logout();
      }
      // On network errors or timeouts, do NOT log out! Keep using cached user session.
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("user"),
        ]);

        if (storedToken) {
          if (isMounted) setToken(storedToken);
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              if (isMounted) {
                dispatch({ type: "LOGIN", payload: parsedUser });
              }
            } catch (e) {
              console.log("Failed to parse cached user:", e);
            }
          }
          // Refresh profile in background without blocking initial state or logging out on network failure
          fetchUserProfile(storedToken);
        } else {
          if (isMounted) {
            dispatch({ type: "LOGOUT" });
          }
        }
      } catch (err) {
        console.log("Error initializing auth state:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const location = {
    latitude,
    longitude,
    address,
    error,
    loading,
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        fetchUserProfile,
        location,
      }}
    >
      {children}
      <Toast />
    </UserContext.Provider>
  );
};
