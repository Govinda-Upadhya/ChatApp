import React from "react";
import { Check, X } from "lucide-react";

interface requestCardProps {
  name: string;
  image: string;
  sendreq: () => void;
}

const PeopleCards = (props: requestCardProps) => {
  return (
    <div className="w-full p-4  bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-3">
      {/* User Info */}
      <div className="flex items-start gap-3">
        <img
          src={props.image}
          alt={`${props.name}'s avatar`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="text-gray-900 font-medium text-sm">{props.name}</div>
          <div className="text-xs text-gray-500">You can connect</div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={props.sendreq}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-white bg-blue-600 rounded-md text-xs hover:bg-blue-700 transition"
        >
          <Check className="w-4 h-4" />
          Send Request
        </button>
      </div>
    </div>
  );
};

export { PeopleCards };
