import React, { useState } from "react"
import { Tabs, Tab } from "react-bootstrap"
import Details from "./Details"
import Showcontroler from "./Showcontroler"

function TabTitle(props) {
  return (
    // <span className="tw-px-4 tw-py-2 tw-text-text-black tw-bg-first-color active:tw-bg-second-color hover:tw-text-white-color tw-text-base tw-rounded-t tw-border-0 hover:tw-border-0">
    <span className="">{props.title}</span>
  )
}

function Videoshowcontroller() {
  const [key, setKey] = useState("tab-1")
  return (
    <div className="tw-bg-first-color tw-mt-12 tw-text-sm md:tw-text-base">
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(eventKey) => setKey(eventKey)}
        defaultActiveKey="tab-1"
        className="tw-bg-first-color my-custom-style tw-px-4"
      >
        <Tab
          eventKey="tab-1"
          title={<TabTitle title="My Details" />}
          tabClassName="hover:tw-text-white-color tw-text-text-black tw-border-0 hover:tw-border-0"
        >
          <Showcontroler />
        </Tab>
        <Tab
          eventKey="tab-2"
          title={<TabTitle title="My Settings" />}
          tabClassName="hover:tw-text-white-color tw-text-text-black tw-border-0 hover:tw-border-0"
        >
          <Details />
        </Tab>
      </Tabs>
    </div>
  )
}

export default Videoshowcontroller
