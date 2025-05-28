import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import Signup from './pages/signUp.jsx';
import AllPosts from './pages/allPosts.jsx';
import AddPost from './pages/addPost.jsx';
import EditPost from './pages/editPost.jsx';
import Post from './pages/post.jsx';
import Protected from './components/authLayout.jsx'; // Import the new component

// --- Corrected Imports ---
// Ensure these paths exactly match your file names, including case and no extra spaces
import About from './components/footer/about.jsx';
import Contact from './components/footer/contact.jsx';
import TermsOfService from './components/footer/terms .jsx';
import PrivacyPolicy from './components/footer/private.jsx'
// --- End Corrected Imports ---

import Account from './pages/account.jsx';
import EditProfile from './pages/editProfile.jsx';

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
                    <Protected authentication={false}>
                        <LoginPage />
                    </Protected>
                ),
            },
            {
                path: '/signup',
                element: (
                    <Protected authentication={false}>
                        <Signup />
                    </Protected>
                ),
            },
            {
                path: '/all-posts',
                element: (
                    <Protected authentication>
                        <AllPosts />
                    </Protected>
                ),
            },
            {
                path: '/add-post',
                element: (
                    <Protected authentication>
                        <AddPost />
                    </Protected>
                ),
            },
            {
                path: '/edit-post/:slug',
                element: (
                    <Protected authentication>
                        <EditPost />
                    </Protected>
                ),
            },
            {
                path: '/post/:slug',
                element: <Post />,
            },
            {
                path:'/about',
                element:<About/>
            },
            {
                path:'/contact',
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
                path:'/account', // CORRECTED PATH FROM '//acccount'
                element: (
                    <Protected authentication>
                        <Account />
                    </Protected>
                )
            },
            {
                path: '/edit-profile',
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