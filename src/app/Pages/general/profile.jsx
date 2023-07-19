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
} from "@material-ui/core";
import { notification } from "antd";
import { Breadcrumb } from "../../components";
import axios from "../../../axios";
import { Upload } from "antd";
import imageBasePath from "../../../config";
import Spinner from "../../Shared/Spinner/Spinner";
import { convertImageToBase64 } from "../../util/convertImageToBase64";

const Profile = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [fileList, setFileList] = useState([]);
  const [shopName, setShopName] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [roadNo, setRoadNo] = useState("");
  const [union, setUnion] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [fileError, setFileError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsPageLoading(true);
        let res = await axios.get("/setting/view");
        if (res) {
          let data = res?.data?.data;
          setShopName(data?.shopName);
          setSubTitle(data?.subTitle);
          setEmail(data?.email);
          setPhone(data?.phone);
          setFacebookLink(data?.socialLinks?.facebook);
          setWhatsappLink(data?.socialLinks?.whatsapp);
          setHouseNo(data?.address?.house);
          setRoadNo(data?.address?.road);
          setUnion(data?.address?.union);
          setDistrictName(data?.address?.district);
          setZipCode(data?.address?.zipCode);
          if (data?.logoImg) {
            setFileList([
              {
                url: imageBasePath + "/" + data?.logoImg,
              },
            ]);
          }
        }
        setIsPageLoading(false);
      } catch (err) {
        setIsPageLoading(false);
      }
    };
    fetchData();
  }, []);

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
        baseImg = await convertImageToBase64(selectedFile);
      } else if (fileList.length > 0) {
        baseImg = fileList[0].url.split(imageBasePath + "/")[1];
      }

      let obj = {
        shopName: shopName,
        subTitle: subTitle,
        email: email,
        phone: phone,
        address: {
          house: houseNo,
          road: roadNo,
          union: union,
          district: districtName,
          zipCode: zipCode,
        },
        socialLinks: {
          facebook: facebookLink,
          whatsapp: whatsappLink,
        },
        logoImg: baseImg,
      };

      setIsLoading(true);
      const res = await axios.patch(`/setting/update-basic`, obj);
      if (res?.data?.success) {
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

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb routeSegments={[{ name: "Profile" }]} />
      </div>

      <Grid container>
        <Grid item md={6} xs={12}>
          <Card elevation={3}>
            <CardHeader title="Update Site Profile" />

            {!isPageLoading ? (
              <form className="px-4 py-6" onSubmit={formSubmitHandler}>
                <Grid container spacing={3}>
                  <Grid item sm={8} xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Typography className="mb-2">Site Logo</Typography>
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
                      <InputLabel className="mb-2 text-black">Shop Name</InputLabel>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <InputLabel className="mb-2 text-black">Sub Title</InputLabel>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        multiline
                        minRows={3}
                        value={subTitle}
                        onChange={(e) => setSubTitle(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <InputLabel className="mb-2 text-black">Email</InputLabel>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ mb: 6 }}>
                      <InputLabel className="mb-2 text-black">Phone</InputLabel>
                      <TextField
                        name="name"
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <InputLabel className="mb-2 text-black">Facebook Link</InputLabel>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={facebookLink}
                        onChange={(e) => setFacebookLink(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ mb: 6 }}>
                      <InputLabel className="mb-2 text-black">Whatsapp Link</InputLabel>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={whatsappLink}
                        onChange={(e) => setWhatsappLink(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <InputLabel className="mb-2 text-black">House No.</InputLabel>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={houseNo}
                        onChange={(e) => setHouseNo(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <InputLabel className="mb-2 text-black">Road No.</InputLabel>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={roadNo}
                        onChange={(e) => setRoadNo(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <InputLabel className="mb-2 text-black">Union</InputLabel>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={union}
                        onChange={(e) => setUnion(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <InputLabel className="mb-2 text-black">District Name</InputLabel>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={districtName}
                        onChange={(e) => setDistrictName(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <InputLabel className="mb-2 text-black">Zip Code</InputLabel>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
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
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "Update"}
                </Button>
              </form>
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
    </div>
  );
};

export default Profile;
