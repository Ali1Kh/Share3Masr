import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import $ from "jquery";

export default function Areas() {
  let [areas, setAreas] = useState([]);
  useEffect(() => {
    getAreas();
  }, []);
  async function addArea() {
    if ($("#AreaNameEN").val() == "" || $("#AreaNameAR").val() == "" || $("#deliveryFees").val() == "") {
      toast.error("Please fill all the fields");
      return;
    }

    $("#addAreaBtn")
      .html(`<div  style="width:23px;height:23px;" class="spinner-border text-dark"  role="status">
       <span class="sr-only">Loading...</span>
     </div>`);
    let { data } = await axios.post(
      "https://foodyproj.onrender.com/area",
      {
        areaNameEN: $("#AreaNameEN").val(),
        areaNameAR: $("#AreaNameAR").val(),
        deliveryFees: $("#deliveryFees").val(),
      },
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
      }
    );
    if (data.success) {
      toast.success(data.message);
      getAreas();
    } else {
      toast.error(data.message);
    }
    $("#addAreaBtn").html("Add Area");
  }

  async function updateArea() {
    let id = $("#updateAreaBtn").attr("data-id");
    if ($("#AreaNameEN").val() == "" || $("#AreaNameAR").val() == "" || $("#deliveryFees").val() == "") {
      toast.error("Please fill all the fields");
      return;
    }
    $("#updateAreaBtn")
      .html(`<div  style="width:23px;height:23px;" class="spinner-border text-dark"  role="status">
       <span class="sr-only">Loading...</span>
     </div>`);
    let { data } = await axios.patch(
      `https://foodyproj.onrender.com/area/${id}`,
      {
        areaNameEN: $("#AreaNameEN").val(),
        areaNameAR: $("#AreaNameAR").val(),
        deliveryFees: $("#deliveryFees").val(),
      },
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
      }
    );
    if (data.success) {
      toast.success(data.message);
      getAreas();
    } else {
      toast.error(data.message);
    }
    $("#updateAreaBtn").html("Update Area");
  }

  async function deleteArea(id) {
    let { data } = await axios.delete(
      `https://foodyproj.onrender.com/area/${id}`,
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      getAreas();
    } else {
      toast.error(data.message);
    }
  }

  async function getAreas() {
    let { data } = await axios.get("https://foodyproj.onrender.com/area");
    if (data.success) {
      setAreas(data.areas);
    }
  }

  function updateClicked(Area) {
    $("#AreaNameEN").val(Area.areaNameEN);
    $("#AreaNameAR").val(Area.areaNameAR);
    $("#deliveryFees").val(Area.deliveryFees);
    $("#headOfForm").text(`Update ${Area.areaNameEN} Area`);
    $("#updateAreaBtn").removeClass("d-none");
    $("#closeUpdateAreaBtn").removeClass("d-none");
    $("#addAreaBtn").addClass("d-none");
    $("#updateAreaBtn").attr("data-id", Area._id);
  }

  function closeUpdateArea() {
    $("#AreaNameEN").val("");
    $("#AreaNameAR").val("");
    $("#deliveryFees").val("");
    $("#headOfForm").text(`Add New Area`);
    $("#updateAreaBtn").addClass("d-none");
    $("#closeUpdateAreaBtn").addClass("d-none");
    $("#addAreaBtn").removeClass("d-none");
  }

  return (
    <div className="container d-flex flex-column /align-items-center justify-content-center">
      <div className="form w-fit text-center mb-4 mx-auto  ">
        <h6 id="headOfForm">Add New Area</h6>
        <div className="d-flex gap-3">
          <div className="mb-3 w-100 mt-3">
            <input
              className="form-control"
              type="text"
              placeholder="Area Name"
              id="AreaNameEN"
            />
          </div>
          <div className="mb-3 w-100 mt-3">
            <input
              className="form-control"
              type="text"
              dir="rtl"
              placeholder="أسم المنطقة"
              id="AreaNameAR"
            />
          </div>
        </div>

        <div className="mb-3 w-100 mt-1">
          <input
            className="form-control"
            type="number"
            placeholder="Delivery Fees"
            id="deliveryFees"
          />
        </div>
        <div className="mb-3 w-100">
          <button onClick={addArea} className="btn btn-primary" id="addAreaBtn">
            Add Area
          </button>
          <button
            onClick={updateArea}
            className="btn btn-warning d-none"
            id="updateAreaBtn"
          >
            Update Area
          </button>
          <button
            id="closeUpdateAreaBtn"
            className="btn btn-dark ms-2 d-none"
            onClick={closeUpdateArea}
          >
            <i className="fa fa-xmark "></i>
          </button>
        </div>
      </div>
      <div className="areas border-top pt-4 text-start w-100">
        <table className="table table-dark rounded-1 overflow-hidden shadow">
          <thead>
            <tr>
              <th>Area Name</th>
              <th>Delivery Fees</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((Area) => (
              <tr className="mb-3">
                <td>
                  {Area.areaNameEN}/{Area.areaNameAR}
                </td>
                <td>{Area.deliveryFees}</td>
                <td className="border-start">
                  <div className="d-flex align-items-center gap-3 mt-2">
                    <button
                      onClick={() => updateClicked(Area)}
                      className="btn btn-warning"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteArea(Area._id)}
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
