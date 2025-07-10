import React from "react";
import { Navigate, Route, Routes } from "react-router";
import { HomeScreen } from "../components/HomeScreen/HomeScreen";
import { MapSelector } from "../Maps/Pages/MapSelector";
import { MapRouting } from "../Maps/Pages/MapRouting";
import { DataScreen } from "../components/Data/data";
import { AddStudentScreen } from '../components/Data/AddStudentScreen';
import { EditStudentScreen } from '../components/Data/EditStudentScreen';
import { RouteSelector } from "../Maps/Pages/RouteSelector";

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/homescreen" element={<HomeScreen />} />
        <Route path="/" element={<Navigate to="/homescreen" replace />} />
        <Route path="/maps" element={<MapSelector />} />
        <Route path="/directions" element={<MapRouting />} />
        <Route path="/data" element={<DataScreen />} />
        <Route path="/agregar-estudiante" element={<AddStudentScreen />} />
        <Route path="/editar-estudiante/:id" element={<EditStudentScreen />} />
        <Route path="/coords" element={<RouteSelector />} />
      </Routes>
    </>
  );
};
