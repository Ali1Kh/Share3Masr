import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import $ from "jquery";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export default function Resturants() {
  let [resturants, setResturants] = useState([]);
  let [categories, setCategories] = useState([]);
  let [areas, setAreas] = useState([]);

  let [phones, setPhones] = useState([]);

  useEffect(() => {
    getResturants();
    getCategories();
    getAreas();
  }, []);

  async function getAreas() {
    let { data } = await axios.get("https://foodyproj.onrender.com/area");
    if (data.success) {
      setAreas(data.areas);
    }
  }
  async function getCategories() {
    let { data } = await axios.get("https://foodyproj.onrender.com/categories");
    if (data.success) {
      setCategories(data.categories);
    }
  }
  async function getResturants() {
    let { data } = await axios.get("https://foodyproj.onrender.com/resturants");
    if (data.success) {
      setResturants(data.resturants);
    }
  }

  async function addResturant() {
    let name = $("#ResturantName").val();
    let category = $("#category").val();
    let area = $("#area").val();
    let password = $("#password").val();
    let address = $("#address").val();
    let openingTime = $("#openingTime").val();
    let closingTime = $("#closingTime").val();
    let image = $("#ResturantImage")[0].files[0];

    if (
      name == "" ||
      password == "" ||
      address == "" ||
      openingTime == "" ||
      closingTime == "" ||
      category == "" ||
      area == ""
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    if (!image) {
      toast.error("Please add an image");
      return;
    }

    if (phones.length == 0) {
      toast.error("Please add at least one phone number ");
      return;
    }

    let formdata = new FormData();
    formdata.append("name", name);
    formdata.append("category", category);
    formdata.append("area", area);
    formdata.append("password", password);
    formdata.append("address", address);
    formdata.append("openingTime", openingTime);
    formdata.append("closingTime", closingTime);
    formdata.append("resturantImage", image);
    phones.forEach((phone, index) => {
      formdata.append('phone[]', phone);
  });

    $("#addResturantBtn")
      .html(`<div  style="width:23px;height:23px;" class="spinner-border text-dark"  role="status">
       <span class="sr-only">Loading...</span>
     </div>`);
    let { data } = await axios.post(
      "https://foodyproj.onrender.com/resturants",
      formdata,
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
      `https://foodyproj.onrender.com/resturants/${id}`,
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
      `https://foodyproj.onrender.com/resturants/${id}`,
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

  function updateClicked(Resturant) {
    $("#ResturantName").val(Resturant.name);
    $("#ResturantImage").val("");

    $("#headOfForm").text(`Update ${Resturant.name} Resturant`);
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

  const handlePhoneChange = (event, value) => {
    setPhones(value);
  };

  return (
    <div className="container d-flex flex-column /align-items-center justify-content-center">
      <div className="form w-fit text-center mb-4 mx-auto  ">
        <h5 id="headOfForm">Add New Resturant</h5>

        <div className="row mt-4">
          <div className="col-md-6 d-flex align-items-center">
            <div className="mb-3 w-100">
              <input
                className="form-control "
                type="text"
                placeholder="Resturant Name"
                id="ResturantName"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3 d-flex ">
              <Stack spacing={3} sx={{ width: 500 }}>
                <Autocomplete
                  multiple
                  className="-form-control py-0"
                  id="tags-filled"
                  options={[]}
                  defaultValue={[]}
                  onChange={handlePhoneChange}
                  freeSolo
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="filled"
                      className="bg-white form-control"
                      label="Phone Numbers"
                      placeholder="Phone Numbers"
                    />
                  )}
                />
              </Stack>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3 w-100">
              <input
                className="form-control"
                type="password"
                placeholder="Resturant Password"
                id="password"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3 w-100">
              <input
                className="form-control"
                type="text"
                placeholder="Resturant Address"
                id="address"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3 w-100">
              <input
                className="form-control"
                type="time"
                placeholder="Opening Time"
                id="openingTime"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3 w-100">
              <input
                className="form-control"
                type="time"
                placeholder="Closing Time"
                id="closingTime"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3 w-100">
              <select name="category" id="category" className="form-control">
                <option value="">Select Category</option>
                {categories.map((category) => {
                  return (
                    <option value={category._id}>
                      {category.categoryName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3 w-100">
              <select name="area" id="area" className="form-control">
                <option value="">Select Area</option>
                {areas.map((area) => {
                  return <option value={area._id}>{area.areaName}</option>;
                })}
              </select>
            </div>
          </div>
          <div className="col">
            <div className="mb-3 w-100">
              <input className="form-control" type="file" id="ResturantImage" />
            </div>
          </div>
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
              <th>Working Time </th>
              <th>Area</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resturants.map((Resturant) => (
              <tr className="mb-3">
                <td>{Resturant.name}</td>
                <td>{Resturant.phone.join(" , ")}</td>
                <td>{Resturant.address}</td>
                <td>
                  {Resturant.openingTime} : {Resturant.closingTime}
                </td>
                <td>{Resturant.area.areaName}</td>
                <td>{Resturant.category.categoryName}</td>

                <td className="border-start">
                  <div className="d-flex align-items-center gap-3 mt-2">
                    <button
                      onClick={() => updateClicked(Resturant)}
                      className="btn btn-warning"
                    >
                      <i className="fa fa-pen"></i>
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
