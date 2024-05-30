import axios from "axios";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGridPro } from "@mui/x-data-grid-pro";
import $ from "jquery";
import toast from "react-hot-toast";

export default function Orders() {
  let [orders, setOrders] = useState([]);

  useEffect(() => {
    $(
      ".css-13dsn0k-MuiDataGrid-root .MuiDataGrid-virtualScroller , .css-1pzb349"
    )
      .next()
      .remove();
  });

  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {
    let { data } = await axios.get(
      "https://foodyproj.onrender.com/orders/allOrdersHistory",
      {
        headers: {
          token: sessionStorage.getItem("token"),
        },
      }
    );
    if (data.success) {
      setOrders(data.orders);
    }
  }

  async function verifyOrder(id) {
    try {
      let { data } = await axios.patch(
        "https://foodyproj.onrender.com/orders/verifyOrder/" + id,
        {},
        {
          headers: {
            token: sessionStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {}
  }
  async function unVerifyOrder(id) {
    try {
      let { data } = await axios.patch(
        "https://foodyproj.onrender.com/orders/unVerifyOrder/" + id,
        {},
        {
          headers: {
            token: sessionStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {}
  }

  return (
    <>
      <div className="container">
        <h6 className="mb-3">Orders Overview</h6>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGridPro
            rows={orders}
            columns={[
              {
                field: "phone",
                headerName: "Customer",
                width: 130,
                resizable: true,
                renderCell: (params) => (
                  <>
                    <span title={params.row?.customerName}>
                      {params.row?.phone}
                    </span>
                  </>
                ),
              },
              {
                field: "Resturant",
                headerName: "Resturant",
                width: 150,
                resizable: true,
                valueGetter: (params) =>
                  params.row?.resturants
                    .map((resturant) => resturant.nameEN)
                    .join(","),
              },

              {
                field: "receipt",
                headerName: "Receipt",
                width: 100,
                resizable: true,
                valueGetter: (params) => params.row?.receipt?.secure_url,
                renderCell: (params) => (
                  <a target="_blank" href={params.row?.receipt?.secure_url}>
                    Receipt
                  </a>
                ),
              },
              {
                field: "status",
                headerName: "Status",
                width: 100,
                resizable: true,
              },

              //   {
              //     field: "Prices",
              //     headerName: "Prices",
              //     width: 150,
              //     resizable: true,
              //     renderCell: (params) => (
              //       <>
              //         <table>
              //           <tbody>
              //             {params.row?.prices.map((priceItem) => (
              //               <tr>
              //                 <td>
              //                   {priceItem.sizeNameEN} / {priceItem.sizeNameAR}
              //                 </td>
              //                 <td>{priceItem.sizePrice}</td>
              //               </tr>
              //             ))}
              //           </tbody>
              //         </table>
              //       </>
              //     ),
              //     valueGetter: (params) =>
              //       `
              //             ${params.row?.prices.map(
              //               (priceItem) =>
              //                 `
              //                 ${priceItem.sizeNameEN}
              //                 ${priceItem.sizeNameAR}
              //                 ${priceItem.sizePrice}
              //                 `
              //             )}
              //       `,
              //   },

              {
                field: "delivery",
                headerName: "Delivery",
                width: 100,
                align: "center",
                resizable: true,
                valueGetter: (params) =>
                  `${params.row?.deliveryWorker?.name}-${params.row?.deliveryWorker?.phone}`,
                renderCell: (params) => (
                  <>
                    <span title={params.row?.deliveryWorker?.name}>
                      {params.row?.deliveryWorker?.phone}
                    </span>
                  </>
                ),
              },
              {
                field: "totalOrderPrice",
                headerName: "Order Price",
                width: 100,
                align: "center",
                resizable: true,
              },
              {
                field: "totalPrice",
                headerName: "Total Price",
                width: 100,
                align: "center",
                resizable: true,
              },
              {
                field: "DateCreated",
                headerName: "Order Date",
                width: 170,
                resizable: true,

                valueGetter: (params) =>
                  `${
                    new Date(params.row?.createdAt).toLocaleDateString(
                      "en-eg",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      }
                    ) || ""
                  } - ${
                    new Date(params.row?.createdAt).toLocaleTimeString(
                      "en-eg",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    ) || ""
                  }`,
              },
              {
                field: "isVerified",
                headerName: "Verify",
                width: 110,
                align: "center",
                resizable: true,
                renderCell: (params) => (
                  <>
                    {params.row?.isVerified ? (
                      <button
                        onClick={() => unVerifyOrder(params.row._id)}
                        className="btn btn-success "
                      >
                        Checked 
                      </button>
                    ) : (
                      <button
                        onClick={() => verifyOrder(params.row._id)}
                        className="btn btn-warning "
                      >
                        Unchecked 
                      </button>
                    )}
                  </>
                ),
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
    </>
  );
}
