import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import { AppSidebarNav } from "./AppSidebarNav";

import { logoNegative } from "src/assets/brand/logo-negative";
import { sygnet } from "src/assets/brand/sygnet";

import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

// sidebar nav config
//import navigation from "../_nav";
//import navigation from "../myComponents/dashboard/SuperAdminNav";
import OfficeManager from "../myComponents/dashboard/OfficeManager";
import SuperAdmin from "../myComponents/dashboard/SuperAdminNav";
import BranchManager from "../myComponents/dashboard/BranchManagerNav";
import UnLogged from "../myComponents/dashboard/UnLoggedNav";

const AppSidebar = () => {
  const [navigation, setNavigation] = useState();
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);
  useEffect(() => {
    if (sessionStorage.getItem("role") === "Super Admin") {
      setNavigation(SuperAdmin);
    } else if (sessionStorage.getItem("role") === "Branch Manager") {
      setNavigation(BranchManager);
    } else if (sessionStorage.getItem("role") === "Office Manager") {
      setNavigation(OfficeManager);
    } else {
      setNavigation(UnLogged);
    }
  });

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: "set", sidebarShow: visible });
      }}
    >
      {/* <CSidebarBrand className="d-none d-md-flex" to="/">
        <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
      </CSidebarBrand> */}
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      {/* <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() =>
          dispatch({ type: "set", sidebarUnfoldable: !unfoldable })
        }
      /> */}
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
