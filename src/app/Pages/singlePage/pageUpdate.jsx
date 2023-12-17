import React, { useState } from "react";
import {
  Button,
  Card,
  Grid,
  TextField,
  Box,
  CircularProgress,
  CardHeader,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import { notification } from "antd";
import { Breadcrumb, RichTextEditor } from "../../components";
import axios from "../../../axios";
import { useEffect } from "react";
import Spinner from "../../Shared/Spinner/Spinner";

const PageUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState("aboutUs");
  const [description, setDescription] = useState("");
  const [aboutUs, setAboutUs] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [returned, setReturned] = useState("");
  const [refund, setRefund] = useState("");
  const [contactUs, setContactUs] = useState("");


  const openNotificationWithIcon = (message, type) => {
    notification[type]({
      message,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsPageLoading(true);
        let res = await axios.get("/settings/get-pages");
        if (res) {
          let data = res?.data?.data;
          setDescription(data?.aboutUs);
          setAboutUs(data?.aboutUs);
          setTermsAndConditions(data?.terms);
          setPrivacyPolicy(data?.privacyPolicy);
          setContactUs(data?.contactUs);
        }
        setIsPageLoading(false);
      } catch (err) {
        setIsPageLoading(false);
      }
    };
    fetchData();
  }, []);

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let obj = {
        pageName:currentPage,
        data:description
      };

      setIsLoading(true);
      const res = await axios.post(`/settings/update-page`, obj);
      if (res?.data?.success) {
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

  useEffect(() => {
    if (currentPage === "aboutUs") {
      setDescription(aboutUs);
    } else if (currentPage === "terms") {
      setDescription(termsAndConditions);
    } else if (currentPage === "privacyPolicy") {
      setDescription(privacyPolicy);
    } else if (currentPage === "contactUs") {
      setDescription(contactUs);
    } 
  }, [currentPage, aboutUs, privacyPolicy, termsAndConditions, contactUs]);

  const contentChangeHandler = (value) => {
    setDescription(value);
    if (currentPage === "aboutUs") {
      setAboutUs(value);
    } else if (currentPage === "terms") {
      setTermsAndConditions(value);
    } else if (currentPage === "privacyPolicy") {
      setPrivacyPolicy(value);
    } else if (currentPage === "contactUs") {
      setContactUs(value);
    } 
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb routeSegments={[{ name: "update-pages" }]} />
      </div>

      <Grid container>
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardHeader title="Update Pages" />

            {!isPageLoading ? (
              <form className="px-4 py-6" onSubmit={formSubmitHandler}>
                <Grid container spacing={3}>
                  <Grid item lg={4} xs={12}>
                    <InputLabel className="mb-2 text-black">Select Page</InputLabel>
                    <TextField
                      name=""
                      label=""
                      variant="outlined"
                      size="small"
                      fullWidth
                      select
                      value={currentPage}
                      onChange={(e) => setCurrentPage(e.target.value)}
                    >
                      <MenuItem value="aboutUs"> About Us </MenuItem>
                      <MenuItem value="terms"> Terms And Conditions </MenuItem>
                      <MenuItem value="privacyPolicy"> Privacy Policy </MenuItem>
                      <MenuItem value="contactUs">Contact Us </MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel className="mb-2 text-black">Update Page Details</InputLabel>
                    <RichTextEditor
                      className="mb-4 border-none"
                      content={description}
                      handleContentChange={(content) => contentChangeHandler(content)}
                      placeholder="write here..."
                    />
                  </Grid>
                </Grid>

                <Button
                  className="mt-8 px-12"
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

export default PageUpdate;
