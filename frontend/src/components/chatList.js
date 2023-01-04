import React, { useState, Suspense } from "react";
import "react-chat-elements/dist/main.css";
import axios from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Triangle, Bars } from "react-loader-spinner";
import { GiHamburgerMenu } from "react-icons/gi/index.js";

const SideBar = React.lazy(() =>
  import("react-chat-elements/build/SideBar/SideBar")
);
const ChatList = React.lazy(() =>
  import("react-chat-elements/build/ChatList/ChatList")
);

const ChatListElement = ({ setChatId }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const navigate = useNavigate();

  const onLogout = async () => {
    await axios.post("/api/login/logout", { withCredentials: true });
    navigate("/login");
  };

  const chats = useQuery({
    queryKey: ["chatsData"],
    queryFn: async () => {
      const chats = await axios.get("/api/chats", {
        withCredentials: true,
      });
      if (chats?.data?.length > 0) {
        setChatId(chats?.data[0]?.id);
      }
      return chats?.data;
    },
    retry: false,
  });

  if (chats.isError && chats?.error?.response?.status === 403) {
    localStorage.removeItem("username");
    navigate("/login");
  }

  return chats.isLoading ? (
    <div className="flex justify-center align-center grow">
      <Triangle
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="triangle-loading"
        wrapperStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        visible={true}
      />
    </div>
  ) : (
    <div>
      <div
        className="fixed z-[9999] p-2"
        onClick={() => setIsMenuVisible(!isMenuVisible)}
      >
        <GiHamburgerMenu />
      </div>
      {isMenuVisible ? (
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
          <SideBar
            type="light"
            data={{
              top: (
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
                  <ChatList
                    className="mt-10"
                    onClick={(e) => setChatId(e?.id)}
                    dataSource={chats.data}
                    id="chatList"
                  />
                </Suspense>
              ),
              bottom: (
                <div
                  onClick={onLogout}
                  className="hover:underline underline-offset-4 decoration-2 cursor-default"
                >
                  Logout
                </div>
              ),
            }}
          />
        </Suspense>
      ) : null}
    </div>
  );
};

export default ChatListElement;
