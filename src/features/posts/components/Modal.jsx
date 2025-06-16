import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "../styles/Modal.module.css";

const Modal = ({ modalImage, closeModal }) => {
  useEffect(() => {
    console.log("Modal смонтирован");
    return () => console.log("Modal размонтирован");
  }, []);
  
  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img
          src={`http://localhost:8000/${modalImage}`}
          alt="Полный просмотр"
          className={styles.modalImage}
        />
      </div>
    </div>,
    document.body
  );
};

export default Modal;
