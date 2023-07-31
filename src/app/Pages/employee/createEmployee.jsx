import React, { useState } from "react";
import {
  Button,
  Card,
  FormControlLabel,
  Grid,
  Icon,
  TextField,
  Box,
  CircularProgress,
  CardHeader,
  Typography,
} from "@material-ui/core";
import { notification } from "antd";
import { Breadcrumb } from "../../components";
import axios from "../../../axios";
import { Upload } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import IOSSwitch from "../../Shared/Forms/iosSwitch";
import { convertImageToBase64 } from "../../util/convertImageToBase64";
import { useHistory } from "react-router-dom";


const CreateEmployee = () => {
  const history = useHistory();
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [fileList, setFileList] = useState([]);
  const [fileError, setFileError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("First Name is required")
      .min(2, "too small name, minimum 3 character")
      .max(10, "too big name, maximum 60 character "),
    lastName: Yup.string()
      .required("last Name is required")
      .min(2, "too small name, minimum 3 character")
      .max(10, "too big name, maximum 60 character "),
    email: Yup.string().required("email is required"),
    phone: Yup.string().required("phone is required"),
  });

  const openNotificationWithIcon = (message, type) => {
    notification[type]({
      message,
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    // control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const formSubmitHandler = async (data) => {
    try {
      if (fileError) return;
      let baseImg = "";
      if (selectedFile) {
        baseImg = await convertImageToBase64(selectedFile);
      }

      let obj = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        image: baseImg,
        isActivated: isDisabled,
      };
  
      setIsLoading(true);
      const res = await axios.post(`/admin/create-new-employee`, obj);
      if (res?.data?.success) {
        reset();
        setIsDisabled(false);
        setFileList([]);
        setSelectedFile();
        setFileError("");
        openNotificationWithIcon(res?.data?.message, "success");
        history.push('/employee-list')
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

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb routeSegments={[{ name: "New Employee" }]} />
      </div>

      <Grid container>
        <Grid item  md={12} lg={6} xs={12}>
          <Card elevation={3}>
            <CardHeader title="Add New Employee" />

            <form className="px-4 py-6" onSubmit={handleSubmit(formSubmitHandler)}>
              <Grid container spacing={3}>
                <Grid item sm={8} xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="label" className="mb-2">
                      First Name<span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
                      name="firstName"
                      label=""
                      variant="outlined"
                      size="small"
                      fullWidth
                      {...register("firstName")}
                    />
                    <p style={{ color: "red" }}>
                      <small>{errors.firstName?.message}</small>
                    </p>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="label" className="mb-2">
                      Last Name<span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
                      name="lastName"
                      label=""
                      variant="outlined"
                      size="small"
                      fullWidth
                      {...register("lastName")}
                    />
                    <p style={{ color: "red" }}>
                      <small>{errors.lastName?.message}</small>
                    </p>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="label" className="mb-2">
                      Email<span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
                      name="email"
                      label=""
                      variant="outlined"
                      size="small"
                      fullWidth
                      {...register("email")}
                    />
                    <p style={{ color: "red" }}>
                      <small>{errors.email?.message}</small>
                    </p>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="label" className="mb-2">
                      Phone<span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
                      name="phone"
                      label=""
                      variant="outlined"
                      size="small"
                      fullWidth
                      {...register("phone")}
                    />
                    <p style={{ color: "red" }}>
                      <small>{errors.phone?.message}</small>
                    </p>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="label" className="mb-2">
                      Upload Image
                    </Typography>
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

                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={isDisabled}
                          onClick={() => setIsDisabled(!isDisabled)}
                        />
                      }
                      label={isDisabled ? "Active" : "Inactive"}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Button
                className="mb-4 mt-2 px-12"
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginRight: "20px" }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save"}
              </Button>
            </form>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateEmployee;
