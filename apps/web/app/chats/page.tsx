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

  useEffect(() => {
    // search({ item: searchItem, type: activeSection });

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
              <ChatCard
                message="hello"
                image="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chess_kdt45.svg/800px-Chess_kdt45.svg.png"
                name="govinda"
                time="2:40PM"
              />
            </>
          ) : activeSection == "requests" ? (
            <>
              <RequestCard
                image="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chess_kdt45.svg/800px-Chess_kdt45.svg.png"
                name="govinda"
                accept={() => console.log("accepted")}
                reject={() => console.log("rejected")}
                time="2 min"
              />
            </>
          ) : (
            <>
              {people.map((person, key) => (
                <PeopleCards
                  key={key}
                  image="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chess_kdt45.svg/800px-Chess_kdt45.svg.png"
                  name="govinda"
                  status="hello"
                  sendreq={() => console.log("done")}
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
