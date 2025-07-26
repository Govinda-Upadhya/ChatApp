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
import axios from "axios";
interface searchData {
  type: string;
  item: String;
}

export default function Page() {
  const [activeSection, setActiveSection] = useState<string>("messages");
  const [placeholder, setPlaceholder] = useState("messages");
  const [searchItem, setSearchItem] = useState("none");
  const [people, setPeople] = useState<
    {
      name: string;
      image: string | null;
      status: string | null;
    }[]
  >([]);
  const [chats, setChats] = useState([]);
  const [requests, setRequests] = useState([]);
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
  async function fetchRequest() {
    let res = await axios.get("http://localhost:3001/api/requests");
    if (res.data.requests.length != 0) {
      setRequests(res.data.requests);
    }
  }
  async function fetchChats() {
    let res = await axios.get("http://localhost:3001/api/chats");
    setChats(res.data.friends);
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
    fetchpeople();
    fetchRequest();
    fetchChats();
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
                  onclick={() => console.log("open message")}
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
        <Topbar
          image="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chess_kdt45.svg/800px-Chess_kdt45.svg.png"
          name="Govinda"
          time="2min"
        />
        <ChatWindow />
      </div>
    </div>
  );
}
