import React ,{ useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import $ from "jquery";

export default function Categories() {
  let [categories, setCategories] = useState([]);
  useEffect(() => {
    getCategories();
  }, []);
  async function addCategory() {
    if ($("#categoryName").val() == "" || !$("#categoryImage")[0].files[0]) {
      toast.error("Please fill all the fields");
      return;
    }
    let formdata = new FormData();
    formdata.append("categoryImage", $("#categoryImage")[0].files[0]);
    formdata.append("categoryName", $("#categoryName").val());
    $("#addCategoryBtn")
      .html(`<div  style="width:23px;height:23px;" class="spinner-border text-dark"  role="status">
       <span class="sr-only">Loading...</span>
     </div>`);
    let { data } = await axios.post(
      "https://foodyproj.onrender.com/categories",
      formdata,
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
      }
    );
    if (data.success) {
      toast.success(data.message);
      getCategories();
    } else {
      toast.error(data.message);
    }
    $("#addCategoryBtn").html("Add Category");
  }

  async function updateCategory(id) {
    if ($("#categoryName").val() == "" && !$("#categoryImage")[0].files[0]) {
      toast.error("Please fill all the fields");
      return;
    }
    let formdata = new FormData();
    if ($("#categoryImage")[0].files[0]) {
      formdata.append("categoryImage", $("#categoryImage")[0].files[0]);
    }
    if ($("#categoryName").val() != "") {
      formdata.append("categoryName", $("#categoryName").val());
    }
    $("#updateCategoryBtn")
      .html(`<div  style="width:23px;height:23px;" class="spinner-border text-dark"  role="status">
       <span class="sr-only">Loading...</span>
     </div>`);
    let { data } = await axios.patch(
      `https://foodyproj.onrender.com/categories/${id}`,
      formdata,
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
      }
    );
    if (data.success) {
      toast.success(data.message);
      getCategories();
    } else {
      toast.error(data.message);
    }
    $("#updateCategoryBtn").html("Update Category");
  }

  async function deleteCategory(id) {
    let { data } = await axios.delete(
      `https://foodyproj.onrender.com/categories/${id}`,
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      getCategories();
    } else {
      toast.error(data.message);
    }
  }

  async function getCategories() {
    let { data } = await axios.get("https://foodyproj.onrender.com/categories");
    if (data.success) {
      setCategories(data.categories);
    }
  }

  function updateClicked(category) {
    $("#categoryName").val(category.categoryName);
    $("#categoryImage").val("");

    $("#headOfForm").text(`Update ${category.categoryName} Category`);
    $("#updateCategoryBtn").removeClass("d-none");
    $("#closeUpdateCategoryBtn").removeClass("d-none");
    $("#addCategoryBtn").addClass("d-none");
    $("#updateCategoryBtn").on("click", () => {
      return updateCategory(category._id);
    });
  }

  function closeUpdateCategory() {
    $("#categoryName").val("");
    $("#categoryImage").val("");
    $("#headOfForm").text(`Add New Category`);
    $("#updateCategoryBtn").addClass("d-none");
    $("#closeUpdateCategoryBtn").addClass("d-none");
    $("#addCategoryBtn").removeClass("d-none");
  }

  return (
    <div className="container d-flex flex-column /align-items-center justify-content-center">
      <div className="form w-fit text-center mb-4 mx-auto  ">
        <h6 id="headOfForm">Add New Category</h6>
        <div className="mb-3 w-100 mt-3">
          <input
            className="form-control"
            type="text"
            placeholder="Category Name"
            id="categoryName"
          />
        </div>
        <div className="mb-3 w-100">
          <input
            className="form-control"
            type="file"
            placeholder="Category Image"
            id="categoryImage"
          />
        </div>
        <div className="mb-3 w-100">
          <button
            onClick={addCategory}
            className="btn btn-primary"
            id="addCategoryBtn"
          >
            Add Category
          </button>
          <button className="btn btn-warning d-none" id="updateCategoryBtn">
            Update Category
          </button>
          <button
            id="closeUpdateCategoryBtn"
            className="btn btn-dark ms-2 d-none"
            onClick={closeUpdateCategory}
          >
            <i className="fa fa-xmark "></i>
          </button>
        </div>
      </div>
      <div className="categories border-top pt-4 text-start w-100">
        <h6 className="mb-4">All Categories :</h6>
        <div className="row">
          {categories.map((category) => (
            <div className="col-md-2 border-end">
              <div className="inner cursorPointer d-flex flex-column text-center h-100">
                <img
                  className="w-100 mb-3"
                  src={category.image.secure_url}
                  alt=""
                />
                <p className="mt-auto">{category.categoryName}</p>
                <div className="d-flex gap-3 mt-2">
                  <button
                    onClick={() => updateClicked(category)}
                    className="btn btn-warning"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteCategory(category._id)}
                    className="btn btn-danger"
                  >
                    <i className="fa fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
