import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { onError } from "../../utils/helper";
import { axiosClient } from "../../utils/axiosConfig";
import { rejectCarBooking } from "../../useApi/api";

export default function Cancel() {
  const router = useNavigate();

  useEffect(() => {
    updateBooking();
  }, []);

  const updateBooking = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const BookingId = params.get("BookingId");
      if (BookingId) {
        await axiosClient.get(rejectCarBooking.replace("{id}", BookingId));
      }
    } catch (e) {
      onError(e?.message);
    }
  };

  return (
    <div className="d-flex justify-content-center w-100 page-top-container">
      <Modal show={true} className="modal-payment-success" size="lg">
        <Modal.Header>
          <span
            onClick={() => {
              router("/");
            }}
          >
            x
          </span>
          <h6>{"Cancel"}</h6>
          <span></span>
        </Modal.Header>
        <Modal.Body className="m-4 text-center">
          <h5>Your Payment is Cancel!</h5>

          <Button
            variant="primary"
            onClick={() => {
              router("/category");
            }}
          >
            Home
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}
