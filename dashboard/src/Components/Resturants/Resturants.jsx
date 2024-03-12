import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import $ from "jquery";

export default function Resturants() {
  let [resturants, setResturants] = useState([]);
  useEffect(() => {
    getResturants();
  }, []);
  async function addResturant() {
    if ($("#ResturantName").val() == "") {
      toast.error("Please fill all the fields");
      return;
    }

    $("#addResturantBtn")
      .html(`<div  style="width:23px;height:23px;" class="spinner-border text-dark"  role="status">
       <span class="sr-only">Loading...</span>
     </div>`);
    let { data } = await axios.post(
      "https://foodyproj.onrender.com/Resturant",
      {
        ResturantName: $("#ResturantName").val(),
      },
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
      }
    );
    if (data.success) {
      toast.success(data.message);
      getResturants();
    } else {
      toast.error(data.message);
    }
    $("#addResturantBtn").html("Add Resturant");
  }

  async function updateResturant(id) {
    if ($("#ResturantName").val() == "") {
      toast.error("Please fill all the fields");
      return;
    }
    $("#updateResturantBtn")
      .html(`<div  style="width:23px;height:23px;" class="spinner-border text-dark"  role="status">
       <span class="sr-only">Loading...</span>
     </div>`);
    let { data } = await axios.patch(
      `https://foodyproj.onrender.com/Resturant/${id}`,
      {
        ResturantName: $("#ResturantName").val(),
      },
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
      }
    );
    if (data.success) {
      toast.success(data.message);
      getResturants();
    } else {
      toast.error(data.message);
    }
    $("#updateResturantBtn").html("Update Resturant");
  }

  async function deleteResturant(id) {
    let { data } = await axios.delete(
      `https://foodyproj.onrender.com/Resturant/${id}`,
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      getResturants();
    } else {
      toast.error(data.message);
    }
  }

  async function getResturants() {
    let { data } = await axios.get("https://foodyproj.onrender.com/Resturant");
    if (data.success) {
      setResturants(data.Resturants);
    }
  }

  function updateClicked(Resturant) {
    $("#ResturantName").val(Resturant.ResturantName);
    $("#ResturantImage").val("");

    $("#headOfForm").text(`Update ${Resturant.ResturantName} Resturant`);
    $("#updateResturantBtn").removeClass("d-none");
    $("#closeUpdateResturantBtn").removeClass("d-none");
    $("#addResturantBtn").addClass("d-none");
    $("#updateResturantBtn").on("click", () => {
      return updateResturant(Resturant._id);
    });
  }

  function closeUpdateResturant() {
    $("#ResturantName").val("");
    $("#ResturantImage").val("");
    $("#headOfForm").text(`Add New Resturant`);
    $("#updateResturantBtn").addClass("d-none");
    $("#closeUpdateResturantBtn").addClass("d-none");
    $("#addResturantBtn").removeClass("d-none");
  }

  return (
    <div className="container d-flex flex-column /align-items-center justify-content-center">
      <div className="form w-fit text-center mb-4 mx-auto  ">
        <h6 id="headOfForm">Add New Resturant</h6>
        <div className="mb-3 w-100 mt-3">
          <input
            className="form-control"
            type="text"
            placeholder="Resturant Name"
            id="ResturantName"
          />
        </div>

        <div className="mb-3 w-100">
          <button
            onClick={addResturant}
            className="btn btn-primary"
            id="addResturantBtn"
          >
            Add Resturant
          </button>
          <button className="btn btn-warning d-none" id="updateResturantBtn">
            Update Resturant
          </button>
          <button
            id="closeUpdateResturantBtn"
            className="btn btn-dark ms-2 d-none"
            onClick={closeUpdateResturant}
          >
            <i className="fa fa-xmark "></i>
          </button>
        </div>
      </div>
      <div className="Resturants border-top pt-4 text-start w-100">
        <table className="table table-dark rounded-1 overflow-hidden shadow">
          <thead>
            <tr>
              <th>Resturant Name</th>
              <th>Phones</th>
              <th>Address</th>
              <th>Opening Time </th>
              <th>Closinging Time</th>
              <th>Area</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {resturants.map((Resturant) => (
              <tr className="mb-3">
                <td>{Resturant.ResturantName}</td>
                <td className="border-start">
                  <div className="d-flex align-items-center gap-3 mt-2">
                    <button
                      onClick={() => updateClicked(Resturant)}
                      className="btn btn-warning"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteResturant(Resturant._id)}
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
