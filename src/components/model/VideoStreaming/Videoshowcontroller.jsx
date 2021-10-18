import React, { useState } from "react"
import { Tabs, Tab } from "react-bootstrap"
import Showcontroler from "./Showcontroler"

function Videoshowcontroller() {
  const [key, setKey] = useState("home")
  return (
    <div className=" ">
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3  tw-border-none"
      >
        <Tab
          eventKey="home"
          title="Home"
          className="active:tw-border-b-2 tw-border-red-500"
        >
          <Showcontroler />
          {/* <Sonnet /> */}
        </Tab>
        <Tab eventKey="profile" title="Profile">
          <h1>sona babu</h1>
          {/* <Sonnet /> */}
        </Tab>
        <Tab eventKey="contact" title="Contact">
          {/* <Sonnet /> */}
          <h1>Sona bau</h1>
        </Tab>
      </Tabs>
    </div>
  )
}

export default Videoshowcontroller
