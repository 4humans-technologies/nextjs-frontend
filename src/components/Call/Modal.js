import Modal from "react-modal";
import useModalContext from "../../app/ModalContext";
import PropTypes from "prop-types";

function ContentModal(props) {
  const ctx = useModalContext();
  const modalStyles = {
    content: {
      ...props.contentStyles,
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      width: "90%",
      backgroundColor: "#232323",
      borderWidth: 0,
      borderRadius: 4,
      overflowY: "auto",
      maxHeight: "92vh",
      paddingTop: "2rem",
      paddingBottom: "2rem",
    },
    overlay: {
      ...props.overlayStyles,
      position: "fixed",
      zIndex: 150,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
    },
  };
  const appElement =
    typeof window === undefined
      ? document.getElementById("modal-portal")
      : null;
  return (
    <>
      <div>
        <Modal
          isOpen={props.isOpen}
          onRequestClose={props.onRequestClose}
          style={modalStyles}
          shouldCloseOnOverlayClick={true}
          ariaHideApp={false}
          appElement={appElement}
        >
          {props.children}
        </Modal>
      </div>
    </>
  );
}

ContentModal.prototypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  contentStyles: PropTypes.object,
  overlay: PropTypes.object,
};

export default ContentModal;
