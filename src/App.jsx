import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import authService from './appWrite/auth';
import { login, logout } from './store/authSlice';
import { Footer, Header } from './components';
import { Outlet } from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("App.jsx: useEffect triggered for initial auth check.");
    setLoading(true);

    authService.getCurrentUser()
      .then((userDataFromAppwrite) => {
        console.log("App.jsx: authService.getCurrentUser() finished. Result:", userDataFromAppwrite); // This log you already see as Object
        if (userDataFromAppwrite) {
          console.log("App.jsx: User data found. Data before dispatching login:", userDataFromAppwrite); // <--- ADD THIS NEW LOG
          dispatch(login({ userData: userDataFromAppwrite }));
        } else {
          console.log("App.jsx: No user data found, dispatching logout.");
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.error("App.jsx: Error during initial auth check:", error);
        dispatch(logout());
      })
      .finally(() => {
        console.log("App.jsx: Initial auth check complete, setting loading to false.");
        setLoading(false);
      });
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans antialiased">
      {loading ? (
        // Loading state with a simple, professional spinner
        <div className="flex items-center justify-center min-h-screen text-gray-700">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
          <p className="ml-4 text-lg">Summoning your story from the archives...</p>
        </div>
      ) : (
        <>
          <Header />
          <main className="flex-grow"> {/* `flex-grow` ensures main content takes available space */}
            <Outlet /> {/* Renders nested routes */}
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;