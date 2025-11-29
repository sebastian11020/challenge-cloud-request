import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { UserProvider } from "./context/UserContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RequestList from "./pages/RequestList.tsx";
import NewRequest from "./pages/NewRequest.tsx";
import DetailRequest from "./pages/DetailRequest.tsx";
import RequestTypesPage from "./pages/RequestTypesPage";
import ApproverRequestsPage from "./pages/ApproverRequestsPage";
import { HistoryPage } from "./pages/HistoryPage";
import NotFound from "./pages/NotFound";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="solicitudes" element={<RequestList />} />
                        <Route path="solicitudes/nueva" element={<NewRequest />} />
                        <Route path="solicitudes/:id" element={<DetailRequest />} />
                        <Route
                            path="config/tipos-solicitud"
                            element={<RequestTypesPage />}
                        />
                        <Route path="/history" element={<HistoryPage />} />
                        <Route path="aprobaciones" element={<ApproverRequestsPage />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </UserProvider>
    </React.StrictMode>
);
