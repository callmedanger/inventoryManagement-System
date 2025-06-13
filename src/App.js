// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Sidebar from './components/Sidebar';
// import Product from './pages/Products';
// import Sales from './pages/Sales';
// import Report from './pages/Report';
// import Dashboard from './pages/Dashboard';
// import Topbar from './components/Topbar';
// import Login from './Authpages/login';
// import Signup from './Authpages/Signup';

// function App() {
//   return (
//     <Router>
//       <div style={{ display: 'flex' }}>
//         <Sidebar />
//         <div style={{ marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//           <Topbar />
//           <div style={{ flex: 1 }}>
//             <Routes>
//               <Route path="/" element={<Dashboard />} />
//               <Route path="/items" element={<Product />} />
//               <Route path="/sale" element={<Sales />} />
//               <Route path="/reports" element={<Report />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/signup" element={<Signup />} />

//             </Routes>
//           </div>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Product from './pages/Products';
import Sales from './pages/Sales';
import Report from './pages/Report';
import Dashboard from './pages/Dashboard';
import Topbar from './components/Topbar';
import Login from './Authpages/login';
import Signup from './Authpages/Signup';
import OrderTable from './pages/Order';

// Protect private pages
function PrivateRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Prevent access to auth pages if already logged in
function PublicRoute({ isAuthenticated, children }) {
  return isAuthenticated ? <Navigate to="/" /> : children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      {/* {isAuthenticated && <Sidebar />} */}
      {isAuthenticated && <Sidebar onLogout={() => setIsAuthenticated(false)} />}

      <div style={{ marginLeft: isAuthenticated ? '250px' : '0', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {isAuthenticated && <Topbar />}
        <div style={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute isAuthenticated={isAuthenticated}>
                  <Login onLoginSuccess={() => setIsAuthenticated(true)} />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute isAuthenticated={isAuthenticated}>
                  <Signup onSignupSuccess={() => setIsAuthenticated(true)} />
                </PublicRoute>
              }
            />

            {/* Private Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/items"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Product />
                </PrivateRoute>
              }
            />
            <Route
              path="/sale"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Sales />
                </PrivateRoute>
              }
            />
            <Route
              path="/order"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <OrderTable />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Report />
                </PrivateRoute>
              }
            />

            {/* Redirect all other routes */}
            <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
