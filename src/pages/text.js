import React, { useEffect } from "react"
import useSetupSocket from "../socket/useSetupSocket"

function TestComponent() {
  useEffect(() => {
    console.log("Running effect of test component 😎😎😎")
  }, [])
  useSetupSocket("http://192.168.1.104:8080")
  return <div className="tw-hidden">I'm a test component</div>
}

export default TestComponent
