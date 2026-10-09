import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AppLayout } from "../../layouts/app-layout";
import { MemberListScene } from "../../scenes/member-list.scene";
import { MemberDetailScene } from "../../scenes/member-detail.scene";
import { routes } from "./routes";
export function AppRouter() {
  return <BrowserRouter><Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<Navigate to={routes.members} replace />} />
      <Route path={routes.members} element={<MemberListScene />} />
      <Route path={routes.memberPattern} element={<MemberDetailScene />} />
      <Route path="*" element={<h1>Página no encontrada</h1>} />
    </Route>
  </Routes></BrowserRouter>;
}

