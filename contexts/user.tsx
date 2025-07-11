import React, { createContext, useReducer, useEffect } from "react";
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
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  fetchUserProfile: () => Promise<void>;
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
  login: () => {},
  logout: () => {},
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
  const { latitude, longitude, address, error, loading } = useCurrentLocation();
  const router = useRouter();

  const login = async (userData: User) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      dispatch({ type: "LOGIN", payload: userData });
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserProfile = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    if (accessToken) {
      try {
        const response = await axios.get(config?.API_URL + "/profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const userProfile = response?.data?.data || {};
        await AsyncStorage.setItem("user", JSON.stringify(userProfile));
        dispatch({ type: "LOGIN", payload: userProfile });
      } catch (error) {
        showToast("error", "Session expired. Please login again.");
        logout();
      }
    } else {
      logout();
    }
  };

  useEffect(() => {
    fetchUserProfile();
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
      value={{ user, login, logout, fetchUserProfile, location }}
    >
      {children}
      <Toast />
    </UserContext.Provider>
  );
};
