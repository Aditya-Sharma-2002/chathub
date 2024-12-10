import { Link } from "react-router-dom";
import "../index.css";

function Sidebar() {
  return (
    <div className="sidebar">
      {/* Top Section with Image */}
      <div className="sidebar-header">
        <Link to="/home/profile" className="profile-btn">        
          <img
            src="https://via.placeholder.com/250"
            alt="Profile"
            className="profile-icon"
          />
        </Link>
        <input
          type="text"
          className="search-bar"
          placeholder="Looking for someone ?"
        />
      </div>

      {/* Sidebar Content */}
      <div className="sidebar-body">
        <ul>
          <li>User 1</li>
          <li>User 2</li>
          <li>User 3</li>
          <li>User 4</li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
