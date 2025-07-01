import React from "react";
import { Navigate, Route, Routes } from "react-router";
import { MapSelector } from "../Maps/Pages/mapSelector";
import { MapRouting } from "../Maps/Pages/MapRouting";

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={"/maps"}></Navigate>} />
        <Route path="/maps" element={<MapSelector />} />
        <Route path="/directions" element={<MapRouting />} />
      </Routes>
    </>
  );
};
