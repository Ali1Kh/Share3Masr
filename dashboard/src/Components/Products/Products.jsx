import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import $ from "jquery";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { DataGridPro } from "@mui/x-data-grid-pro";

export default function Products() {
  let [products, setProducts] = useState([]);
  let [categories, setCategories] = useState([]);
  let [resturants, setResturants] = useState([]);
  let [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    getProducts();
    getCategories();
    getResturants();
    console.log($("#menuTable").width());
  }, []);

  useEffect(() => {
    $(
      ".css-13dsn0k-MuiDataGrid-root .MuiDataGrid-virtualScroller , .css-1pzb349"
    )
      .next()
      .css("display", "none");
  });

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
    try {
      let { data } = await axios.get("https://foodyproj.onrender.com/products");
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {}
  }

  async function searchProducts(search) {
    console.log(search);
    try {
      let { data } = await axios.get(
        "http://localhost:4000/products?search=" + search
      );
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {}
  }

  async function getSubCategoires(id) {
    try {
      let { data } = await axios.get(
        "https://foodyproj.onrender.com/resturants/subCategories/" + id
      );
      if (data.success) {
        setSubCategories(data.subCategories);
      }
    } catch (error) {}
  }

  async function addProduct() {
    try {
      let nameEN = $("#ProductNameEN").val();
      let nameAR = $("#ProductNameAR").val();
      let descriptionEN = $("#descriptionEN").val();
      let descriptionAR = $("#descriptionAR").val();
      let category = $("#category").val();
      let resturant = $("#resturant").val();
      let resturantCategory = $("#resturantCategory").val();
      let image = $("#productImage")[0].files[0];

      if (
        nameEN == "" ||
        nameAR == "" ||
        descriptionEN == "" ||
        descriptionAR == "" ||
        category == "" ||
        resturant == "" ||
        resturantCategory == ""
      ) {
        toast.error("Please fill all the fields");
        return;
      }

      let initData = {
        nameEN,
        nameAR,
        descriptionEN,
        descriptionAR,
        category,
        resturant,
        resturantCategory,
        prices: priceInputSets,
        extra: extraInputSets,
      };

      let priceError = false;
      priceInputSets.forEach((element) => {
        if (
          element.sizePrice === "" ||
          element.sizeNameEN === "" ||
          element.sizeNameAR === ""
        ) {
          priceError = true;
          toast.error("Please fill all price fields");
          return;
        }
      });
      if (priceError) return;

      let extraError = false;
      extraInputSets.forEach((element) => {
        if (
          element.price === "" &&
          element.itemNameEN === "" &&
          element.itemNameAR === ""
        ) {
          extraError = false;
          delete initData.extra;
          return;
        }
        if (
          element.price === "" ||
          element.itemNameEN === "" ||
          element.itemNameAR === ""
        ) {
          extraError = true;
          toast.error("Please fill all extra fields");
          return;
        }
      });

      if (extraError) return;

      const formData = new FormData();

      for (const key in initData) {
        if (Array.isArray(initData[key])) {
          initData[key].forEach((item, index) => {
            for (const subKey in item) {
              formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
            }
          });
        } else {
          formData.append(key, initData[key]);
        }
      }
      if (image) {
        formData.append("productImage", image);
      }

      $("#addProductBtn")
        .html(`<div  style="width:15px;height:15px;" class="spinner-border text-dark"  role="status">
       <span class="sr-only">Loading...</span>
     </div>`);
      let { data } = await axios.post(
        "https://foodyproj.onrender.com/Products",
        formData,
        {
          headers: {
            token: sessionStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        closeUpdateProduct();
        getProducts();
      } else {
        toast.error(data.message);
      }
      $("#addProductBtn").html("Add Product");
    } catch (error) {
      console.log(error);
    }
  }

  async function updateProduct() {
    try {
      let id = $("#updateProductBtn").attr("data-id");
      let nameEN = $("#ProductNameEN").val();
      let nameAR = $("#ProductNameAR").val();
      let descriptionEN = $("#descriptionEN").val();
      let descriptionAR = $("#descriptionAR").val();
      let resturantCategory = $("#resturantCategory").val();
      let image = $("#productImage")[0].files[0];

      if (
        nameEN == "" ||
        nameAR == "" ||
        descriptionEN == "" ||
        descriptionAR == "" ||
        resturantCategory == ""
      ) {
        toast.error("Please fill all the fields");
        return;
      }

      let initData = {
        nameEN,
        nameAR,
        descriptionEN,
        descriptionAR,
        resturantCategory,
        prices: priceInputSets,
        extra: extraInputSets,
      };

      let priceError = false;
      priceInputSets.forEach((element) => {
        if (
          element.sizePrice === "" ||
          element.sizeNameEN === "" ||
          element.sizeNameAR === ""
        ) {
          priceError = true;
          toast.error("Please fill all price fields");
          return;
        }
      });
      if (priceError) return;

      let extraError = false;
      extraInputSets.forEach((element) => {
        if (
          element.price === "" &&
          element.itemNameEN === "" &&
          element.itemNameAR === ""
        ) {
          extraError = false;
          initData.extra = [];
          return;
        }
        if (
          element.price === "" ||
          element.itemNameEN === "" ||
          element.itemNameAR === ""
        ) {
          extraError = true;
          toast.error("Please fill all extra fields");
          return;
        }
      });

      if (extraError) return;

      const formData = new FormData();

      for (const key in initData) {
        if (Array.isArray(initData[key])) {
          initData[key].forEach((item, index) => {
            for (const subKey in item) {
              formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
            }
          });
        } else {
          formData.append(key, initData[key]);
        }
      }
      if (image) {
        formData.append("productImage", image);
      }

      $("#updateProductBtn")
        .html(`<div  style="width:23px;height:23px;" class="spinner-border text-dark"  role="status">
       <span class="sr-only">Loading...</span>
     </div>`);

      let { data } = await axios.patch(
        `https://foodyproj.onrender.com/Products/${id}`,
        formData,
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
    } catch (error) {}
  }

  async function deleteProduct(id) {
    try {
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
    } catch (error) {}
  }

  async function updateClicked(Product) {
    await getSubCategoires(Product.resturant._id);
    $("#ProductNameEN").val(Product.nameEN);
    $("#ProductNameAR").val(Product.nameAR);
    $("#descriptionEN").val(Product.descriptionEN);
    $("#descriptionAR").val(Product.descriptionAR);
    $("#category").val(Product.category._id);
    $("#resturant").val(Product.resturant._id);
    $("#category").prop("disabled", true);
    $("#resturant").prop("disabled", true);
    console.log($("#resturantCategory"));
    $("#resturantCategory").val(Product.resturantCategory);
    $("#ProductImage").val("");
    let productPrices = Product.prices.map((item) => {
      return {
        sizeNameEN: item.sizeNameEN,
        sizeNameAR: item.sizeNameAR,
        sizePrice: item.sizePrice,
      };
    });
    setPriceInputSets(productPrices);
    if (Product.extra.length > 0) {
      let extraInputSets = Product.extra.map((item) => {
        return {
          itemNameEN: item.itemNameEN,
          itemNameAR: item.itemNameAR,
          price: item.price,
        };
      });
      setExtraInputSets(extraInputSets);
    }

    $("#headOfForm").text(`Update ${Product.nameEN} Product`);
    $("#updateProductBtn").removeClass("d-none");
    $("#closeUpdateProductBtn").removeClass("d-none");
    $("#addProductBtn").addClass("d-none");
    $("#updateProductBtn").attr("data-id", Product._id);
  }
  async function copyRow(Product) {
    await getSubCategoires(Product.resturant._id);
    $("#ProductNameEN").val(Product.nameEN);
    $("#ProductNameAR").val(Product.nameAR);
    $("#descriptionEN").val(Product.descriptionEN);
    $("#descriptionAR").val(Product.descriptionAR);
    $("#category").val(Product.category._id);
    $("#resturant").val(Product.resturant._id);
    $("#category").prop("disabled", true);
    $("#resturant").prop("disabled", true);
    $("#resturantCategory").val(Product.resturantCategory);
    $("#ProductImage").val("");
    let productPrices = Product.prices.map((item) => {
      return {
        sizeNameEN: item.sizeNameEN,
        sizeNameAR: item.sizeNameAR,
        sizePrice: item.sizePrice,
      };
    });
    setPriceInputSets(productPrices);
    if (Product.extra.length > 0) {
      let extraInputSets = Product.extra.map((item) => {
        return {
          itemNameEN: item.itemNameEN,
          itemNameAR: item.itemNameAR,
          price: item.price,
        };
      });
      setExtraInputSets(extraInputSets);
    }
  }

  function closeUpdateProduct() {
    $("#ProductName").val("");
    $("#description").val("");
    $("#category").val("");
    $("#resturant").val("");
    $("#resturantCategory").val("");
    $("#category").prop("disabled", false);
    $("#resturant").prop("disabled", false);
    $("#productImage").val("");

    setPriceInputSets([{ sizeNameEN: "", sizeNameAR: "", sizePrice: "" }]);
    setExtraInputSets([{ itemNameEN: "", itemNameAR: "", price: "" }]);

    $("#headOfForm").text(`Add New Product`);
    $("#updateProductBtn").addClass("d-none");
    $("#closeUpdateProductBtn").addClass("d-none");
    $("#addProductBtn").removeClass("d-none");
  }

  const [priceInputSets, setPriceInputSets] = useState([
    { sizeNameEN: "", sizeNameAR: "", sizePrice: "" },
  ]);

  const addPriceInputSet = () => {
    setPriceInputSets([
      ...priceInputSets,
      { sizeNameEN: "", sizeNameAR: "", sizePrice: "" },
    ]);
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
    { itemNameEN: "", itemNameAR: "", price: "" },
  ]);

  const addExtraInputSet = () => {
    setExtraInputSets([
      ...extraInputSets,
      { itemNameEN: "", itemNameAR: "", price: "" },
    ]);
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
                id="ProductNameEN"
              />
            </div>
          </div>

          <div className="col-md-6 d-flex align-items-center">
            <div className="mb-3 w-100">
              <input
                className="form-control "
                type="text"
                dir="rtl"
                placeholder="اسم الصنف"
                id="ProductNameAR"
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3 w-100">
              <input
                className="form-control"
                type="text"
                placeholder="Product Description"
                id="descriptionEN"
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3 w-100">
              <input
                className="form-control"
                type="text"
                placeholder="وصف الصنف"
                dir="rtl"
                id="descriptionAR"
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
                      {category?.categoryNameEN}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3 w-100">
              <select
                name="resturant"
                onChange={(e) => getSubCategoires(e.target.value)}
                id="resturant"
                className="form-control"
              >
                <option value="">Select Resturant</option>
                {resturants.map((resturant) => {
                  return (
                    <option value={resturant._id}>{resturant.nameEN}</option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3 w-100">
              <select
                name="resturantCategory"
                id="resturantCategory"
                className="form-control"
              >
                <option value="">Select Sub Category</option>
                {subCategories.length > 0 ? (
                  subCategories.map((subCategory) => {
                    return (
                      <option value={subCategory._id}>
                        {subCategory.nameEN}
                      </option>
                    );
                  })
                ) : (
                  <option disabled>
                    Select Resturant First To Get Sub Categories
                  </option>
                )}
              </select>
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3 w-100">
              <input className="form-control" type="file" id="productImage" />
            </div>
          </div>

          <div className="col-md-6">
            {priceInputSets.map((inputSet, index) => (
              <div key={index} className="mb-3 d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Size Name"
                  value={inputSet.sizeNameEN}
                  onChange={(e) =>
                    handlePriceInputChange(index, "sizeNameEN", e.target.value)
                  }
                />
                <input
                  type="text"
                  className="form-control"
                  dir="rtl"
                  placeholder="اسم الحجم"
                  value={inputSet.sizeNameAR}
                  onChange={(e) =>
                    handlePriceInputChange(index, "sizeNameAR", e.target.value)
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
          <div className="col-md-6  .mx-auto">
            {extraInputSets.map((inputSet, index) => (
              <div key={index} className="mb-3 d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Extra Name"
                  value={inputSet.itemNameEN}
                  onChange={(e) =>
                    handleExtraInputChange(index, "itemNameEN", e.target.value)
                  }
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="أسم الأضافة"
                  dir="rtl"
                  value={inputSet.itemNameAR}
                  onChange={(e) =>
                    handleExtraInputChange(index, "itemNameAR", e.target.value)
                  }
                />
                <input
                  type="number"
                  className="form-control pe-0"
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
          <button
            onClick={updateProduct}
            className="btn btn-warning d-none"
            id="updateProductBtn"
          >
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
      <div id="menuTable" className="Products border-top pt-4 text-start w-100">
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGridPro
            rows={products}
            columns={[
              {
                field: "Category",
                headerName: "Category",
                width: 150,
                resizable: true,
                valueGetter: (params) =>
                  `${params.row?.category?.categoryNameEN || ""}-
                    ${params.row?.category?.categoryNameAR || ""}`,
              },
              {
                field: "Resturant",
                headerName: "Resturant",
                width: 150,
                resizable: true,
                valueGetter: (params) =>
                  `${params.row?.resturant?.nameEN}/
                    ${params.row?.resturant?.nameAR}`,
              },

              {
                field: "SubCategory",
                headerName: "Sub Category",
                width: 150,
                resizable: true,
                valueGetter: (params) =>
                  `   ${
                    params.row?.resturantSubCategory[0]?.nameEN
                      ? params.row?.resturantSubCategory[0]?.nameEN
                      : ""
                  }
                    /
                    ${
                      params.row?.resturantSubCategory[0]?.nameAR
                        ? params.row?.resturantSubCategory[0]?.nameAR
                        : ""
                    }`,
              },
              {
                field: "Name",
                headerName: "Name",
                width: 150,
                resizable: true,
                valueGetter: (params) =>
                  `${params.row?.nameEN || ""} ${params.row?.nameAR || ""}`,
              },
              {
                field: "Description",
                headerName: "Description",
                width: 150,
                resizable: true,
                valueGetter: (params) =>
                  `${params.row?.descriptionEN || ""}-
                   ${params.row?.descriptionAR || ""}`,
              },

              {
                field: "Prices",
                headerName: "Prices",
                width: 150,

                resizable: true,
                renderCell: (params) => (
                  <>
                    <table>
                      <tbody>
                        {params.row?.prices.map((priceItem) => (
                          <tr>
                            <td>
                              {priceItem.sizeNameEN} / {priceItem.sizeNameAR}
                            </td>
                            <td>{priceItem.sizePrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ),
                valueGetter: (params) =>
                  `
                        ${params.row?.prices.map(
                          (priceItem) =>
                            `
                            ${priceItem.sizeNameEN} 
                            ${priceItem.sizeNameAR}
                            ${priceItem.sizePrice}
                            `
                        )}
                  `,
              },

              {
                field: "ExtraItems",
                headerName: "Extra Items	",
                width: 150,
                resizable: true,
                renderCell: (params) => (
                  <>
                    <table>
                      <tbody>
                        {params.row?.extra.map((extra) => (
                          <tr>
                            <td>
                              {extra.itemNameEN} / {extra.itemNameAR}
                            </td>
                            <span className="mx-1">{" = "}</span>
                            <td>{extra.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ),
                valueGetter: (params) =>
                  `${params.row?.extra.map(
                    (extra) =>
                      `    ${extra.itemNameEN} 
                         ${extra.itemNameAR}
                         ${extra.price}`
                  )}`,
              },
              {
                field: "image",
                headerName: "Image",
                width: 100,
                sortable: false,
                resizable: true,

                renderCell: (params) => (
                  <>
                    {params.row.image ? (
                      <img
                        src={params.row.image?.secure_url}
                        alt="Placeholder"
                        style={{ width: "100%", height: "auto" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </>
                ),
              },

              {
                field: "actions",
                headerName: "Actions",
                width: 120,
                sortable: false,
                renderCell: (params) => (
                  <>
                    <button
                      onClick={() => copyRow(params.row)}
                      className="btn btn-secondary me-2"
                    >
                      <i className="fa-regular fa-copy"></i>
                    </button>
                    <button
                      onClick={() => updateClicked(params.row)}
                      className="btn btn-warning me-2"
                    >
                      <i className="fa fa-pen"></i>
                    </button>
                    <button
                      onClick={() => deleteProduct(params.row._id)}
                      className="btn btn-danger"
                    >
                      <i className="fa fa-trash-can"></i>
                    </button>
                  </>
                ),
              },
              {
                field: "DateCreated",
                headerName: "Date Created",
                width: 150,
                resizable: true,

                valueGetter: (params) =>
                  `${
                    new Date(params.row?.createdAt).toLocaleDateString() || ""
                  }`,
              },
            ]}
            columnResizable={true}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                  page: 0,
                },
              },
            }}
            sx={{
              "& .MuiDataGrid-cell": {
                color: "white",
                // cursor: "pointer",
                maxHeight: "fit-content !important",
              },
              "& .MuiDataGrid-columnHeaders": {
                color: "white",
                backgroundColor: "#343a40",
              },
              "& .MuiDataGrid-row": {
                maxHeight: "fit-content !important",
              },
              "& .MuiDataGrid-virtualScroller": {
                overflowY: "auto !important",
              },
            }}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            autoHeight={true}
            disableColumnPinning
            pagination={true}
          />
        </Box>
      </div>
    </div>
  );
}
