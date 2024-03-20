import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import $ from "jquery";

export default function Delivery() {
  let [deliveries, setDeliveries] = useState([]);
  useEffect(() => {
    getDeliveries();
  }, []);
  async function addDelivery() {
    if (
      $("#deliveryName").val() == "" ||
      $("#deliveryPhone").val() == "" ||
      $("#deliveryPassword").val() == ""
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    if (
      !$("#deliveryPhone")
        .val()
        .match(/^01[0125][0-9]{8}$/)
    ) {
      toast.error("Phone number is invalid");
      return;
    }
    if ($("#deliveryPassword").val().length < 5) {
      toast.error("Password must be at least 5 characters");
      return;
    }

    $("#addDeliveryBtn")
      .html(`<div  style="width:23px;height:23px;" class="spinner-border text-dark"  role="status">
       <span class="sr-only">Loading...</span>
     </div>`);
    let { data } = await axios.post(
      "https://foodyproj.onrender.com/delivery/createDelivery",
      {
        name: $("#deliveryName").val(),
        phone: $("#deliveryPhone").val(),
        password: $("#deliveryPassword").val(),
      },
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
      }
    );
    if (data.success) {
      toast.success(data.message);
      getDeliveries();
    } else {
      toast.error(data.message);
    }
    $("#addDeliveryBtn").html("Add Delivery");
  }

  async function updateDelivery() {
    let id = $("#updateDeliveryBtn").attr("data-id");
    if ($("#deliveryName").val() == "" || $("#deliveryPhone").val() == "") {
      toast.error("Please fill all the fields");
      return;
    }
    if (
      !$("#deliveryPhone")
        .val()
        .match(/^01[0125][0-9]{8}$/)
    ) {
      toast.error("Phone number is invalid");
      return;
    }

    if ($("#deliveryPassword").val() != "") {
      if ($("#deliveryPassword").val().length < 5) {
        toast.error("Password must be at least 5 characters");
        return;
      }
    }

    let initData = {
      name: $("#deliveryName").val(),
      phone: $("#deliveryPhone").val(),
      password: $("#deliveryPassword").val(),
    };
    if ($("#deliveryPassword").val() == "") {
      delete initData.password;
    }

    $("#updateDeliveryBtn")
      .html(`<div  style="width:23px;height:23px;" class="spinner-border text-dark"  role="status">
       <span class="sr-only">Loading...</span>
     </div>`);
    let { data } = await axios.patch(
      `https://foodyproj.onrender.com/delivery/updateDelivery/${id}`,
      initData,
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
      }
    );
    if (data.success) {
      toast.success(data.message);
      getDeliveries();
    } else {
      toast.error(data.message);
    }
    $("#updateDeliveryBtn").html("Update Delivery");
  }

  async function deleteDelivery(id) {
    let { data } = await axios.delete(
      `https://foodyproj.onrender.com/delivery/deleteDelivery/${id}`,
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      getDeliveries();
    } else {
      toast.error(data.message);
    }
  }

  async function getDeliveries() {
    let { data } = await axios.get("https://foodyproj.onrender.com/delivery", {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
    if (data.success) {
      setDeliveries(data.deliveries);
    }
  }

  function updateClicked(Delivery) {
    $("#deliveryName").val(Delivery.name);
    $("#deliveryPhone").val(Delivery.phone);
    $("#deliveryPassword").val("");
    $("#headOfForm").text(`Update ${Delivery.name} Account`);
    $("#updateDeliveryBtn").removeClass("d-none");
    $("#closeUpdateDeliveryBtn").removeClass("d-none");
    $("#addDeliveryBtn").addClass("d-none");
    $("#updateDeliveryBtn").attr("data-id", Delivery._id);
  }

  function closeUpdateDelivery() {
    $("#deliveryName").val("");
    $("#deliveryPhone").val("");
    $("#deliveryPassword").val("");
    $("#headOfForm").text(`Create Delivery Account`);
    $("#updateDeliveryBtn").addClass("d-none");
    $("#closeUpdateDeliveryBtn").addClass("d-none");
    $("#addDeliveryBtn").removeClass("d-none");
  }

  return (
    <div className="container d-flex flex-column /align-items-center justify-content-center">
      <div className="form w-fit text-center mb-4 mx-auto  ">
        <h6 id="headOfForm">Create Delivery Account</h6>
        <div className="d-flex gap-3">
          <div className="mb-3 w-100 mt-3">
            <input
              className="form-control"
              type="text"
              placeholder="Name"
              id="deliveryName"
            />
          </div>
          <div className="mb-3 w-100 mt-3">
            <input
              className="form-control"
              type="tel"
              placeholder="Phone"
              id="deliveryPhone"
            />
          </div>
          <div className="mb-3 w-100 mt-3">
            <input
              className="form-control"
              type="password"
              placeholder="Password"
              id="deliveryPassword"
            />
          </div>
        </div>

        <div className="mb-3 w-100">
          <button
            onClick={addDelivery}
            className="btn btn-primary"
            id="addDeliveryBtn"
          >
            Add Delivery
          </button>
          <button
            onClick={updateDelivery}
            className="btn btn-warning d-none"
            id="updateDeliveryBtn"
          >
            Update Delivery
          </button>
          <button
            id="closeUpdateDeliveryBtn"
            className="btn btn-dark ms-2 d-none"
            onClick={closeUpdateDelivery}
          >
            <i className="fa fa-xmark "></i>
          </button>
        </div>
      </div>
      <div className="Deliverys border-top pt-4 text-start w-100">
        <table className="table table-dark rounded-1 overflow-hidden shadow">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((Delivery) => (
              <tr className="mb-3">
                <td>{Delivery.name}</td>
                <td>{Delivery.phone}</td>
                <td>{Delivery.status}</td>
                <td className="border-start">
                  <div className="d-flex align-items-center gap-3 mt-2">
                    <button
                      onClick={() => updateClicked(Delivery)}
                      className="btn btn-warning"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteDelivery(Delivery._id)}
                      className="btn btn-danger"
                    >
                      <i className="fa fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul></ul>
      </div>
    </div>
  );
}
