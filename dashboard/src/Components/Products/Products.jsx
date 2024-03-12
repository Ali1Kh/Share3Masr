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
  let [resturants, setResturants] = useState([]);
  let [phones, setPhones] = useState([]);

  useEffect(() => {
    getProducts();
    getCategories();
    getResturants();
  }, []);

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
  async function getProducts() {
    let { data } = await axios.get("https://foodyproj.onrender.com/products");
    if (data.success) {
      setProducts(data.products);
    }
  }

  async function addProduct() {
    let name = $("#ProductName").val();
    let description = $("#description").val();
    let category = $("#category").val();
    let resturant = $("#resturant").val();

    if (name == "" || description == "" || category == "" || resturant == "") {
      toast.error("Please fill all the fields");
      return;
    }

    let priceError = false;
    priceInputSets.forEach((element) => {
      if (element.sizePrice === "" || element.sizeName === "") {
        priceError = true;
        toast.error("Please fill all price fields");
        return;
      }
    });
    if (priceError) return;
    let extraError = false;
    extraInputSets.forEach((element) => {
      if (element.price === "" || element.itemName === "") {
        extraError = true;
        toast.error("Please fill all extra fields");
        return;
      }
    });

    if (extraError) return;

    $("#addProductBtn")
      .html(`<div  style="width:15px;height:15px;" class="spinner-border text-dark"  role="status">
       <span class="sr-only">Loading...</span>
     </div>`);
    let { data } = await axios.post(
      "https://foodyproj.onrender.com/Products",
      {
        name,
        description,
        category,
        resturant,
        prices: priceInputSets,
        extra: extraInputSets,
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
      `https://foodyproj.onrender.com/products/${id}`,
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

  const [priceInputSets, setPriceInputSets] = useState([
    { sizeName: "", sizePrice: "" },
  ]);

  const addPriceInputSet = () => {
    setPriceInputSets([...priceInputSets, { sizeName: "", sizePrice: "" }]);
  };

  const handlePriceInputChange = (index, field, value) => {
    const updatedPriceInputSets = [...priceInputSets];
    updatedPriceInputSets[index][field] = value;
    setPriceInputSets(updatedPriceInputSets);
  };

  const deletePriceInputSet = (index) => {
    const updatedPriceInputSets = [...priceInputSets];
    updatedPriceInputSets.splice(index, 1);
    setPriceInputSets(updatedPriceInputSets);
  };

  //

  const [extraInputSets, setExtraInputSets] = useState([
    { itemName: "", price: "" },
  ]);

  const addExtraInputSet = () => {
    setExtraInputSets([...extraInputSets, { itemName: "", price: "" }]);
  };

  const handleExtraInputChange = (index, field, value) => {
    const updatedExtraInputSets = [...extraInputSets];
    updatedExtraInputSets[index][field] = value;
    setExtraInputSets(updatedExtraInputSets);
  };

  const deleteExtraInputSet = (index) => {
    const updatedExtraInputSets = [...extraInputSets];
    updatedExtraInputSets.splice(index, 1);
    setExtraInputSets(updatedExtraInputSets);
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
            <div className="mb-3 w-100">
              <input
                className="form-control"
                type="text"
                placeholder="Product Description"
                id="description"
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
              <select name="resturant" id="resturant" className="form-control">
                <option value="">Select Resturant</option>
                {resturants.map((resturant) => {
                  return (
                    <option value={resturant._id}>{resturant.name}</option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="col-md-6">
            {priceInputSets.map((inputSet, index) => (
              <div key={index} className="mb-3 d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Size Name"
                  value={inputSet.sizeName}
                  onChange={(e) =>
                    handlePriceInputChange(index, "sizeName", e.target.value)
                  }
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Size Price"
                  value={inputSet.sizePrice}
                  onChange={(e) =>
                    handlePriceInputChange(index, "sizePrice", e.target.value)
                  }
                />
                {index === priceInputSets.length - 1 && (
                  <button
                    className="btn btn-secondary"
                    onClick={addPriceInputSet}
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                )}
                <button
                  className="btn btn-danger"
                  onClick={() => deletePriceInputSet(index)}
                  disabled={priceInputSets.length === 1}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
          <div className="col-md-6">
            {extraInputSets.map((inputSet, index) => (
              <div key={index} className="mb-3 d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Extra Name"
                  value={inputSet.itemName}
                  onChange={(e) =>
                    handleExtraInputChange(index, "itemName", e.target.value)
                  }
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Extra Price"
                  value={inputSet.price}
                  onChange={(e) =>
                    handleExtraInputChange(index, "price", e.target.value)
                  }
                />
                {index === extraInputSets.length - 1 && (
                  <button
                    className="btn btn-secondary"
                    onClick={addExtraInputSet}
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                )}
                <button
                  className="btn btn-danger"
                  onClick={() => deleteExtraInputSet(index)}
                  disabled={extraInputSets.length === 1}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            ))}
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
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Resturant</th>
              <th>Prices</th>
              <th>Extra Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((Product) => (
              <tr className="mb-3">
                <td>{Product.name}</td>

                <td>{Product.description}</td>
                <td>{Product.category.categoryName}</td>
                <td>{Product.resturant.name}</td>
                <td>
                  <table className="table table-dark">
                    {/* <thead>
                      <tr>
                        <th className="small"> Name</th>
                        <th className="small">Price</th>
                      </tr>
                    </thead> */}
                    <tbody>
                      {Product.prices.map((priceItem) => (
                        <tr>
                          <td>{priceItem.sizeName}</td>
                          <td>{priceItem.sizePrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="table table-dark">
                    {/* <thead>
                      <tr>
                        <th className="small"> Name</th>
                        <th className="small">Price</th>
                      </tr>
                    </thead> */}
                    <tbody>
                      {Product.extra.map((extra) => (
                        <tr>
                          <td>{extra.itemName}</td>
                          <td>{extra.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>

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
