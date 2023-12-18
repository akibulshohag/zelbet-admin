// import { authRoles } from "./auth/authRoles";

export const navigations = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "dashboard",
  },
  // {
  //   name: "Orders",
  //   icon: "shopping",
  //   children: [
  //     {
  //       name: "Pos Order",
  //       path: "/create-order",
  //       iconText: "OL",
  //     },
  //     {
  //       name: "Order list",
  //       path: "/order-list",
  //       iconText: "OL",
  //     },
  //     {
  //       name: "Return & Refund",
  //       path: "/order-return-refund",
  //       iconText: "OL",
  //     },
  //   ],
  // },

  // {
  //   label: "Product",
  //   type: "label",
  // },
  {
    name: "Pages",
    icon: "card_giftcard",
    children: [
      {
        name: "Page Update",
        path: "/page-update",
        iconText: "OL",
      },
      {
        name: "Pages View",
        path: "/page-view",
        iconText: "VO",
      },
    ],
  },
  {
    name: "Media",
    icon: "card_giftcard",
    children: [
      // {
      //   name: "Pop up",
      //   path: "/pop-up-img",
      //   iconText: "OL",
      // },
      {
        name: "Slider",
        path: "/slider-img",
        iconText: "VO",
      },
      {
        name: "Banner Text",
        path: "/banner-text",
        iconText: "VO",
      },
    ],
  },
  {
    name: "Employee",
    icon: "card_giftcard",
    children: [
      {
        name: "Create Employee",
        path: "/create-employee",
        iconText: "OL",
      },
      {
        name: "Employee List",
        path: "/employee-list",
        iconText: "VO",
      },
    ],
  },
  {
    name: "User",
    icon: "card_giftcard",
    children: [
      {
        name: "Pending Users",
        path: "/pending-user-list",
        iconText: "VO",
      },
      {
        name: "Verified Users",
        path: "/verify-user-list",
        iconText: "VO",
      },
      {
        name: "Suspended Users",
        path: "/suspended-user-list",
        iconText: "VO",
      },
    ],
  },
  {
    name: "General",
    icon: "card_giftcard",
    children: [
      {
        name: "Profile",
        path: "/profile",
        iconText: "OL",
      },
      {
        name: "Password",
        path: "/password",
        iconText: "VO",
      },
    ],
  },
];
