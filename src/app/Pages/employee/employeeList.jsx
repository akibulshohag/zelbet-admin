import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  FormControlLabel,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from "@material-ui/core";
import { notification } from "antd";
import React, { useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { useHistory } from "react-router-dom";
import axios from "../../../axios";
import imageBasePath from "../../../config";
import IOSSwitch from "../../Shared/Forms/iosSwitch";
import SimpleModal from "../../Shared/SimpleModal/SimpleModal";
import Spinner from "../../Shared/Spinner/Spinner";
import { Breadcrumb } from "../../components/index";
// import { FaRegEdit } from "react-icons/fa";
import { FaExclamationTriangle } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { RiDeleteBin3Line } from "react-icons/ri";

const EmployeeList = () => {
  const history = useHistory();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalData, setTotalData] = useState(0);

  const [dataList, setDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openImgData, setOpenImgData] = useState(null);

  const openNotificationWithIcon = (message, type) => {
    notification[type]({
      message,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let res = await axios.get(`/admin/employee-list?pageNo=${page+1}&perPage=${rowsPerPage}`);
        setDataList(res?.data?.data);
        setTotalData(res?.data?.totalEmployee);
        setIsLoading(false);
        setErrorMsg("");
      } catch (err) {
        setIsLoading(false);
        setErrorMsg(err.response.data.message);
      }
    };
    fetchData();
  }, [page, rowsPerPage]);

  const closeModalHandler = () => {
    setDeleteId(false);
    setIsOpenModal(false);
    setOpenImgData(null);
  };

  const deleteHandler = async () => {
    let obj={
      empId:deleteId
    }
    try {
      let res = await axios.post(`/admin/employee-delete`,obj);
      setDataList(dataList.filter((i) => i.empId !== deleteId));
      openNotificationWithIcon(res?.data?.message, "success");
    } catch (error) {
      openNotificationWithIcon(error?.response?.data?.message, "error");
    }
    setDeleteId(false);
    setIsOpenModal(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const statusUpdateHandler = async (data) => {
    let obj ={
      empId:data?.empId,
	    isActivated:!data?.isActivated
    }
    try {
      const createRes = await axios.patch(
        `/admin/employee-status-update`,obj
      );
      let updatedData = dataList.map((list) => {
        if (list.empId === data?.empId) {
          list.isActivated = !list.isActivated;
        }
        return list;
      });
      setDataList(updatedData);
      if (createRes?.data?.success) {
        openNotificationWithIcon(createRes?.data?.message, "success")
      }
      setIsLoading(false);
    } catch (error) {
      openNotificationWithIcon(error?.response?.data?.message, "error");
      setIsLoading(false);
    }
  };

  const openImgHandler = (data) => {
    setIsOpenModal(true);
    setOpenImgData(data);
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb routeSegments={[{ name: "Employee List" }]} />
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "28px",
          marginTop: "28px",
        }}
      >
        <Button
          style={{
            backgroundColor: "#FF8E96",
            color: "white",
          }}
          variant="contained"
          size="large"
          startIcon={<IoMdAddCircle />}
          onClick={() => history.push("/create-employee")}
        >
          Add Employee
        </Button>
      </Box>
      <Grid container>
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardHeader title="Employee List" />

            {!isLoading ? (
              <>
              <div className="w-full overflow-auto  px-6 py-8">
                {dataList.length > 0 && errorMsg === "" ? (
                  <div
                    style={{
                      maxHeight: 800,
                      minWidth: 300,
                      overflow: "auto",
                    }}
                  >
                    <Table stickyHeader className="whitespace-pre">
                      <TableHead>
                        <TableRow>
                          <TableCell className="min-w-50">
                            <strong>#</strong>
                          </TableCell>
                          <TableCell className="min-w-100">Image</TableCell>
                          <TableCell className="min-w-100">Name</TableCell>
                          <TableCell className="min-w-100">Email</TableCell>
                          <TableCell className="min-w-100">Phone</TableCell>
                          <TableCell className="min-w-100">Status</TableCell>
                          <TableCell className="min-w-160">Role</TableCell>
                          <TableCell className="min-w-100">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dataList.map((data, index) => (
                          <TableRow key={index}>
                            <TableCell className="capitalize" align="left">
                              {index + 1}
                            </TableCell>
                            <TableCell className="capitalize" align="left">
                              <Avatar
                                className="border-radius-4"
                                style={{ cursor: "pointer", width: "58px" }}
                                src={imageBasePath + "/" + data?.image}
                                alt={data?.name}
                                onClick={() => openImgHandler(data)}
                              />
                            </TableCell>
                            <TableCell className="capitalize" align="left">
                              {data?.firstName} {data?.lastName}
                            </TableCell>
                            <TableCell className="capitalize" align="left">
                              {data?.email}
                            </TableCell>{" "}
                            <TableCell className="capitalize" align="left">
                              {data?.phone}
                            </TableCell>
                            <TableCell className="capitalize" align="left">
                              {data?.isActivated ? (
                                <small className="rounded bg-primary elevation-z3 text-white px-2 py-2px mr-4">
                                  active
                                </small>
                              ) : (
                                <small className="rounded bg-light-error elevation-z3 px-2 py-2px mr-4">
                                  inactive
                                </small>
                              )}
                              <FormControlLabel
                                control={
                                  <IOSSwitch
                                    sx={{ m: 1 }}
                                    checked={data?.isActivated}
                                    onClick={() => statusUpdateHandler(data)}
                                  />
                                }
                                label=""
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                className="text-white"
                                onClick={() =>
                                  history.push("/employee-role/" + data?.empId)
                                }
                              >
                                permission
                              </Button>
                            </TableCell>
                            <TableCell>
                              {/* <IconButton
                                onClick={() => {
                                  history.push(`/update-brand/${data._id}`);
                                }}
                                style={{
                                  backgroundColor: "#ebedec",
                                  color: "#1976d2",
                                  marginRight: "8px",
                                }}
                              >
                                <FaRegEdit style={{ fontSize: "16px" }} />
                              </IconButton> */}

                              <IconButton
                                onClick={() => {
                                  setIsOpenModal(true);
                                  setDeleteId(data?.empId);
                                }}
                                style={{
                                  backgroundColor: "#ebedec",
                                  color: "red",
                                }}
                              >
                                <RiDeleteBin3Line
                                  style={{ fontSize: "16px" }}
                                />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <Typography
                    variant="body2"
                    style={{
                      textAlign: "center",
                      color: "gray",
                      paddingY: "14px",
                      padding: "8px",
                    }}
                  >
                    No Data Found
                  </Typography>
                )}
              </div>
              <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={totalData} // total data
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
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
          </Card>
        </Grid>
      </Grid>
      <SimpleModal isShow={isOpenModal} closeModalHandler={closeModalHandler}>
        {openImgData ? (
          <Avatar
            className="border-radius-4"
            style={{ width: "100%", height: "100%" }}
            src={imageBasePath + "/" + openImgData?.image}
            alt={openImgData?.name}
          />
        ) : (
          ""
        )}

        {deleteId ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FaExclamationTriangle className="text-secondary text-32" />
              <Typography paragraph className="ml-2 text-16">
                Are you sure you want to delete these?
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                className="mr-4"
                onClick={deleteHandler}
              >
                Yes
              </Button>
              <Button variant="outlined" onClick={() => setIsOpenModal(false)}>
                No
              </Button>
            </Box>
          </Box>
        ) : (
          ""
        )}
      </SimpleModal>
    </div>
  );
};

export default EmployeeList;
