  // import React from 'react';
  // import {createBrowserRouter, BrowserRouter as Router, RouterProvider, Routes, Route, Link } from 'react-router-dom';
  // import CalculateCapacity from './CalculateCapacity';
  // import CalculateFiber from './CalculateFiber';
  // import './App.css';

  // function Home() {
  //   return (
  //     <div className="container">
  //       <h1>Bienvenue</h1>
  //       <div className="options">
  //         <Link to="/calculate_capacity" className="option">
  //           Calcul de Capacité Réseau
  //         </Link>
  //         <Link to="/calculate_fiber" className="option">
  //           Dimensionnement de la Fibre Optique
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  // // function App() {
  // //   return (
  // //     <Router>
  // //       <Routes>
  // //         <Route path="/" element={<Home />} />
  // //         <Route path="/calculate_capacity" element={
  // //         // <CalculateCapacity />
  // //         <div>
  // //           hello world 
  // //         </div>
  // //         } />
  // //         <Route path="/calculate_fiber" element={
  // //         // <CalculateFiber />
  // //         <div>
  // //           hello world 
  // //         </div>
  // //         } />
  // //       </Routes>
  // //     </Router>
  // //   );
  // // }



  // export default App;

  import React from 'react';
  import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
  import CalculateCapacity from './CalculateCapacity';
  import CalculateFiber from './CalculateFiber';
  import LinkFeasibility from './LinkFaisability';
  import './App.css';
  
  function Home() {
    return (
      <div className="container">
        <h1>Bienvenue Sur la Plateforme de dimensionnement de la fibre Optique</h1>
        <div className="options">
          <Link to="/calculate_capacity" className="option">
          Calcul du budget de puissance optique
          </Link>
          <Link to="/calculate_fiber" className="option">
            Dimensionnement de la Fibre Optique
          </Link>
          <Link to="/link_faisability" className="option">
            Faisabilité d'une liaison FO
          </Link>
        </div>
      </div>
    );
  }
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/calculate_capacity",
      element: <CalculateCapacity />,
    },
    {
      path: "/calculate_fiber",
      element: <CalculateFiber />,
    },
    {
      path: "/link_faisability",
      element: <LinkFeasibility />,
    },
  ]);
  
  function App() {
    
    return <RouterProvider router={router} />;
  }
  
  export default App;
  



