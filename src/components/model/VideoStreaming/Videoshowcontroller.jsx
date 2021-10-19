import React, { useState } from "react"
import { Tabs, Tab } from "react-bootstrap"
import Details from "./Details"
import Showcontroler from "./Showcontroler"

function Videoshowcontroller() {
  const [key, setKey] = useState("home")
  return (
    <div className="tw-bg-second-color tw-pt-4">
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3  tw-border-none active:tw-border-b-4 tw-border-red-500"
      >
        <Tab
          eventKey="home"
          title="My Details"
          className="active:tw-border-b-2 tw-border-red-500"
        >
          <Showcontroler />
        </Tab>
        <Tab eventKey="profile" title="My Show Controls">
          <Details />
        </Tab>
        {/* <Tab eventKey="contact" title="Contact">
          <h1>Sona bau</h1>
        </Tab> */}
      </Tabs>
    </div>
  )
}

export default Videoshowcontroller
