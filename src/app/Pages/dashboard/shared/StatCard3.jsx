import React, { useState, useEffect } from "react";
import { Grid, Card, IconButton, Icon, TextField, MenuItem, Box, Button } from "@material-ui/core";
import axios from "../../../../axios";
import Spinner from "../../../Shared/Spinner/Spinner";

import { VscServerProcess } from "react-icons/vsc";
import { TiCancel } from "react-icons/ti";
import { FaHandHoldingUsd, FaTruckPickup, FaShippingFast } from "react-icons/fa";
import { GiConfirmed, GiReturnArrow } from "react-icons/gi";
import { RiRefund2Line } from "react-icons/ri";
import { MdOutlinePendingActions, MdOutlineDownloadDone } from "react-icons/md";

import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

const StatCard3 = () => {
  const [isLoading, setIsLoading] = useState(false);
  // const [day, setDay] = useState(1);
  const [dataList, setDataList] = useState(null);

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isReset, setIsReset] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setIsLoading(true);
  //       let obj = {
  //         startTime: new Date().toISOString(),
  //         endTime: new Date().toISOString(),
  //       };
  //       let res = await axios.post(`admin/order-history`, obj);
  //       console.log(res);
  //       if (res?.data?.success) {
  //         console.log(res);
  //         setDataList(res?.data?.data);
  //       }
  //       setIsLoading(false);
  //     } catch (err) {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [isReset]);

  const filterHander = async () => {
    try {
      setIsLoading(true);
      let obj = {
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      };
      let res = await axios.post(`admin/order-history`, obj);
      console.log(res);
      if (res?.data?.success) {
        console.log(res);
        setDataList(res?.data?.data);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Card className="mb-4">
        <Box
          sx={{
            borderBottom: "1px solid #F6F6F6",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            py: 3,
            px: 2,
          }}
          elevation={3}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ mr: 1 }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    className="min-w-188"
                    label="Start Date"
                    inputVariant="standard"
                    type="text"
                    autoOk={true}
                    variant="outlined"
                    size="small"
                    value={startTime}
                    onChange={(t) => setStartTime(t)}
                  />
                </MuiPickersUtilsProvider>
              </Box>
              <Box sx={{ mr: 1 }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    className="min-w-188"
                    label="End Date"
                    inputVariant="standard"
                    type="text"
                    autoOk={true}
                    variant="outlined"
                    size="small"
                    value={endTime}
                    onChange={(t) => setEndTime(t)}
                  />
                </MuiPickersUtilsProvider>
              </Box>
              <Box sx={{ my: 1 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  className="mr-4 text-white"
                  size="small"
                  onClick={filterHander}
                >
                  Filter
                </Button>
                <Button
                  variant="contained"
                  color="muted"
                  size="small"
                  onClick={() => {
                    setIsReset(!isReset);
                    setStartTime(new Date());
                    setEndTime(new Date());
                  }}
                >
                  Reset
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>

      {!isLoading ? (
        <Grid container spacing={3}>
          {dataList?.length > 0 &&
            dataList?.map((data, idx) => (
              <Grid key={idx} item md={3} sm={6} xs={12}>
                <Card elevation={3} className="p-5 flex">
                  <div>
                    <IconButton size="small" className="p-2 bg-light-gray">
                      {data?.status === "ALL" && <Icon className="text-muted">shopping_cart</Icon>}
                      {data?.status === "PENDING" && (
                        <MdOutlinePendingActions className="text-muted" />
                      )}
                      {data?.status === "HOLD" && <FaHandHoldingUsd className="text-muted" />}
                      {data?.status === "CONFIRM" && <GiConfirmed className="text-muted" />}
                      {data?.status === "PROCESSING" && <VscServerProcess className="text-muted" />}
                      {data?.status === "PICKED" && <FaTruckPickup className="text-muted" />}
                      {data?.status === "SHIPPED" && <FaShippingFast className="text-muted" />}
                      {data?.status === "DELIVERED" && (
                        <MdOutlineDownloadDone className="text-muted" />
                      )}
                      {data?.status === "CANCELED" && <TiCancel className="text-muted" />}
                      {data?.status === "RETURNED" && <GiReturnArrow className="text-muted" />}
                      {data?.status === "REFUND" && <RiRefund2Line className="text-muted" />}
                    </IconButton>
                  </div>
                  <div className="ml-4">
                    <h5 className="mt-1 font-medium">
                      {data?.status === "ALL" ? "CREATE ORDER" : data?.status}{" "}
                    </h5>
                    <h5 className="m-0 mb-2 text-green font-medium">{data?.order}</h5>
                    <p className="text-muted m-0">{`${data?.price} Tk`}</p>
                  </div>
                </Card>
              </Grid>
            ))}
        </Grid>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "auto",
            width: "auto",
            marginY: "58px",
          }}
        >
          <Spinner />
        </Box>
      )}
    </div>
  );
};

export default StatCard3;
