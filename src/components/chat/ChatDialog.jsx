import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSocket } from "@/context/SocketContext";
import { useSelector } from "react-redux";
import axios from "axios";
import { MESSAGE_API_END_POINT } from "@/utils/constant";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  X,
  MessageSquare,
  Users,
  Circle,
  Minimize2,
  Maximize2,
  Smile,
} from "lucide-react";
import { toast } from "sonner";

const ChatDialog = () => {
  const {
    socket,
    onlineUsers,
    isChatOpen,
    closeChat,
    activeChatUser,
    setActiveChatUser,
    refreshUnreadCount,
  } = useSocket();

  const { user: currentUser } = useSelector((store) => store.auth);

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = useCallback(async () => {
    if (!currentUser) return;
    setLoadingConversations(true);
    try {
      const res = await axios.get(`${MESSAGE_API_END_POINT}/conversations`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setConversations(res.data.conversations || []);
      }
    } catch (err) {
      console.error("Fetch conversations error:", err);
    } finally {
      setLoadingConversations(false);
    }
  }, [currentUser]);

  const fetchMessages = useCallback(
    async (userId) => {
      if (!userId || !currentUser) return;
      setLoadingMessages(true);
      try {
        const res = await axios.get(`${MESSAGE_API_END_POINT}/${userId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setMessages(res.data.messages || []);
          refreshUnreadCount();
        }
      } catch (err) {
        console.error("Fetch messages error:", err);
      } finally {
        setLoadingMessages(false);
      }
    },
    [currentUser, refreshUnreadCount]
  );

  // Load conversations when opened
  useEffect(() => {
    if (isChatOpen) {
      fetchConversations();
    }
  }, [isChatOpen, fetchConversations]);

  // Load messages whenever active user changes
  useEffect(() => {
    if (activeChatUser?._id && isChatOpen) {
      fetchMessages(activeChatUser._id);
    } else {
      setMessages([]);
    }
  }, [activeChatUser, isChatOpen, fetchMessages]);

  // Listen to real-time incoming messages via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMsg) => {
      if (
        activeChatUser &&
        (newMsg.sender === activeChatUser._id ||
          newMsg.sender?._id === activeChatUser._id)
      ) {
        setMessages((prev) => [...prev, newMsg]);
        // Also mark as read in backend
        axios.get(`${MESSAGE_API_END_POINT}/${activeChatUser._id}`, {
          withCredentials: true,
        }).catch(() => {});
        refreshUnreadCount();
      }
      fetchConversations();
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, activeChatUser, fetchConversations, refreshUnreadCount]);

  // Auto-scroll when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || !activeChatUser?._id) return;

    const messageContent = inputText.trim();
    setInputText("");

    // Optimistic message
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      sender: {
        _id: currentUser._id,
        fullname: currentUser.fullname,
        profile: currentUser.profile,
      },
      recipient: activeChatUser._id,
      message: messageContent,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await axios.post(
        `${MESSAGE_API_END_POINT}/send/${activeChatUser._id}`,
        { message: messageContent },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Replace temp message with server response
        setMessages((prev) =>
          prev.map((m) => (m._id === tempMessage._id ? res.data.data : m))
        );
        fetchConversations();
      }
    } catch (err) {
      console.error("Send message error:", err);
      toast.error(err.response?.data?.message || "Failed to send message");
      // Remove temp message if failed
      setMessages((prev) => prev.filter((m) => m._id !== tempMessage._id));
    }
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  if (!isChatOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end shadow-2xl rounded-2xl overflow-hidden font-sans">
      {/* Minimized bar */}
      {isMinimized ? (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-2xl flex items-center gap-3 cursor-pointer shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-2" onClick={() => setIsMinimized(false)}>
            <MessageSquare className="w-5 h-5" />
            <span className="font-semibold text-sm">
              {activeChatUser ? activeChatUser.fullname : "Messages"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <button
              onClick={() => setIsMinimized(false)}
              className="text-white/80 hover:text-white cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={closeChat}
              className="text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Full chat window */
        <div className="w-[360px] sm:w-[720px] h-[540px] bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden shadow-2xl">
          {/* Main Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <h2 className="font-bold text-sm">HireHoriZon Live Messaging</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 cursor-pointer"
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={closeChat}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left Column: Conversations List */}
            <div className="w-72 border-r border-gray-200 bg-gray-50/50 flex flex-col hidden sm:flex">
              <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Conversations
                </span>
                <Badge variant="outline" className="text-[10px] bg-white font-normal">
                  {conversations.length}
                </Badge>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {loadingConversations ? (
                  <div className="p-6 text-center text-xs text-gray-400">
                    Loading conversations...
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400 space-y-1">
                    <p>No active conversations yet.</p>
                    <p className="text-[11px] text-gray-400">
                      Reach out from candidate profiles or job listings!
                    </p>
                  </div>
                ) : (
                  conversations.map((conv) => {
                    const otherUser = conv.user;
                    const isOnline = isUserOnline(otherUser._id);
                    const isSelected = activeChatUser?._id === otherUser._id;

                    return (
                      <div
                        key={otherUser._id}
                        onClick={() => setActiveChatUser(otherUser)}
                        className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-blue-50/80 border-l-4 border-blue-600"
                            : "hover:bg-gray-100/70"
                        }`}
                      >
                        <div className="relative">
                          <Avatar className="w-9 h-9 border border-gray-200">
                            <AvatarImage
                              src={otherUser.profile?.profilePhoto}
                              alt={otherUser.fullname}
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">
                              {otherUser.fullname?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {isOnline && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-xs text-gray-900 truncate">
                              {otherUser.fullname}
                            </p>
                            {conv.unreadCount > 0 && (
                              <Badge className="bg-blue-600 text-white text-[10px] px-1.5 py-0 h-4">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 truncate mt-0.5">
                            {conv.lastMessage}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Active Conversation Pane */}
            <div className="flex-1 flex flex-col bg-white">
              {activeChatUser ? (
                <>
                  {/* Chat Subheader */}
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-8 h-8 border border-gray-200">
                        <AvatarImage
                          src={activeChatUser.profile?.profilePhoto}
                          alt={activeChatUser.fullname}
                        />
                        <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-bold">
                          {activeChatUser.fullname?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-xs text-gray-900">
                            {activeChatUser.fullname}
                          </h3>
                          <Badge
                            variant="outline"
                            className="text-[10px] capitalize px-1.5 py-0 border-gray-200 text-gray-600"
                          >
                            {activeChatUser.role || "Member"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <Circle
                            className={`w-2 h-2 fill-current ${
                              isUserOnline(activeChatUser._id)
                                ? "text-emerald-500"
                                : "text-gray-400"
                            }`}
                          />
                          <span
                            className={
                              isUserOnline(activeChatUser._id)
                                ? "text-emerald-600 font-medium"
                                : "text-gray-400"
                            }
                          >
                            {isUserOnline(activeChatUser._id) ? "Online now" : "Offline"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message Thread */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/30">
                    {loadingMessages ? (
                      <div className="h-full flex items-center justify-center text-xs text-gray-400">
                        Loading messages...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-6 space-y-2">
                        <MessageSquare className="w-8 h-8 text-gray-300" />
                        <p className="text-xs font-medium text-gray-600">
                          Start a conversation with {activeChatUser.fullname}!
                        </p>
                        <p className="text-[11px] text-gray-400 max-w-xs">
                          Discuss job roles, interview schedules, skill requirements, or feedback in real time.
                        </p>
                      </div>
                    ) : (
                      messages.map((msg, idx) => {
                        const isMe =
                          msg.sender?._id === currentUser._id ||
                          msg.sender === currentUser._id;

                        const time = msg.createdAt
                          ? new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "";

                        return (
                          <div
                            key={msg._id || idx}
                            className={`flex flex-col ${
                              isMe ? "items-end" : "items-start"
                            }`}
                          >
                            <div
                              className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs shadow-xs leading-relaxed ${
                                isMe
                                  ? "bg-blue-600 text-white rounded-br-xs"
                                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-xs"
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                            </div>
                            <span className="text-[9px] text-gray-400 mt-1 px-1">
                              {time}
                            </span>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Footer */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-3 border-t border-gray-200 bg-white flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={`Message ${activeChatUser.fullname}...`}
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <Button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-9 px-4 text-xs font-medium cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 mr-1" />
                      <span>Send</span>
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-700">No Chat Selected</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">
                    Choose a conversation from the sidebar or click "Chat" on any candidate card to begin.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDialog;
