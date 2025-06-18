import "./home.css";
import Navbar from "../../components/navbar/Navbar.jsx";
import ListBlogs from "../../components/ListBlogs/ListBlogs.jsx";

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <ListBlogs />
    </div>
  );
};

export default Home;
