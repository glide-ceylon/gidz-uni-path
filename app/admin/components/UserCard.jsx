// components/UserCard.jsx

import React from "react";
import { Icon } from "@iconify/react";

const UserCard = ({ application, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(application?.id)}
      className={`cursor-pointer p-6   flex flex-col space-y-2 transition-colors hover:bg-gray-100 ${
        isSelected ? "bg-blue-100 border-blue-400" : "bg-white "
      }`}
    >
      <div className="flex items-center space-x-2">
        <Icon icon="mdi:account" className="text-xl text-gray-600" />
        <span className="text-lg">{application?.first_name}</span>
        <span className="text-lg">{application?.last_name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Icon icon="mdi:email" className="text-md text-gray-500" />
        <span className="text-gray-700">{application?.email}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Icon icon="mdi:phone" className="text-md text-gray-500" />
        <span className="text-gray-700">{application?.telephone}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Icon icon="mdi:home" className="text-md text-gray-500" />
        <span className="text-gray-700">{application?.address}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Icon icon="mdi:passport" className="text-md text-gray-500" />
        <span className="text-gray-700">{application?.passport_number}</span>
      </div>
    </div>
  );
};

export default UserCard;
