import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import axios from "axios";
import { toast } from "react-hot-toast";
import $ from "jquery";

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  let [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  if (sessionStorage.getItem("token") === null) {
    return <Navigate to="/" />;
  }

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  async function addCategory() {
    if ($("#categoryName").val() == "") {
      toast.error("Please fill all the fields");
    }
    let formdata = new FormData();
    formdata.append("categoryImage", $("#categoryImage")[0].files[0]);
    formdata.append("categoryName", $("#categoryName").val());

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
  }

  async function getCategories() {
    let { data } = await axios.get("https://foodyproj.onrender.com/categories");
    if (data.success) {
      setCategories(data.categories);
    }
  }

  return (
    <>
      <div className="overflow-x-hidden">
        <div className="row ">
          <div className="col-md-3">
            <div className="overflow-hidden ">
              <Box
                sx={{
                  bgcolor: "background.paper",
                  display: "flex",
                  width: "fit-content",
                  padding: "20px",
                  position: "fixed",
                  top: "0",
                  bottom: "0",
                }}
              >
                <Tabs
                  orientation="vertical"
                  value={tab}
                  onChange={handleChange}
                  aria-label="Vertical tabs example "
                >
                  <Tab
                    sx={{ fontSize: "17px" }}
                    label="Manage Categories"
                    {...a11yProps(0)}
                  />
                  <Tab
                    sx={{ fontSize: "17px" }}
                    label="Manage Resturants"
                    {...a11yProps(1)}
                  />
                  <Tab
                    sx={{ fontSize: "17px" }}
                    label="Manage Menu"
                    {...a11yProps(2)}
                  />
                  <Tab
                    sx={{ fontSize: "17px" }}
                    label="Manage Areas"
                    {...a11yProps(3)}
                  />
                </Tabs>
              </Box>
            </div>
          </div>
          <div className="col-md-9">
            <div className="inner">
              <TabPanel value={tab} index={0}>
                <>
                  <div className="container d-flex flex-column /align-items-center justify-content-center">
                    <div className="form w-fit text-center mb-4 mx-auto  ">
                      <h6>Add New Category</h6>
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
                        >
                          Add Category
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
                                <button className="btn btn-warning">
                                  Update
                                </button>
                                <button className="btn btn-danger">
                                  <i className="fa fa-trash-can"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              </TabPanel>
              <TabPanel value={tab} index={1}>
                1
              </TabPanel>
              <TabPanel value={tab} index={2}>
                2
              </TabPanel>
              <TabPanel value={tab} index={3}>
                3
              </TabPanel>
              <TabPanel value={tab} index={4}>
                4
              </TabPanel>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}
