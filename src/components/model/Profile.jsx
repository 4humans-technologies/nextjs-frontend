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
        {data.map((item) => (
          <Tabs
            defaultActiveKey="profile"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="home" title="Home">
              <h3>Home</h3>
              <p>{item.name}</p>
            </Tab>
            <Tab eventKey="profile" title="Profile">
              <h3>Profile</h3>
              <p>{item.email}</p>
              <p>{item.posts}</p>
              <p>{item.followers}</p>
            </Tab>
            <Tab eventKey="contact" title="Contact">
              <h3>Contact</h3>
              <Image
                src={item.image.profile}
                width="40px"
                height="40px"
              ></Image>
              <Image src={item.image.cover} width="40px" height="40px"></Image>
            </Tab>
          </Tabs>
        ))}
      </div>
    );
}

export default Profile
