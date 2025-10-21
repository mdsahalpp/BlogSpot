import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import Home from "./pages/home/Home";
import LandingPage from "./pages/test/LandingPage.jsx";
import WriteBlog from "./pages/write/WriteBlog.jsx";
import Blog from "./pages/blog/Blog.jsx";
import Profile from "./pages/profile/Profile.jsx";
import EditBlogs from "./pages/editBlogs/EditBlogs.jsx";
import Donate from "./pages/donate/Donate.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import Username from "./pages/username/Username.jsx";
import ForgotPass from "./pages/auth/ForgotPass.jsx";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create" element={<WriteBlog />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit/:id" element={<EditBlogs />} />
          <Route path="/donation" element={<Donate />} />
          <Route path="/username" element={<Username />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
