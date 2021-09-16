import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import Image from 'next/image'


function Profile() {
  const data = [
    {
      name: "John Doe",
      email: "berrt@gmail.com",
      age: "25",
      image: {
        profile:
          "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWF8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
        cover:
          "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGhvdG9ncmFwaHl8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
      },
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.",
      posts: "10",
      followers: "100",
      following: "50",
    },
  ];

    return (
      <div>
        
      </div>
    );
}

export default Profile
