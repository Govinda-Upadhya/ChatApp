"use client";
import { Section } from "@repo/ui/section";
import { Message } from "@repo/ui/message";
import { Request } from "@repo/ui/request";
import { useEffect, useRef, useState } from "react";
import { Search } from "@repo/ui/search";
import { ChatCard } from "@repo/ui/chatCard";
import { RequestCard } from "@repo/ui/requestCard";
import { PeopleCards } from "@repo/ui/peoplecard";
import { Topbar } from "@repo/ui/topbar";
import { ChatWindow } from "@repo/ui/chatbox";
import { Lens } from "@repo/ui/lens";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import axios from "axios";
import { getToken } from "next-auth/jwt";
interface searchData {
  type: string;
  item: String;
}
interface clientPageProps {
  user: string;
}

export default function ClientPage(props: clientPageProps) {
  const [messesageSection, setmessageSection] = useState(false);
  const [curruser, setcurruser] = useState<string>(props.user);
  const [activeSection, setActiveSection] = useState<string>("messages");
  const [iosocket, setSocket] = useState<Socket>();
  const [placeholder, setPlaceholder] = useState("messages");
  const [searchItem, setSearchItem] = useState("none");
  const [roomId, setRoomId] = useState<number>(0);
  const [friend, setFriend] = useState<{ username: string; profile: string }>();

  const [messages, setMessages] = useState<
    {
      sender: string;
      receiver: string;
      message: string;
      time: string;
      id?: number;
    }[]
  >([]);
  const [people, setPeople] = useState<
    {
      name: string;
      image: string | null;
      status: string | null;
    }[]
  >([]);
  const [chats, setChats] = useState<
    {
      usernae: string;
      roomId: number;
      profile: string;
    }[]
  >([]);

  const [requests, setRequests] = useState([]);
  async function handleMessagesend(message) {
    console.log("message send triggered");
    console.log(messages);
    iosocket?.emit("messagedelivery", {
      message: message,
      roomId: roomId,
      curruser: curruser,
      friend: friend,
    });
  }
  async function requestHandle(option: string, person: string) {
    let res = await axios.post("http://localhost:3001/api/handleRequest", {
      type: option,
      person: person,
    });
    if (res.status == 200) {
      alert("request accepted");
    } else {
      console.log(res);
    }
  }
  async function sendRequest(username: string) {
    let res = await axios.post("http://localhost:3001/api/sendReuqest", {
      username,
    });
    if (res.status == 200) {
      alert("requets send");
    }
  }
  async function fetchpeople() {
    let res = await axios.get("http://localhost:3001/api/people");
    setPeople(res.data.people);
  }
  async function handleChat(roomId: number, friendname: string) {
    setmessageSection(true);
    iosocket?.emit("joinroom", { roomId: roomId, friendname });
    setRoomId(roomId);
  }
  async function fetchRequest() {
    let res = await axios.get("http://localhost:3001/api/requests");
    if (res.data.requests.length != 0) {
      setRequests(res.data.requests);
    }
  }
  async function fetchChats() {
    let res = await axios.get("http://localhost:3001/api/chats");
    setChats(res.data.friends);
    console.log("friends", res.data.friends);
  }
  async function search(data: searchData) {
    let res = await axios.get("http://localhost:3001/api/search", {
      params: {
        type: data.type,
        item: data.item,
      },
    });
    if (res.status == 200) {
      if (res.data.type == "search") {
        setPeople(res.data.people);
      }
    }
  }
  useEffect(() => {
    async function serve() {
      const res = await axios.get("http://localhost:3001/api/token");
      console.log(res.data);
      const socket: Socket = io("http://localhost:3000", {
        auth: {
          token: res.data.token,
        },
      });

      socket.on("connect", () => console.log("connected with id", socket.id));
      socket.emit("message", "hello server");
      socket.on("ack", (msg) => alert(msg));
      socket.on("joinack", async ({ mesage, friendname }) => {
        alert(mesage);
        let res = await axios.get("http://localhost:3001/api/getMessages", {
          params: {
            user1: friendname,
            user2: curruser,
          },
        });
        console.log(res.data.message);

        setMessages(res.data.message);
      });
      socket.on("messagefromfriend", ({ message, user }) => {
        console.log("message from friend", { message, user });
        console.log("cuuruser", curruser);
        if (curruser != user) {
          setMessages((prev) => [...prev, message]);
          console.log("messagefromfriend", message);
        }
      });
      socket.on("messagefromfriendnotreceived", ({ message }) => {
        alert("not send");
      });

      setSocket(socket);
      fetchpeople();
      fetchRequest();
      fetchChats();
    }
    serve();
  }, []);
  useEffect(() => {
    search({ item: searchItem, type: activeSection });

    return () => {};
  }, [searchItem]);
  useEffect(() => {
    if (activeSection == "message") {
      setPlaceholder("messages");
    } else if (activeSection == "requests") {
      setPlaceholder("requests");
    } else if (activeSection == "search") {
      setPlaceholder("people");
    }
  }, [activeSection]);

  return (
    <div className="flex w-screen h-screen ">
      <div className="flex flex-col w-[40%] h-screen px-3 py-2 gap-2 border-r border-gray-400">
        <div className="text-2xl font-bold  flex justify-center align-middle w-full">
          {activeSection == "messages" ? <h1>Messages</h1> : <h1>Requests</h1>}
        </div>

        <Search placeholder={placeholder} setSearch={setSearchItem} />
        <div className="flex w-full h-[5%]">
          <div
            className="flex w-full"
            onClick={() => {
              setActiveSection("messages");
            }}
          >
            <Section
              icon={Message}
              title="message"
              notification={2}
              active={activeSection == "messages"}
            />
          </div>
          <div
            className="flex w-full"
            onClick={() => {
              setActiveSection("requests");
            }}
          >
            <Section
              icon={Request}
              title="Requests"
              notification={3}
              active={activeSection == "requests"}
            />
          </div>
          <div
            className="flex w-full"
            onClick={() => {
              setActiveSection("search");
            }}
          >
            <Section
              icon={Lens}
              title="Search"
              active={activeSection == "search"}
            />
          </div>
        </div>
        <div className="flex flex-col w-full h-[60%] mt-5 overflow-auto gap-2 ">
          {activeSection == "messages" ? (
            <>
              {chats.map((chat, key) => (
                <ChatCard
                  key={key}
                  image={chat.profile}
                  name={chat.username}
                  onclick={() => {
                    const roomId = chat.roomId;

                    setFriend({
                      username: chat.username,
                      profile: chat.profile,
                    });
                    handleChat(roomId, chat.username);
                  }}
                />
              ))}
            </>
          ) : activeSection == "requests" ? (
            <>
              {requests.map((request, key) => (
                <RequestCard
                  key={key}
                  image={request.profile}
                  name={request.sender}
                  time={request.sendAt}
                  accept={() => requestHandle("accept", request.sender)}
                  reject={() => requestHandle("reject", request.sender)}
                />
              ))}
            </>
          ) : (
            <>
              {people.map((person, key) => (
                <PeopleCards
                  key={key}
                  image={person.profile}
                  name={person.username}
                  status={person.status}
                  sendreq={() => sendRequest(person.username)}
                />
              ))}
            </>
          )}
        </div>
      </div>
      <div className="h-full w-[60%]">
        {messesageSection ? (
          <>
            <Topbar friend={friend} />
            <ChatWindow
              messages={messages}
              friend={friend.username}
              setMessages={setMessages}
              onclick={(message) => handleMessagesend(message)}
              person={curruser}
            />
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4 text-center">
              <img
                src="https://undraw.io/assets/undraw_messages_re_qy9x.svg"
                alt="No chat selected"
                className="w-48 mb-6 opacity-80"
              />
              <h2 className="text-xl font-semibold mb-2">
                No conversation selected
              </h2>
              <p className="text-sm">
                Select a chat from the sidebar to start messaging.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
