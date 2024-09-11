import React, { useEffect } from "react";
import "../modal.css";

function ConfirmationModal({ isOpen, onClose }) {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose(); // Close the modal after 5 seconds
            }, 5000);
            return () => clearTimeout(timer); // Clear the timer if the component unmounts
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Success</h2>
                <p>Your expense has been added!</p>
            </div>
        </div>
    );
}

export default ConfirmationModal;
