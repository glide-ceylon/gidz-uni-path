"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Modal, Button, Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [deleteChat, setDeleteChat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      const { data, error } = await supabase
        .from("applications")
        .select(
          `id, first_name, status, messages(sent_by, application_id, message, created_at)`
        )
        .in("status", ["Step1", "Step2", "Step3"])
        .not("messages", "is", null);

      if (error) {
        console.error("Error fetching chats:", error);
      } else {
        setChats(data);
        if (data.length > 0) setSelectedChat(data[0]);
      }
    };
    fetchChats();
  }, []);

  const sendMessage = async () => {
    if (selectedChat && newMessage.trim() !== "") {
      const { data, error } = await supabase.from("messages").insert([
        {
          sent_by: "Gidz",
          application_id: selectedChat.id,
          message: newMessage,
        },
      ]);

      if (!error) {
        selectedChat.messages.push({
          sent_by: "Gidz",
          message: newMessage,
          created_at: new Date().toISOString(),
        });
        setNewMessage("");
        setSelectedChat({ ...selectedChat });
      }
    }
  };

  const handleDeleteClick = (chat) => {
    setDeleteChat(chat);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteChat) {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("application_id", deleteChat.id);
      if (!error) {
        setChats((prev) => prev.filter((c) => c.id !== deleteChat.id));
        if (selectedChat?.id === deleteChat.id) setSelectedChat(null);
        setIsModalOpen(false);
      }
    }
  };

  return (
    <div className="flex bg-gray-100 border border-gray-100">
      {/* Sidebar (Hidden on small screens, Drawer used instead) */}
      <div className="hidden lg:block w-1/5 bg-white border-r border-gray-300 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Messages</h3>
        <hr />
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex justify-between items-center cursor-pointer p-3 rounded-lg mb-2 transition-all duration-200 ${
              selectedChat?.id === chat.id ? "bg-gray-100" : "hover:bg-gray-200"
            }`}
            onClick={() => setSelectedChat(chat)}
          >
            <span>{chat.first_name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(chat);
              }}
              className="text-red-500 hover:text-red-700"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Chat window */}
      <div className="w-full lg:w-4/5 flex flex-col bg-gray-50 h-[80vh]">
        <button
          className="lg:hidden p-2 bg-gray-600 text-white rounded-md m-2"
          onClick={() => setIsDrawerOpen(true)}
        >
          📜 Show Chats
        </button>

        {selectedChat ? (
          <>
            <div className="p-4 bg-gray-500 text-white text-lg font-semibold">
              Chat with {selectedChat.first_name}
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {selectedChat.messages?.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 max-w-xs rounded-lg ${
                    msg.sent_by === "Gidz"
                      ? "bg-gray-500 text-white self-end ml-auto"
                      : "bg-white border border-gray-300"
                  }`}
                >
                  <strong>{msg.sent_by}:</strong> {msg.message}
                </div>
              ))}
            </div>
            <div className="p-4 bg-white flex items-center border-t border-gray-300">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            Select a chat to view messages
          </div>
        )}
      </div>

      {/* Drawer for small screens */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div className="w-60 p-4">
          <IconButton onClick={() => setIsDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
          <h3 className="text-lg font-semibold mb-4">Messages</h3>
          <hr />
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-200"
            >
              <span
                onClick={() => {
                  setSelectedChat(chat);
                  setIsDrawerOpen(false);
                }}
              >
                {chat.first_name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(chat);
                }}
                className="text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
          <p>Are you sure you want to delete this chat?</p>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} className="ml-2 bg-red-500 text-white hover:bg-red-600">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
