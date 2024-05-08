import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Categories from "../Categories/Categories";
import Areas from "../Areas/Areas";
import Resturants from "../Resturants/Resturants";
import Products from "../Products/Products";
import $ from "jquery";
import Delivery from "../Delivery/Delivery";
import Orders from "../Orders/Orders";

export default function Dashboard() {
  const [tab, setTab] = useState(0);

  let navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth >= 768) {
      $("#offcanvasScrolling").addClass("show");
    }
  }, []);

  if (sessionStorage.getItem("token") === null) {
    return <Navigate to="/" />;
  }

  function sideBarClosed() {
    $("#sideBarCol").removeClass("col-md-3");
  }
  function sideBarOpened() {
    $("#sideBarCol").addClass("col-md-3");
  }

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <div>
        <nav className="navbar navbar-expand-lg bg-light mb-4">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse justify-content-center"
              id="navbarNavDropdown"
            >
              <Box
                sx={{
                  bgcolor: "transparent",
                  display: "flex",
                  width: "fit-content",
                  padding: "0px",
                  top: "0",
                  bottom: "0",
                }}
              >
                <Tabs
                  orientation="horizontal"
                  value={tab}
                  onChange={handleChange}
                  aria-label="Vertical tabs example "
                >
                  <Tab
                    sx={{ fontSize: "14px" }}
                    label="Manage Categories"
                    {...a11yProps(0)}
                    onClick={() => navigate("/dashboard/categories")}
                  />
                  <Tab
                    sx={{ fontSize: "14px" }}
                    label="Manage Resturants"
                    {...a11yProps(1)}
                    onClick={() => navigate("/dashboard/resturants")}
                  />
                  <Tab
                    sx={{ fontSize: "14px" }}
                    label="Manage Menu"
                    {...a11yProps(2)}
                    onClick={() => navigate("/dashboard/products")}
                  />
                  <Tab
                    sx={{ fontSize: "14px" }}
                    label="Manage Areas"
                    {...a11yProps(3)}
                    onClick={() => navigate("/dashboard/areas")}
                  />
                  <Tab
                    sx={{ fontSize: "14px" }}
                    label="Delivery Workers"
                    {...a11yProps(4)}
                    onClick={() => navigate("/dashboard/delivery")}
                  />
                  <Tab
                    sx={{ fontSize: "14px" }}
                    label="Orders Overview"
                    {...a11yProps(5)}
                    onClick={() => navigate("/dashboard/orders")}
                  />
                </Tabs>
              </Box>
            </div>
          </div>
        </nav>

        <Outlet />
        {/* <TabPanel value={tab} index={0}>
          <><Categories /></>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Resturants />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <Products />
        </TabPanel>
        <TabPanel value={tab} index={3}>
          <Areas />
        </TabPanel>
        <TabPanel value={tab} index={4}>
          <Delivery />
        </TabPanel>
        <TabPanel value={tab} index={5}>
          <Orders />
        </TabPanel> */}
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
