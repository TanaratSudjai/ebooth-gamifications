// contexts/MemberContext.js
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

// Create context
const UserDataContext = createContext();

// Provider 
export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`/api/user/getAllUserData/${userId}`);
        const res_ac = await axios.get(`/api/activity`);
        setUserData(res.data);
        setActivity(res_ac.data.data);
        console.log(res.data);

      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId > 0) {
      fetchUserData();
    }
  }, [userId]);

  return (
    <UserDataContext.Provider value={{ userData, activity, loading }}>
      {children}
    </UserDataContext.Provider>
  );
};

// ✅ Custom hook to use context
export const useUserData = () => useContext(UserDataContext);