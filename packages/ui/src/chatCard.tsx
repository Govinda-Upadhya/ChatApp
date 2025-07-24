import React, { useState } from "react";

interface chatProps {
  name: string;
  message: string;
  image: string;
  time: string;
}
const ChatCard = (props: chatProps) => {
  const [chatLength, setChatlength] = useState();

  return (
    <div className="flex gap-2 p-1 bg-white border border-gray-200 rounded-2xl hover:scale-3d w-full h-[25%]">
      <div className="flex w-[25%] h-full">
        <img
          src={props.image}
          alt=""
          className="flex rounded-full w-full h-full "
        />
      </div>
      <div className="flex flex-col justify-items-center w-full  ">
        <div className="flex justify-between px-2">
          <div className="font-bold">{props.name}</div>
          <div className="text-gray-400 text-sm">{props.time}</div>
        </div>
        <div className="flex px-2">
          {props.message.length <= 15 ? (
            <p>{props.message}</p>
          ) : (
            <p>{props.message.slice(0, 15)}...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export { ChatCard };
