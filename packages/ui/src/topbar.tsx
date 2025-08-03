import { Video } from "lucide-react";
import React from "react";

interface TopBarProps {
  friend: { username: string; profile: string };
}

const Topbar = (props: TopBarProps) => {
  return (
    <div className="w-full h-[10%] flex items-center justify-between px-4 py-2 border-b border-gray-200">
      {/* Left Side: Avatar + Info */}
      <div className="flex items-center gap-3">
        <img
          src={props.friend.profile}
          alt="User"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {props.friend.username}
          </p>
        </div>
      </div>

      {/* Right Side: Icon */}
      <div className="text-gray-600 hover:text-black cursor-pointer">
        <Video className="w-5 h-5" />
      </div>
    </div>
  );
};

export { Topbar };
