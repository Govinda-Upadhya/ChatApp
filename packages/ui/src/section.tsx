import React, { ComponentType, forwardRef, SVGProps, useState } from "react";

interface SectionProps {
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  notification?: number;
  active: boolean;
}

export const Section = (props: SectionProps) => {
  const { icon: Icon, title, notification, active } = props;

  return (
    <div className="flex flex-col w-full h-[40px] bg-gray-100 rounded-xl shadow-2xl transition-all duration-300 ease-in-out hover:cursor-pointer">
      <div
        className={`flex p-2 justify-center items-center ${
          active ? "h-[95%] text-blue-600" : "h-full text-gray-500"
        } w-full  hover:text-black`}
      >
        <div className="p-1">
          <Icon />
        </div>
        <div className="text-base p-1">{title}</div>
        {notification ? (
          <div className="text-sm p-1 justify-items-center text-white bg-red-500 rounded-full">
            {notification}
          </div>
        ) : null}
      </div>

      <div
        className={`bg-blue-400 transition-all duration-100 ease-in ${
          active ? "h-[5%] w-full" : "h-[0%] w-[0%]"
        }`}
      >
        &nbsp;
      </div>
    </div>
  );
};
