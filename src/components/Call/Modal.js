import Modal from "react-modal";
import useModalContext from "../../app/ModalContext";

function IncomingCall(props) {
  const ctx = useModalContext();
  const modalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      width: "90%",
      backgroundColor: props.contentBgColor || "#232323",
      borderWidth: 0,
      borderRadius: 4,
      overflowY: "auto",
      maxHeight: "92vh",
      paddingTop: "2rem",
      paddingBottom: "2rem",
    },
    overlay: {
      position: "fixed",
      zIndex: props.zIndex || 150,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
    },
  };
  return (
    <>
      <div>
        <Modal
          isOpen={props.isOpen}
          onRequestClose={props.onRequestClose}
          style={modalStyles}
          shouldCloseOnOverlayClick={true}
          ariaHideApp={false}
        >
          {props.children}
        </Modal>
      </div>
    </>
  );
}

export default IncomingCall;
