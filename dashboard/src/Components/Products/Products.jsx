import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import $ from "jquery";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export default function Products() {
  let [products, setProducts] = useState([]);
  let [categories, setCategories] = useState([]);


  let [phones, setPhones] = useState([]);

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

 
  async function getCategories() {
    let { data } = await axios.get("https://foodyproj.onrender.com/categories");
    if (data.success) {
      setCategories(data.categories);
    }
  }
  async function getProducts() {
    let { data } = await axios.get("https://foodyproj.onrender.com/products");
    if (data.success) {
      setProducts(data.products);
    }
  }

  async function addProduct() {
    let name = $("#ProductName").val();
    let category = $("#category").val();
    let area = $("#area").val();
    let password = $("#password").val();
    let address = $("#address").val();
    let openingTime = $("#openingTime").val();
    let closingTime = $("#closingTime").val();
    let image = $("#ProductImage")[0].files[0];

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
    formdata.append("ProductImage", image);
    phones.forEach((phone, index) => {
      formdata.append("phone[]", phone);
    });

    $("#addProductBtn")
      .html(`<div  style="width:23px;height:23px;" class="spinner-border text-dark"  role="status">
       <span class="sr-only">Loading...</span>
     </div>`);
    let { data } = await axios.post(
      "https://foodyproj.onrender.com/Products",
      formdata,
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
      }
    );
    if (data.success) {
      toast.success(data.message);
      getProducts();
    } else {
      toast.error(data.message);
    }
    $("#addProductBtn").html("Add Product");
  }

  async function updateProduct(id) {
    if ($("#ProductName").val() == "") {
      toast.error("Please fill all the fields");
      return;
    }
    $("#updateProductBtn")
      .html(`<div  style="width:23px;height:23px;" class="spinner-border text-dark"  role="status">
       <span class="sr-only">Loading...</span>
     </div>`);
    let { data } = await axios.patch(
      `https://foodyproj.onrender.com/Products/${id}`,
      {
        ProductName: $("#ProductName").val(),
      },
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
      }
    );
    if (data.success) {
      toast.success(data.message);
      getProducts();
    } else {
      toast.error(data.message);
    }
    $("#updateProductBtn").html("Update Product");
  }

  async function deleteProduct(id) {
    let { data } = await axios.delete(
      `https://foodyproj.onrender.com/Products/${id}`,
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      getProducts();
    } else {
      toast.error(data.message);
    }
  }

  function updateClicked(Product) {
    $("#ProductName").val(Product.name);
    $("#ProductImage").val("");

    $("#headOfForm").text(`Update ${Product.name} Product`);
    $("#updateProductBtn").removeClass("d-none");
    $("#closeUpdateProductBtn").removeClass("d-none");
    $("#addProductBtn").addClass("d-none");
    $("#updateProductBtn").on("click", () => {
      return updateProduct(Product._id);
    });
  }

  function closeUpdateProduct() {
    $("#ProductName").val("");
    $("#ProductImage").val("");
    $("#headOfForm").text(`Add New Product`);
    $("#updateProductBtn").addClass("d-none");
    $("#closeUpdateProductBtn").addClass("d-none");
    $("#addProductBtn").removeClass("d-none");
  }

  const handlePhoneChange = (event, value) => {
    setPhones(value);
  };

  return (
    <div className="container d-flex flex-column /align-items-center justify-content-center">
      <div className="form w-fit text-center mb-4 mx-auto  ">
        <h5 id="headOfForm">Add New Product</h5>

        <div className="row mt-4">
          <div className="col-md-6 d-flex align-items-center">
            <div className="mb-3 w-100">
              <input
                className="form-control "
                type="text"
                placeholder="Product Name"
                id="ProductName"
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
                placeholder="Product Password"
                id="password"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3 w-100">
              <input
                className="form-control"
                type="text"
                placeholder="Product Address"
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
              <input className="form-control" type="file" id="ProductImage" />
            </div>
          </div>
        </div>

        <div className="mb-3 w-100">
          <button
            onClick={addProduct}
            className="btn btn-primary"
            id="addProductBtn"
          >
            Add Product
          </button>
          <button className="btn btn-warning d-none" id="updateProductBtn">
            Update Product
          </button>
          <button
            id="closeUpdateProductBtn"
            className="btn btn-dark ms-2 d-none"
            onClick={closeUpdateProduct}
          >
            <i className="fa fa-xmark "></i>
          </button>
        </div>
      </div>
      <div className="Products border-top pt-4 text-start w-100">
        <table className="table table-dark rounded-1 overflow-hidden shadow">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Description</th>
              <th>Address</th>
              <th>Working Time </th>
              <th>Area</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((Product) => (
              <tr className="mb-3">
                <td>{Product.name}</td>
                <td>{Product.description}</td>
                <td>{Product.address}</td>
                <td>
                  {Product.openingTime} : {Product.closingTime}
                </td>
                <td>{Product.area.areaName}</td>
                <td>{Product.category.categoryName}</td>

                <td className="border-start">
                  <div className="d-flex align-items-center gap-3 mt-2">
                    <button
                      disabled
                      onClick={() => updateClicked(Product)}
                      className="btn btn-warning"
                    >
                      <i className="fa fa-pen"></i>
                    </button>
                    <button
                      onClick={() => deleteProduct(Product._id)}
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
