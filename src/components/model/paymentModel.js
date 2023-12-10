import React from "react";

function PaymentModel({ paymentUrl }) {
  return (
    <div
      className="modal fade SelectPayment_modal"
      id="SelectPayment"
      tabindex="-1"
      data-bs-backdrop="static"
      aria-labelledby="SelectPaymentLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <iframe
            src={"https://buy.stripe.com/test_5kAcPyarJaIPaQg4gg"}
            height="400"
            title="payment"
            allowFullScreen
          ></iframe>
          {/* <div className="modal-header">
            <h5 className="modal-title fw-bolder" id="SelectPaymentLabel">
              Select Payment
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="payment_Option_item mb-3">
              <p className="mb-0">Visa & Master & Union Pay</p>
              <input
                type="radio"
                className="form-check-input"
                name="payment_Option"
                id=""
              />
            </div>
            <div className="payment_Option_item mb-3">
              <p className="mb-0">Uz Card & humo</p>
              <input
                type="radio"
                className="form-check-input"
                name="payment_Option"
                id=""
              />
            </div>
            <div className="payment_Option_item mb-3">
              <p className="mb-0">Crypto</p>
              <input
                type="radio"
                className="form-check-input"
                name="payment_Option"
                id=""
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-danger fw-bolder"
              data-bs-dismiss="modal"
            >
              Discard
            </button>
            <button type="button" className="btn btn-success fw-bolder">
              Yes
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default PaymentModel;
