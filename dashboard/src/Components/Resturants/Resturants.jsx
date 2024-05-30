import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import $ from "jquery";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function Resturants() {
  let [resturants, setResturants] = useState([]);
  let [categories, setCategories] = useState([]);
  // let [areas, setAreas] = useState([]);

  let [phones, setPhones] = useState([]);

  useEffect(() => {
    getResturants();
    getCategories();
    // getAreas();
  }, []);

  // async function getAreas() {
  //   let { data } = await axios.get("https://foodyproj.onrender.com/area");
  //   if (data.success) {
  //     setAreas(data.areas);
  //   }
  // }
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
    let nameEN = $("#ResturantNameEN").val();
    let nameAR = $("#ResturantNameAR").val();
    let owner = $("#ResturantOwner").val();

    // let area = $("#area").val();
    let password = $("#password").val();
    // let address = $("#address").val();
    let openingTime = $("#openingTime").val();
    let closingTime = $("#closingTime").val();
    let image = $("#ResturantImage")[0].files[0];

    if (
      nameEN == "" ||
      nameAR == "" ||
      password == "" ||
      owner == "" ||
      openingTime == "" ||
      closingTime == ""
      //   ||   area == ""
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

    if (selectedCategories.length == 0) {
      toast.error("Please add at least one category");
      return;
    }

    if (resturantSubCategoryInputSets.length == 0) {
      toast.error("Please add at least one Sub Category");
      return;
    }

    let subCategoryError = false;
    resturantSubCategoryInputSets.forEach((element) => {
      if (element.nameEN === "" || element.nameAR === "") {
        subCategoryError = true;
        toast.error("Please fill all Sub Category fields");
        return;
      }
    });

    if (subCategoryError) return;

    let formdata = new FormData();
    formdata.append("nameEN", nameEN);
    formdata.append("nameAR", nameAR);
    formdata.append("owner", owner);

    selectedCategories.forEach((category, index) => {
      formdata.append("category[]", category);
    });
    // formdata.append("area", area);
    formdata.append("password", password);
    // formdata.append("address", address);
    formdata.append("openingTime", openingTime);
    formdata.append("closingTime", closingTime);
    formdata.append("resturantImage", image);
    phones.forEach((phone, index) => {
      formdata.append("phone[]", phone);
    });
    resturantSubCategoryInputSets.forEach((subCategory, index) => {
      formdata.append(`subCategories[${index}][nameEN]`, subCategory.nameEN);
      formdata.append(`subCategories[${index}][nameAR]`, subCategory.nameAR);
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

  async function updateResturant() {
    let id = $("#updateResturantBtn").attr("data-id");
    let nameEN = $("#ResturantNameEN").val();
    let nameAR = $("#ResturantNameAR").val();
    let owner = $("#ResturantOwner").val();
    let password = $("#password").val();
    let openingTime = $("#openingTime").val();
    let closingTime = $("#closingTime").val();
    let image = $("#ResturantImage")[0].files[0];

    if (
      nameEN == "" ||
      nameAR == "" ||
      owner == "" ||
      openingTime == "" ||
      closingTime == ""
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    if (phones.length == 0) {
      toast.error("Please add at least one phone number ");
      return;
    }

    if (selectedCategories.length == 0) {
      toast.error("Please add at least one category");
      return;
    }

    if (resturantSubCategoryInputSets.length == 0) {
      toast.error("Please add at least one Sub Category");
      return;
    }

    let subCategoryError = false;
    resturantSubCategoryInputSets.forEach((element) => {
      if (element.nameEN === "" || element.nameAR === "") {
        subCategoryError = true;
        toast.error("Please fill all Sub Category fields");
        return;
      }
    });

    if (subCategoryError) return;

    let formdata = new FormData();
    formdata.append("nameEN", nameEN);
    formdata.append("nameAR", nameAR);
    formdata.append("owner", owner);

    selectedCategories.forEach((category, index) => {
      formdata.append("category[]", category);
    });
    if (password != "") {
      formdata.append("password", password);
    }
    formdata.append("openingTime", openingTime);
    formdata.append("closingTime", closingTime);
    if (image) {
      formdata.append("resturantImage", image);
    }
    phones.forEach((phone, index) => {
      formdata.append("phone[]", phone);
    });
    resturantSubCategoryInputSets.forEach((subCategory, index) => {
      if (subCategory._id) {
        formdata.append(`subCategories[${index}][_id]`, subCategory._id);
      }
      formdata.append(`subCategories[${index}][nameEN]`, subCategory.nameEN);
      formdata.append(`subCategories[${index}][nameAR]`, subCategory.nameAR);
    });

    $("#updateResturantBtn")
      .html(`<div  style="width:23px;height:23px;" class="spinner-border text-dark"  role="status">
       <span class="sr-only">Loading...</span>
     </div>`);
    let { data } = await axios.patch(
      `https://foodyproj.onrender.com/resturants/${id}`,
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
    $("#ResturantNameEN").val(Resturant.nameEN);
    $("#ResturantNameAR").val(Resturant.nameAR);
    $("#ResturantOwner").val(Resturant.owner);
    $("#password").val("");
    $("#openingTime").val(Resturant.openingTime);
    $("#closingTime").val(Resturant.closingTime);
    handleChange({
      target: { value: Resturant.category.map((category) => category._id) },
    });
    setPhones(Resturant.phone);

    let subCategories = Resturant.subCategories.map((item) => {
      return {
        _id: item._id,
        nameEN: item.nameEN,
        nameAR: item.nameAR,
      };
    });
    setResturantSubCategoryInputSets(subCategories);
    //
    $("#headOfForm").text(`Update ${Resturant.nameEN} Resturant`);
    $("#updateResturantBtn").removeClass("d-none");
    $("#closeUpdateResturantBtn").removeClass("d-none");
    $("#addResturantBtn").addClass("d-none");
    $("#updateResturantBtn").attr("data-id", Resturant._id);
  }

  function closeUpdateResturant() {
    $("#ResturantNameEN").val("");
    $("#ResturantNameAR").val("");
    $("#ResturantOwner").val("");
    $("#password").val("");
    $("#openingTime").val("");
    $("#closingTime").val("");
    $("#ResturantImage").val("");
    handleChange({
      target: { value: [] },
    });
    setPhones([]);
    setResturantSubCategoryInputSets([{ nameEN: "", nameAR: "" }]);

    $("#headOfForm").text(`Add New Resturant`);
    $("#updateResturantBtn").addClass("d-none");
    $("#closeUpdateResturantBtn").addClass("d-none");
    $("#addResturantBtn").removeClass("d-none");
  }

  const handlePhoneChange = (event, value) => {
    setPhones(value);
  };

  const [resturantSubCategoryInputSets, setResturantSubCategoryInputSets] =
    useState([{ nameEN: "", nameAR: "" }]);

  const addResturantCategoryInputSet = () => {
    setResturantSubCategoryInputSets([
      ...resturantSubCategoryInputSets,
      { nameEN: "", nameAR: "" },
    ]);
  };

  const handleResturantInputChange = (index, field, value) => {
    const updatedResturantInputSets = [...resturantSubCategoryInputSets];
    updatedResturantInputSets[index][field] = value;
    setResturantSubCategoryInputSets(updatedResturantInputSets);
  };

  const deleteResturantInputSet = (index) => {
    const updatedResturantInputSets = [...resturantSubCategoryInputSets];
    updatedResturantInputSets.splice(index, 1);
    setResturantSubCategoryInputSets(updatedResturantInputSets);
  };

  const [selectedCategories, setSelectedCategories] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div className="container d-flex flex-column /align-items-center justify-content-center">
      <div className="form w-fit text-center mb-4 mx-auto  ">
        <h5 id="headOfForm">Add New Resturant</h5>

        <div className="row mt-4">
          <div className="col-md-6">
            <div className="mb-3 w-100">
              <input
                className="form-control "
                type="text"
                placeholder="Resturant Name"
                id="ResturantNameEN"
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3 w-100">
              <input
                className="form-control "
                type="text"
                dir="rtl"
                placeholder="اسم المطعم"
                id="ResturantNameAR"
              />
            </div>
          </div>

          <div className="col-md-6 d-flex align-items-center">
            <div className="mb-3 w-100">
              <input
                className="form-control "
                type="text"
                placeholder="Resturant Owner"
                id="ResturantOwner"
              />
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

          {/* <div className="col-md-6">
            <div className="mb-3 w-100">
              <input
                className="form-control"
                type="text"
                placeholder="Resturant Address"
                id="address"
              />
            </div>
          </div> */}
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
              <FormControl sx={{ width: "100%" }}>
                <InputLabel
                  sx={{ backgroundColor: "white", borderRadius: "2px" }}
                  id="demo-multiple-checkbox-label"
                >
                  Select Categories
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={selectedCategories}
                  onChange={handleChange}
                  input={<OutlinedInput label="Select Categories" />}
                  renderValue={(selected) =>
                    selected
                      .map((categoryId) => {
                        const category = categories.find(
                          (c) => c._id === categoryId
                        );
                        return category ? category.categoryNameEN : "";
                      })
                      .join(", ")
                  }
                  MenuProps={MenuProps}
                  className="form-control p-0"
                >
                  {categories.map((category) => (
                    <MenuItem key={category?._id} value={category?._id}>
                      <Checkbox
                        checked={selectedCategories.indexOf(category?._id) > -1}
                      />
                      <ListItemText
                        primary={
                          category?.categoryNameEN +
                          "/" +
                          category.categoryNameAR
                        }
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* <select name="category" id="category" className="form-control">
                <option value="">Select Category</option>
                {categories.map((category) => {
                  return (
                    <option value={category._id}>
                      {category?.categoryName}
                    </option>
                  );
                })}
              </select> */}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3 d-flex ">
              <Stack spacing={3} sx={{ width: "100%" }}>
                <Autocomplete
                  multiple
                  className="form-control p-0"
                  id="tags-filled"
                  options={[]}
                  value={phones}
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

          {/* <div className="col-md-6">
            <div className="mb-3 w-100">
              <select name="area" id="area" className="form-control">
                <option value="">Select Area</option>
                {areas.map((area) => {
                  return <option value={area._id}>{area.areaName}</option>;
                })}
              </select>
            </div>
          </div> */}
          <div className="col-md-6">
            {resturantSubCategoryInputSets.map((inputSet, index) => (
              <div key={index} className="mb-3 d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Sub Category Name"
                  value={inputSet.nameEN}
                  onChange={(e) => {
                    handleResturantInputChange(index, "nameEN", e.target.value);
                  }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="اسم الفئة الفرعية"
                  dir="rtl"
                  id="nameAR"
                  value={inputSet.nameAR}
                  onChange={(e) => {
                    handleResturantInputChange(index, "nameAR", e.target.value);
                  }}
                />
                {index === resturantSubCategoryInputSets.length - 1 && (
                  <button
                    className="btn btn-secondary"
                    onClick={addResturantCategoryInputSet}
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                )}
                <button
                  className="btn btn-danger"
                  onClick={() => deleteResturantInputSet(index)}
                  disabled={resturantSubCategoryInputSets.length === 1}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            ))}
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
          <button
            onClick={updateResturant}
            className="btn btn-warning d-none"
            id="updateResturantBtn"
          >
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
      <div className="Resturants border-top pt-4 text-start w-100 overflow-x-auto">
        <table className="table table-dark rounded-1 overflow-hidden shadow ">
          <thead>
            <tr>
              <th>Resturant Name</th>
              <th>Owner</th>
              <th>Phones</th>
              {/* <th>Address</th> */}
              <th>Working Time </th>
              <th>Category</th>
              <th>Sub Categories</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resturants.map((Resturant) => (
              <tr className="mb-3">
                <td>
                  {Resturant.nameEN}/{Resturant.nameAR}
                </td>
                <td>{Resturant.owner}</td>
                <td>{Resturant.phone.join(" , ")}</td>
                {/* <td>{Resturant.address}</td> */}
                <td>
                  {Resturant.openingTime} : {Resturant.closingTime}
                </td>
                <td>
                  {Resturant.category
                    ?.map(
                      (categoryItem) =>
                        "(" +
                        categoryItem.categoryNameEN +
                        "-" +
                        categoryItem.categoryNameAR +
                        ")"
                    )
                    .join(",")}
                </td>
                <td>
                  {Resturant.subCategories
                    ?.map(
                      (subCategoryyItem) =>
                        "(" +
                        subCategoryyItem.nameEN +
                        "-" +
                        subCategoryyItem.nameAR +
                        ")"
                    )
                    .join(",")}
                </td>
                <td>
                  <img
                    width={90}
                    height={90}
                    src={Resturant.image.secure_url}
                    className="w-100"
                  />
                </td>
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
