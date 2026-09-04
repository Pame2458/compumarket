// App.jsx - Componente principal de la aplicación compuMarket.
// Configura el enrutamiento global y las rutas hijas para el catálogo de hardware.

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import RutaProtegida from './components/auth/RutaProtegida.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Inicio from './pages/Inicio.jsx';
import Empresa from './pages/Empresa.jsx';

// Importaciones del catálogo corregidas (De Servicios a Productos)
import Productos from './pages/Productos.jsx';
import ProductosIndex from './pages/productos/ProductosIndex.jsx';
import HardwareComponentes from './pages/productos/HardwareComponentes.jsx';
import Perifericos from './pages/productos/Perifericos.jsx';
import LaptopsNotebooks from './pages/productos/LaptopsNotebooks.jsx';

import Contacto from './pages/Contacto.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';

// 🌟 IMPORTACIONES DE RECUPERACIÓN DE CONTRASEÑA
import RecuperarPassword from './pages/RecuperarPassword.jsx';
import RestablecerPassword from './pages/RestablecerPassword.jsx';

import Perfil from './pages/Perfil.jsx';
import AdminRoutes from './pages/admin/AdminRoutes.jsx';
import './App.css';

function App() {
  return (
     <AdminAuthProvider> 
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-700">
          {/* Cabecera unificada con logo compuMarket y menú desplegable */}
          <Header />
          
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
            <Routes>
              {/* Vistas Públicas Principales */}
              <Route path="/" element={<Inicio />} />
              <Route path="/empresa" element={<Empresa />} />
              
              {/* Sistema de Catálogo Comercial mediante sub-rutas (Rutas Hijas) */}
              <Route path="/productos" element={<Productos />}>
                <Route index element={<ProductosIndex />} />
                <Route path="hardware" element={<HardwareComponentes />} />
                <Route path="perifericos" element={<Perifericos />} />
                <Route path="laptops" element={<LaptopsNotebooks />} />
              </Route>
              
              {/* Autenticación y Canales de Consulta */}
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              
              {/* 🌟 RUTAS PÚBLICAS DE GESTIÓN DE CREDENCIALES */}
              <Route path="/recuperar" element={<RecuperarPassword />} />
              <Route path="/restablecer-password" element={<RestablecerPassword />} />
              
              {/* Ruta Protegida: Información de la tabla Cliente del DER */}
              <Route
                path="/perfil"
                element={
                  <RutaProtegida>
                    <Perfil />
                  </RutaProtegida>
                }
              />
              
              {/* Consola de Control de Stock e Inventario para el Admin */}
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </main>
          
          {/* Pie de página corporativo con datos de contacto oficiales */}
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
     </AdminAuthProvider>
  );
}

export default App;




