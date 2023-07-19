import React from "react";

const pagesRoutes = [
  {
    path: "/dashboard",
    component: React.lazy(() => import("./dashboard/dashboard")),
  }, 
  // profile for zelbet
  {
    path: "/profile",
    component: React.lazy(() => import("./general/profile")),
  },
  {
    path: "/password",
    component: React.lazy(() => import("./general/password")),
  },
  //  employee 
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
    path: "/slider-img",
    component: React.lazy(() => import("./media/sliders")),
  },
  {
    path: "/banner-text",
    component: React.lazy(() => import("./media/bannerText")),
  },
  
  
];

export default pagesRoutes;
