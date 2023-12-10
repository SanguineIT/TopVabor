import React, { useEffect, useState } from "react";
import successImage from "../../assets/image/pay_success.png";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { onError } from "../../utils/helper";
import { axiosClient } from "../../utils/axiosConfig";
import { updateBookingStatus } from "../../useApi/api";
export default function Success() {
  const router = useNavigate();

  useEffect(() => {
    updateBooking();
  }, []);

  const updateBooking = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const BookingId = params.get("BookingId");
      if (BookingId) {
        await axiosClient.get(updateBookingStatus.replace("{id}", BookingId));
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
          <h6>{"Thank you"}</h6>
          <span></span>
        </Modal.Header>
        <Modal.Body className="m-4 text-center">
          <img src={successImage} />

          <h5>Your Payment is Completed!</h5>

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
