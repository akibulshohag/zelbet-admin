import React from "react";

const pagesRoutes = [
  // dashboard for zelbet
  {
    path: "/dashboard",
    component: React.lazy(() => import("./dashboard/dashboard")),
  }, 
  // general for zelbet
  {
    path: "/profile",
    component: React.lazy(() => import("./general/profile")),
  },
  {
    path: "/password",
    component: React.lazy(() => import("./general/password")),
  },
  //  employee for zelbet
  {
    path: "/create-employee",
    component: React.lazy(() => import("./employee/createEmployee")),
  },
  {
    path: "/employee-list",
    component: React.lazy(() => import("./employee/employeeList.jsx")),
  },
  {
    path: "/employee-role/:employeeId",
    component: React.lazy(() => import("./employee/rolePermission")),
  },

  // user for zelbet
  {
    path: "/pending-user-list",
    component: React.lazy(() => import("./user/pendingUserList.jsx")),
  },
  {
    path: "/verify-user-list",
    component: React.lazy(() => import("./user/verifyUserList.jsx")),
  },
  {
    path: "/suspended-user-list",
    component: React.lazy(() => import("./user/suspendedUserList.jsx")),
  },











  //  lefabre previous work
  {
    path: "/page-update",
    component: React.lazy(() => import("./singlePage/pageUpdate")),
  },
  {
    path: "/page-view",
    component: React.lazy(() => import("./singlePage/pagesView")),
  },
  {
    path: "/pop-up-img",
    component: React.lazy(() => import("./media/popupImg")),
  },
  {
    path: "/casino-slider-img",
    component: React.lazy(() => import("./media/sliders")),
  },
  {
    path: "/live-casino-slider-img",
    component: React.lazy(() => import("./media/liveCasinoSlider")),
  },
  {
    path: "/sports-slider-img",
    component: React.lazy(() => import("./media/sportsSlider")),
  },
  {
    path: "/banner-text",
    component: React.lazy(() => import("./media/bannerText")),
  },
  
  
];

export default pagesRoutes;
