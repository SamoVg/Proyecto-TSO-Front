import React from "react";
import { Navigate, Route, Routes } from "react-router";
import { MapSelector } from "../Maps/Pages/mapSelector";

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={"/maps"}></Navigate>} />
        <Route path="/maps" element={<MapSelector />} />
      </Routes>
    </>
  );
};
