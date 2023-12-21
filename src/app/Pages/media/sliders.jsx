import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Grid,
  Icon,
  TextField,
  Box,
  CircularProgress,
  CardHeader,
  Typography,
  InputLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  FormControlLabel
} from "@material-ui/core";
import { Image, notification } from "antd";
import { Breadcrumb } from "../../components";
import axios from "../../../axios";
import { Upload } from "antd";
import imageBasePath from "../../../config";
import Spinner from "../../Shared/Spinner/Spinner";
import { RiDeleteBin3Line } from "react-icons/ri";
import SimpleModal from "../../Shared/SimpleModal/SimpleModal";
import IOSSwitch from "../../Shared/Forms/iosSwitch";

// import { convertImageToBase64 } from "../../util/convertImageToBase64";
import { getBase64 } from "../../util/getBase64";

const SliderImages = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [url, setUrl] = useState("");
  const [fileError, setFileError] = useState("");
  const [dataList, setDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteData, setDeleteData] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [renderMe, setRenderMe] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsPageLoading(true);
        let res = await axios.get("/settings/casino-sliders");
        if (res?.data?.success) {
          let data = res?.data?.data;
          setDataList(data?.all);
        }
        setIsPageLoading(false);
        setErrorMsg("");
      } catch (err) {
        setIsPageLoading(false);
        setErrorMsg(err?.response?.data?.message);
      }
    };
    fetchData();
  }, [renderMe]);

  const openNotificationWithIcon = (message, type) => {
    notification[type]({
      message,
    });
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (fileError) return;

      let baseImg = "";
      if (selectedFile) {
        // baseImg = await convertImageToBase64(selectedFile);
        baseImg = await getBase64(selectedFile);
      }

      if (baseImg === "") {
        openNotificationWithIcon("Add a image", "error");
        return;
      }

      let obj = {
        slider:[
         {
          image: baseImg,
         }
        ],
      };

      setIsLoading(true);
      const res = await axios.post(`/settings/add/casino-slider`, obj);
      if (res?.data?.success) {
        setUrl("");
        setFileList([]);
        setSelectedFile(null);
        setRenderMe(!renderMe);
        setFileError("");
        openNotificationWithIcon(res?.data?.message, "success");
      } else {
        openNotificationWithIcon(res?.data?.message, "error");
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      openNotificationWithIcon(err?.response?.data?.message, "error");
    }
  };

  const imageHandler = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (
      newFileList[0]?.originFileObj.type === "image/jpeg" ||
      newFileList[0]?.originFileObj.type === "image/jpg" ||
      newFileList[0]?.originFileObj.type === "image/png"
    ) {
      setSelectedFile(newFileList[0]?.originFileObj);
      setFileError("");
    } else {
      setFileError("Image must be (jpeg, jpg or png) format!");
    }
  };

  const closeModalHandler = () => {
    setDeleteData(false);
    setIsOpenModal(false);
  };

  const deleteHandler = async () => {
    try {
      let res = await axios.post(`/settings/slider/delete`,{sliderId: deleteData?.sliderId});
      setDeleteData(null);
      setRenderMe(!renderMe)
      openNotificationWithIcon(res?.data?.message, "success");
    } catch (error) {
      openNotificationWithIcon(error?.response?.data?.message, "error");
    }
    setDeleteData(null);
    setIsOpenModal(false);
  };

  const featuredUpdateHandler = async (data) => {
    try {
      const createRes = await axios.post(`/settings/slider/update-status`, {
        sliderId: data?.sliderId,
        active: !data?.isActive,
      });
      let updatedData = dataList.map((list) => {
        if (list.sliderId === data.sliderId) {
          list.active = !list.active;
        }
        return list;
      });
      setDataList(updatedData);
      if (createRes?.data?.success) {
        openNotificationWithIcon(createRes?.data?.message, "success");
      }
      setIsLoading(false);
    } catch (error) {
      openNotificationWithIcon(error?.response?.data?.message, "error");
      setIsLoading(false);
    }
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb routeSegments={[{ name: "Casino Slider Image" }]} />
      </div>

      <Grid container>
        <Grid item md={6} xs={12} className="mb-4">
          <Card elevation={3}>
            <CardHeader title="Add New Casino Slider Image" />

            <form className="px-4 py-6" onSubmit={formSubmitHandler}>
              <Grid container spacing={3}>
                <Grid item sm={8} xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography className="mb-2">Image For Slider (700 x 400)</Typography>
                    <Upload listType="picture-card" fileList={fileList} onChange={imageHandler}>
                      {fileList.length >= 1 ? null : (
                        <span>
                          <Icon style={{ color: "gray" }}>photo_size_select_actual</Icon>
                        </span>
                      )}
                    </Upload>

                    <p style={{ color: "red" }}>
                      <small>{fileError}</small>
                    </p>
                  </Box>
                  {/* <Box sx={{ mb: 2 }}>
                    <InputLabel className="mb-2 text-black">Add a link for pop up image</InputLabel>
                    <TextField
                      label=""
                      placeholder="https://...."
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </Box> */}
                </Grid>
              </Grid>

              <Button
                className="mb-4 mt-2 px-12"
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginRight: "20px" }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Add"}
              </Button>
            </form>
          </Card>
        </Grid>

        <Grid item md={6} xs={12}></Grid>

        <Grid item md={10} xs={12}>
          <Card elevation={3}>
            <CardHeader title="All Casino Slider Images" />
            {!isPageLoading ? (
              <div className="w-full overflow-auto  px-6 py-8">
                {dataList.length > 0 && errorMsg === "" ? (
                  <Table className="whitespace-pre">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">
                          <strong>#</strong>
                        </TableCell>
                        <TableCell align="center">Image</TableCell>
                        <TableCell align="center">InActive/Active</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataList.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell className="capitalize" align="center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="capitalize" align="center">
                            <Image width={200} src={imageBasePath + "/" + data?.image} />
                          </TableCell>
                          <TableCell className="capitalize" align="center">
                          <FormControlLabel
                              control={
                                <IOSSwitch
                                  sx={{ m: 1 }}
                                  checked={data?.active}
                                  onClick={() => featuredUpdateHandler(data)}
                                />
                              }
                              label=""
                            />
                          </TableCell>

                          <TableCell align="center">
                            <IconButton
                              onClick={() => {
                                setIsOpenModal(true);
                                setDeleteData(data);
                              }}
                              style={{ backgroundColor: "#ebedec", color: "red" }}
                            >
                              <RiDeleteBin3Line style={{ fontSize: "16px" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
        {deleteData ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Box>
              <Typography variant="h5">Are you sure?</Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="secondary"
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

export default SliderImages;
