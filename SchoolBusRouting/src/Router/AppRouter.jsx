import React from "react";
import { Navigate, Route, Routes } from "react-router";
import { HomeScreen } from "../components/HomeScreen/HomeScreen";
import { MapSelector } from "../Maps/Pages/mapSelector";
import { MapRouting } from "../Maps/Pages/MapRouting";

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/homescreen" element={<HomeScreen />} />
        <Route path="/" element={<Navigate to="/homescreen" replace />} />
        <Route path="/maps" element={<MapSelector />} />
        <Route path="/directions" element={<MapRouting />} />
      </Routes>
    </>
  );
};
