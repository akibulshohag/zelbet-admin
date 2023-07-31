import {
    Avatar,
    Box,
    Button,
    Card,
    CardHeader,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
  } from "@material-ui/core";
  import { notification } from "antd";
  import React, { useEffect, useState } from "react";
  import "react-loading-skeleton/dist/skeleton.css";
  import { useHistory } from "react-router-dom";
  import axios from "../../../axios";
  import imageBasePath from "../../../config";
  import SimpleModal from "../../Shared/SimpleModal/SimpleModal";
  import Spinner from "../../Shared/Spinner/Spinner";
  import { Breadcrumb } from "../../components/index";
  // import { FaRegEdit } from "react-icons/fa";
  import { FaExclamationTriangle } from "react-icons/fa";
  import { RiDeleteBin3Line } from "react-icons/ri";
  
  const VerifyUserList = () => {
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
    const [statusSave, setstatusSave] = useState('')
    const [renderMe, setrenderMe] = useState(false)
  
    const openNotificationWithIcon = (message, type) => {
      notification[type]({
        message,
      });
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          let res = await axios.get(
            `/admin/users/verified?pageNo=${page + 1}&perPage=${rowsPerPage}`
          );
          setDataList(res?.data?.data);
          setTotalData(res?.data?.totalUser);
          setIsLoading(false);
          setErrorMsg("");
        } catch (err) {
          setIsLoading(false);
          setErrorMsg(err.response.data.message);
        }
      };
      fetchData();
    }, [page, rowsPerPage,renderMe]);
  
    const closeModalHandler = () => {
      setDeleteId(false);
      setIsOpenModal(false);
      setOpenImgData(null);
      setstatusSave("");
    };
  
    
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
    
  
    const openImgHandler = (data) => {
      setIsOpenModal(true);
      setOpenImgData(data);
    };
  
    const statusChange = async () => {
  
      let obj={
        userId:deleteId,
        status:statusSave
      }
     
        try {
          let res = await axios.patch(`/admin/update/user-status`,obj);
          
          if(res){
            openNotificationWithIcon(res?.data?.message, "success");
            closeModalHandler()
            setrenderMe(!renderMe)
          }
        } catch (error) {
          openNotificationWithIcon(error?.response?.data?.message, "error");
          closeModalHandler()
        } 
      
     
      setDeleteId(false);
      setIsOpenModal(false);
    };
  
    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Breadcrumb routeSegments={[{ name: "Verify User List" }]} />
        </div>
  
        <Grid container>
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardHeader title="Verify Users" />
  
              {!isLoading ? (
                <>
                  <div className="w-full overflow-auto  px-6 py-8">
                    {dataList.length > 0 && errorMsg === "" ? (
                        <>
                      <div
                        style={{
                          maxHeight: 800,
                          minWidth: 300,
                          overflow: "auto",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            paragraph
                            className=" min-w-188"
                            style={{ color: "green", fontWeight: "bold" }}
                          >{`Total User: ${totalData}`}</Typography>
                        </Box>
                        <Table stickyHeader className="whitespace-pre">
                          <TableHead>
                            <TableRow>
                              <TableCell className="min-w-50">
                                <strong>#</strong>
                              </TableCell>
                              <TableCell className="min-w-60">Image</TableCell>
                              <TableCell className="min-w-100">Username</TableCell>
                              <TableCell className="min-w-100">Email</TableCell>
                              <TableCell className="min-w-100">Phone</TableCell>
                              <TableCell className="min-w-100">Balance</TableCell>
                              <TableCell className="min-w-100">Deposit</TableCell>
                              <TableCell className="min-w-100">
                                Withdraw
                              </TableCell>
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
                                  {data?.userName}
                                </TableCell>
                                <TableCell className="capitalize" align="left">
                                  {data?.email}
                                </TableCell>{" "}
                                <TableCell className="capitalize" align="left">
                                  {data?.phone}
                                </TableCell>
                                <TableCell className="capitalize" align="left">
                                  {data?.balance}
                                </TableCell>
                                <TableCell className="capitalize" align="left">
                                  {data?.totalDeposit}
                                </TableCell>
                                <TableCell className="capitalize" align="left">
                                  {data?.totalWithdraw}
                                </TableCell>
                                <TableCell>
                                <>
                              <div
                                onClick={() => {
                                  setIsOpenModal(true);
                                  setDeleteId(data?.userId);
                                  setstatusSave("rejected");
                                }}
                                style={{
                                  backgroundColor: "red",
                                  color: "#fff",                               
                                  textAlign: "center",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: "65px",
                                  borderRadius: "5px",
                                  cursor: "suspended",
                                }}
                              >
                                <p style={{ fontSize: "14px" }}>Suspend</p>
                              </div>
                            </>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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
  
          {deleteId && statusSave? (
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
                  Are you sure you want to update status?
                </Typography>
              </Box>
  
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  className="mr-4"
                  onClick={statusChange}
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
  
  export default VerifyUserList;
  