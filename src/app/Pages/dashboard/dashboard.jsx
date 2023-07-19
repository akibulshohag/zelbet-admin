import React from "react";
import StatCard3 from "./shared/StatCard3";
import StatCards2 from "./shared/StatCards2";
// import ComparisonChart2 from "./shared/ComparisonChart2";
// import GaugeProgressCard from "./shared/GuageProgressCard";
// import StatCards from "./shared/StatCards";

import { Divider } from "@material-ui/core";

const DashboardPage = () => {
  return (
    <div className="analytics m-sm-30">
      <StatCards2 />
      <Divider className="my-4" />
      <StatCard3 />
    </div>
  );
};

export default DashboardPage;
