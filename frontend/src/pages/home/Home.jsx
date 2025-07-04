import React, { useState } from "react";
import "./home.css";
import Navbar from "../../components/navbar/Navbar.jsx";
import ListBlogs from "../../components/listBlogs/ListBlogs.jsx";
import SearchBlog from "../../components/search/SearchBlog.jsx";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="home">
      <Navbar onSearchChange={setSearchTerm} />
      {searchTerm ? <SearchBlog searchTerm={searchTerm} /> : <ListBlogs />}
    </div>
  );
};

export default Home;
