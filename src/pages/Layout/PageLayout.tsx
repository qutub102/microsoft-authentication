import React from "react";
import { NavLink, Outlet } from "react-router-dom";

type Props = {};

function PageLayout({}: Props) {
  return (
    <>
      <div>PageLayout</div>
      <NavLink to="/chat">Chat link</NavLink>
      <Outlet />
    </>
  );
}

export default PageLayout;
