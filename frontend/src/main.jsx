
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from './hooks/useUser';
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login.jsx';




import Register from './pages/Register.jsx';
import Home from './components/Home.jsx';
import EditPost from './components/SellerDetail.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';

import ViewBook from './admin/RequestBuyer.jsx';

import SellerDetail from './admin/SellerDetail.jsx';
import BuyerManagement from './admin/manageRequst.jsx'
import SellerManagement from './admin/sellerManagement.jsx';
import Buyer from './components/buyer.jsx';




const router = createBrowserRouter([
  {
    path: "/", element: <App/>,
    children:[
         { path: '/', 
          element: <Home /> },
        { path: '/login', 
          element: <Login/> },
            { path: '/Register', 
          element: <Register/> },

  
         { path: '/seller/:sellerId', 
          element: <EditPost /> },
         
           { path: '/admin-dashboard', 
          element: <AdminDashboard /> },
           { path: '/SellerManagement', 
          element: <SellerManagement /> },
           { path: '/RequestBuyer', 
          element: <ViewBook /> },
     
      {  path:"/seller/:sellerId" },
       { element:<SellerDetail />},
       {  path:"/manage",
        element:<BuyerManagement />},
        {path:"/buyer",
        element:<Buyer /> }
       

        

         
    ]
  
  }
])
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>

    <Toaster />
    <RouterProvider router={router} />
    </UserProvider>

  </React.StrictMode>
);
