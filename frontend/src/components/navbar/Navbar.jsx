import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="left">
        <h1>BlogSpot</h1>
        <input type="text" placeholder="Search" />
      </div>
      <div className="right">
        <p>write</p>
        <p>not</p>
        <p>profile</p>
      </div>
    </nav>
  );
};

export default Navbar;
