import React, { useState, useEffect, useRef, Suspense } from "react";
import Button from "react-chat-elements/build/Button/Button";
import Input from "react-chat-elements/build/Input/Input";
import io from "socket.io-client";
import { nanoid } from "nanoid";
import { Bars } from "react-loader-spinner";
import { Helmet } from "react-helmet";

const MessageList = React.lazy(() =>
  import("react-chat-elements/build/MessageList/MessageList")
);

const timeSince = (date) => {
  let seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
};

const createMessage = ({ isMine, text, username, date }) => ({
  id: nanoid(),
  text,
  type: "text",
  position: isMine ? "right" : "left",
  title: username,
  focus: true,
  date,
  dateString: timeSince(new Date(date)),
  titleColor: "#222",
  status: "received",
  notch: true,
  copiableDate: true,
  retracted: false,
  className: "",
});

const MessagesBlock = ({ chatId, username }) => {
  const [currentChat, setCurrentChat] = useState("");
  const socketRef = useRef(null);
  const [messageListArray, setMessageListArray] = useState([]);
  const messageListReferance = useRef();
  const inputReferance = useRef();

  useEffect(() => {
    if (chatId === "") return;

    socketRef.current = io("/", {
      query: { chatId },
    });

    if (currentChat !== chatId) {
      socketRef.current.emit("message:get");
    }

    socketRef.current.on("messages", (data) => {
      setMessageListArray((messageList) => {
        let filteredMessageList =
          messageList.length === 0
            ? data
            : data?.filter(
                (message) =>
                  message?.author?.username?.toString() !== username?.toString()
              );

        return [
          ...messageList,
          ...filteredMessageList?.map((message) =>
            createMessage({
              isMine:
                message?.author?.username?.toString() === username?.toString(),
              text: message?.text,
              username: message?.author?.username,
              date: message.createdAt,
            })
          ),
        ];
      });
    });

    setCurrentChat(chatId);

    return () => {
      setMessageListArray([]);
      socketRef.current.disconnect();
    };
  }, [chatId]);

  const addMessage = () => {
    const text = inputReferance.current.value;
    socketRef.current.emit("message:add", { text });
    setMessageListArray([
      ...messageListArray,
      createMessage({ isMine: true, text, username, date: new Date() }),
    ]);
  };

  return chatId?.length > 0 ? (
    <div className="flex flex-col h-screen grow">
      <Helmet>
        <title>Chat</title>
      </Helmet>
      <Suspense
        fallback={
          <Bars
            height="40"
            width="40"
            color="#4fa94d"
            ariaLabel="bars-loading"
            wrapperStyle={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100vh",
            }}
            visible={true}
          />
        }
      >
        <MessageList
          className="grow overflow-scroll"
          referance={messageListReferance}
          toBottomHeight={"100%"}
          dataSource={messageListArray}
          lockable={true}
          downButton={false}
          downButtonBadge={10}
          sendMessagePreview={true}
        />
      </Suspense>
      <Input
        className="flex-none"
        placeholder="Write your message here."
        defaultValue=""
        referance={inputReferance}
        maxHeight={50}
        onKeyPress={(e) => {
          if (e.shiftKey && e.key === "Enter") {
            return true;
          }
          if (e.key === "Enter") {
            addMessage();
          }
        }}
        rightButtons={
          <Button
            backgroundColor="rgb(187, 247, 208)"
            className="font-semibold"
            color="#000"
            text="Send"
            onClick={() => addMessage()}
          />
        }
      />
    </div>
  ) : null;
};

export default MessagesBlock;
