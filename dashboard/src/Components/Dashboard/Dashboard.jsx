import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Categories from "../Categories/Categories";
import Areas from "../Areas/Areas";
import Resturants from "../Resturants/Resturants";
import Products from "../Products/Products";

export default function Dashboard() {
  const [tab, setTab] = useState(0);

  if (sessionStorage.getItem("token") === null) {
    return <Navigate to="/" />;
  }

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

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
                    sx={{ fontSize: "14px" }}
                    label="Manage Categories"
                    {...a11yProps(0)}
                  />
                  <Tab
                    sx={{ fontSize: "14px" }}
                    label="Manage Resturants"
                    {...a11yProps(1)}
                  />
                  <Tab
                    sx={{ fontSize: "14px" }}
                    label="Manage Menu"
                    {...a11yProps(2)}
                  />
                  <Tab
                    sx={{ fontSize: "14px" }}
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
                  <Categories />
                </>
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
