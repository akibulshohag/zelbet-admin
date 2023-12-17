import React, { useState } from "react";
import { Card, Grid, Box, CardHeader, Tabs, Tab } from "@material-ui/core";
import { Breadcrumb } from "../../components";
import axios from "../../../axios";
import { useEffect } from "react";
import Spinner from "../../Shared/Spinner/Spinner";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`page-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {" "}
          <span dangerouslySetInnerHTML={{ __html: children }}></span>
        </Box>
      )}
    </div>
  );
}

const PageUpdate = () => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [aboutUs, setAboutUs] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [returned, setReturned] = useState("");
  const [refund, setRefund] = useState("");
  const [contactUs, setContactUs] = useState("");

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsPageLoading(true);
        let res = await axios.get("/settings/get-pages");
        if (res) {
          let data = res?.data?.data;
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

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb routeSegments={[{ name: "pages" }]} />
      </div>

      <Grid container>
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardHeader title="Pages View" />

            {!isPageLoading ? (
              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: "background.paper",
                  display: "flex",
                  height: "auto",
                }}
              >
                <Grid container>
                  <Grid item lg={2} xs={12}>
                    <Tabs
                      orientation="vertical"
                      variant="scrollable"
                      value={value}
                      onChange={handleChange}
                      sx={{ borderRight: 1, borderColor: "divider" }}
                    >
                      <Tab label="About Us" id={`page-0`} />
                      <Tab label="Terms and Conditions" id={`page-1`} />
                      <Tab label="Privacy Policy" id={`page-2`} />
                      <Tab label="Contact Us" id={`page-3`} />
                    </Tabs>
                  </Grid>
                  <Grid item lg={10} xs={12}>
                    <TabPanel value={value} index={0}>
                      {aboutUs}
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      {termsAndConditions}
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      {privacyPolicy}
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                      {contactUs}
                    </TabPanel>
                  </Grid>
                </Grid>
              </Box>
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
