import React from "react"
import useSetupSocket from "../socket/useSetupSocket"
import useFetchInterceptor from "../hooks/useFetchInterceptor"

let fetchIntercepted = false
function TestComponent() {
  useFetchInterceptor(fetchIntercepted)
  fetchIntercepted = true
  return <div className="tw-hidden">I'm a test component</div>
}

export default TestComponent
