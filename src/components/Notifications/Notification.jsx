import React, { useState } from "react"
import { Toast, ToastContainer } from "react-bootstrap"

function Notification(props) {
  const [close, setClose] = useState(false)

  const closeHandler = () => {}

  return (
    <div>
      <ToastContainer position="bottom-end" className="tw-sticky">
        <Toast animation={true} show={props.onShow} onClose={!props.onShow}>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
          </Toast.Header>
          <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  )
}

export default Notification
