import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { axiosClient } from "../../utils/axiosConfig";
import { craeteTourbooking, stripeTourLink } from "../../useApi/api";
import { onError } from "../../utils/helper";
import { Backdrop, Box, CircularProgress } from "@mui/material";


const schema = yup.object().shape({
  tickets: yup
    .number()
    .required("Tickets field is required")
    .max(100, "Maximum of 100 tickets can be booked"),

  totalPayment: yup.number().required("Total payment field is required"),
});

function TourModel({ ticket }) {
  const [loading, setLoading] = useState(false);

  const [ticketCount, setTicketCount] = useState(1);

  const handleIncrement = () => {
    if(ticketCount<100)
    setTicketCount(ticketCount + 1);
     setValue("tickets",ticketCount + 1)
    setValue("totalPayment", ticket.price * (ticketCount + 1))
  };

  const handleDecrement = () => {
    if (ticketCount > 1) {
      setTicketCount(ticketCount - 1);
      setValue("tickets",ticketCount - 1)

      setValue("totalPayment", ticket.price * (ticketCount - 1))
    }
  };


  const { register, handleSubmit, errors, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tickets: 1,
      totalPayment: ticket?.price,
    },
  });

  const createBooking = async (tour, ticket) => {
    
   
    if (!tour) {
      return;
    }
    try {
      setLoading(true);

      const TourId = tour.Id;
      
      const res = await axiosClient.post(craeteTourbooking, {
        TourId,
        TickedQty: ticket.tickets,


      });
      
      const data = res?.data;
      if (data?.statusCode == 200) {
        const BookingId = data?.data?.id;


         

        axiosClient
          .get(stripeTourLink, {
            params: {
              BookingId: BookingId,
              amount:    ticket.totalPayment ,
              // amount: parseFloat(amount),
            },
          })
          .then((res) => {
            if (res?.status == 200 || res?.status == 201) {
              if (res?.data?.statusCode == 200) {
                window.location.href = res?.data?.data;
              } else {
                onError(res?.data?.message || "Bad Request");
              }
            } else {
              onError(res?.data?.message || "Bad Request");
            }
            setLoading(false);
          })
          .catch((e) => {
            onError(e?.message);
            setLoading(false);
          });
      }
    } catch (e) {
      onError(e.message);
      setLoading(false);
    }
  };

  const { tickets } = watch();

  const onSubmit = (data) => {
    // Add your submission logic here
    createBooking(ticket.id, data );

  };

  useEffect(() => {
    setValue("totalPayment", ticket?.price * tickets);
  }, [ticket?.price, tickets]);

  return (
    <div>
       <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading }
        >
          <CircularProgress />
        </Backdrop>
      </Box>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Buy Tickets
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <label htmlFor="tickets" className="form-label me-3 mb-0">
                      Tickets
                    </label>
                    <div className="d-flex align-items-center w-50">
                    <button className="btn btn-plus_min" type="button"
                       onClick={handleDecrement}>
                        <i class="fa-solid fa-minus"></i>
                      </button>

                      <input
                        type="number"
                        className="form-control mx-3 text-center "
                        id="tickets"
                        name="tickets"
                        {...register("tickets")}
                        value={ticketCount}
                        readOnly
                      />
                       <button className="btn btn-plus_min" type="button"
          onClick={handleIncrement}>
                        <i class="fa-solid fa-plus"></i>
                      </button>
                      {/* <p className="text-danger">{errors?.tickets?.message}</p> */}
                     
                    </div>
                  </div>
                </div>

                <div className="mb-3 d-flex align-items-center justify-content-between">
                  <label htmlFor="totalPayment" className="form-label">
                    Total Payment
                  </label>
                  <input
                    type="number"
                    className="form-control me-1 w-50"
                    id="totalPayment"
                    name="totalPayment"
                    {...register("totalPayment")}
                //  disabled
                    readOnly
                  />
                  {/* <p className="text-danger">{errors?.totalPayment?.message}</p> */}
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn  btn-buy">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TourModel;
