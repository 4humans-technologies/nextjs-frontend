import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import Image from 'next/image'


function Profile() {
  return (
    <div className=" tw-bg-first-color">
      <div className="">
        <h2 className="tw-font-semibold tw-text-lg">
          My Profile
        </h2>
        <div className="tw-grid tw-grid-cols-2">
          <div className="tw-col-span-1">
            <h4 className="">Name: { }</h4>
            <h4 className="">Age: { }</h4>
            <h4 className="">Tags: { }</h4>
            <h4 className="">Categories: { }</h4>
          </div>
          <div className="tw-col-span-1">
            <h4 className="">My Hobbies</h4>
            <p className=""></p>
            <h4 className="">Bio</h4>
            <p className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus esse reiciendis aperiam inventore eveniet voluptatum sit, molestias quidem cumque sint?</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile
