import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { PublicOnlyRoute } from "@/components/routing/PublicOnlyRoute";
import { AppShell } from "@/components/layout/AppShell/AppShell";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { ROUTES } from "@/config/routes";

const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage/LoginPage"));
const RegisterPage = lazy(
  () => import("@/features/auth/pages/RegisterPage/RegisterPage")
);
const ForgotPasswordPage = lazy(
  () => import("@/features/auth/pages/ForgotPasswordPage/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(
  () => import("@/features/auth/pages/ResetPasswordPage/ResetPasswordPage")
);

const DashboardPage = lazy(() => import("@/pages/DashboardPage/DashboardPage"));
const EquipamentosPage = lazy(() => import("@/pages/EquipamentosPage/EquipamentosPage"));
const PadroesPage = lazy(() => import("@/pages/PadroesPage/PadroesPage"));
const CalibracaoPage = lazy(() => import("@/pages/CalibracaoPage/CalibracaoPage"));
const LaudosPage = lazy(() => import("@/pages/LaudosPage/LaudosPage"));
const AssinaturaDigitalPage = lazy(
  () => import("@/pages/AssinaturaDigitalPage/AssinaturaDigitalPage")
);
const UsuariosPage = lazy(() => import("@/pages/UsuariosPage/UsuariosPage"));
const ConfiguracoesPage = lazy(
  () => import("@/pages/ConfiguracoesPage/ConfiguracoesPage")
);
const PerfilPage = lazy(() => import("@/pages/PerfilPage/PerfilPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function PageFallback() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--jq-primary)",
      }}
    >
      <Spinner size={26} />
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Públicas */}
            <Route element={<PublicOnlyRoute />}>
              <Route path={ROUTES.login} element={<LoginPage />} />
              <Route path={ROUTES.register} element={<RegisterPage />} />
              <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
            </Route>
            {/* Reset deve ser acessível mesmo logado */}
            <Route path={ROUTES.resetPassword} element={<ResetPasswordPage />} />

            {/* Privadas */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path={ROUTES.dashboard} element={<DashboardPage />} />
                <Route path={ROUTES.equipamentos} element={<EquipamentosPage />} />
                <Route path={ROUTES.padroes} element={<PadroesPage />} />
                <Route path={ROUTES.calibracao} element={<CalibracaoPage />} />
                <Route path={ROUTES.laudos} element={<LaudosPage />} />
                <Route
                  path={ROUTES.assinaturaDigital}
                  element={<AssinaturaDigitalPage />}
                />
                <Route path={ROUTES.usuarios} element={<UsuariosPage />} />
                <Route path={ROUTES.configuracoes} element={<ConfiguracoesPage />} />
                <Route path={ROUTES.perfil} element={<PerfilPage />} />
              </Route>
            </Route>

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
