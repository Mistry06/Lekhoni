import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import Signup from './pages/Signup.jsx';
import AllPosts from './pages/allPosts.jsx';
import AddPost from './pages/addPost.jsx';
import EditPost from './pages/editPost.jsx';
import Post from './pages/post.jsx';
import Protected from './components/authLayout.jsx'; // Import the new component
import About from './components/footer/about.jsx';
import Contact from './components/footer/contact.jsx';
import TermsOfService from './components/footer/terms .jsx';
import PrivacyPolicy from './components/footer/private.jsx';
import Account from './pages/account.jsx'; // Make sure this import is correct
import EditProfile from './pages/editProfile.jsx'; // Make sure this import is correct

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/login',
                element: (
                    <Protected authentication={false}> {/* Pass authentication=false */}
                        <LoginPage />
                    </Protected>
                ),
            },
            {
                path: '/signup',
                element: (
                    <Protected authentication={false}> {/* Pass authentication=false */}
                        <Signup />
                    </Protected>
                ),
            },
            {
                path: '/all-posts',
                element: (
                    <Protected authentication> {/* authentication=true by default */}
                        <AllPosts />
                    </Protected>
                ),
            },
            {
                path: '/add-post',
                element: (
                    <Protected authentication> {/* authentication=true by default */}
                        <AddPost />
                    </Protected>
                ),
            },
            {
                path: '/edit-post/:slug',
                element: (
                    <Protected authentication> {/* authentication=true by default */}
                        <EditPost />
                    </Protected>
                ),
            },
            {
                path: '/post/:slug',
                element: <Post />, // Decide if individual posts should be public or protected
                // For a blog, individual posts are often public, but editing requires login.
                // If you want posts themselves protected, wrap like others:
                // <AuthLayout authentication><Post /></AuthLayout>
            },
            {
                path:'/about', // Corrected path to lowercase for consistency
                element:<About/>
            },
            {
                path:'/contact', // Corrected path to lowercase for consistency
                element:<Contact/>
            },
            {
                path:'/terms',
                element:<TermsOfService/>
            },
            {
                path:'/privacy',
                element:<PrivacyPolicy/>
            },
            {
                // FIX: Corrected path from '//acccount' to '/account'
                path:'/account',
                element: (
                    <Protected authentication> {/* Account page typically requires authentication */}
                        <Account />
                    </Protected>
                )
            },
            {
                path: '/edit-profile', // New route for editing profile
                element: (
                    <Protected authentication>
                        <EditProfile />
                    </Protected>
                ),
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>,
);