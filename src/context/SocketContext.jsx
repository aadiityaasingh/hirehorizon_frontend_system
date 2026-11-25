import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { BASE_URL, MESSAGE_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { toast } from "sonner";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Chat window state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState(null); // { _id, fullname, email, role, profile }

  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await axios.get(`${MESSAGE_API_END_POINT}/unread`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch {
      // quiet fail if not logged in
    }
  }, [user]);

  // Connect / disconnect socket based on user
  useEffect(() => {
    if (user?._id) {
      const newSocket = io(BASE_URL, {
        query: {
          userId: user._id,
        },
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        // Connected
      });

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      newSocket.on("newMessage", (message) => {
        // If chat is open with sender, don't increment unread count
        setActiveChatUser((currentUser) => {
          if (!currentUser || currentUser._id !== message.sender) {
            setUnreadCount((prev) => prev + 1);
            toast.info(`New message received`);
          }
          return currentUser;
        });
      });

      setSocket(newSocket);
      fetchUnreadCount();

      return () => {
        newSocket.close();
      };
    } else {
      setSocket((prev) => {
        if (prev) prev.close();
        return null;
      });
      setOnlineUsers([]);
      setUnreadCount(0);
    }
  }, [user, fetchUnreadCount]);

  const openChatWith = useCallback((targetUser) => {
    if (!targetUser) {
      setIsChatOpen(true);
      return;
    }
    setActiveChatUser(targetUser);
    setIsChatOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  const refreshUnreadCount = useCallback(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        unreadCount,
        isChatOpen,
        setIsChatOpen,
        activeChatUser,
        setActiveChatUser,
        openChatWith,
        closeChat,
        refreshUnreadCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
