import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { searchUsers, logout, getFriends } from "./apiUser";

const Sidebar = (props) => {
  const [image, setImage] = useState(
    JSON.parse(localStorage.getItem("token")).user.profile
  );
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [collapsed, setCollapsed] = useState(true);

  const userId = JSON.parse(localStorage.getItem("token")).user._id;

  useEffect(() => {
    try{
      getFriends(userId)
      .then(response => {
        // console.log(response.data.friends)
        setFriends(response.data.friends)
    });
    }catch(err){
      console.log(err);
    }
  }, [userId]);

  async function handleSearch(e) {
    const query = e.target.value.trim();
    setSearchName(query);
    if (!query) return setSearchResults([]);
    try {
      const res = await searchUsers(query);
      setSearchResults(res.data.users);
    } catch (err) {
      console.log(err);
    }
  }

  function handleReceiver(user) {
    props.setReceiver(user);
    props.setReceiverId(user._id);
    setSearchResults([]);
    setSearchName('');
  }

  return (
    <>
      {isMobile && (
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "☰" : "×"}
        </button>
      )}

      <div className={`sidebar ${collapsed && isMobile ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <Link to="/home/profile" className="profile-btn">
            <img src={image} alt="Profile" className="sidebar-logo" />
          </Link>
          <input
            type="text"
            value={searchName}
            className="search-bar"
            placeholder="Looking for someone?"
            onChange={handleSearch}
          />
        </div>

        <div className="sidebar-body">
          <ul>
            {searchResults.length > 0 ? (
              searchResults.map((user, index) => (
                <li key={index} onClick={() => handleReceiver(user)}>
                  <img
                    src={user.profile}
                    alt="Profile"
                    className="profile-icon"
                  />
                  <span>{user.username}</span>
                </li>
              ))
            ) : friends.length > 0 ? (
              friends.map((user, index) => (
                <li key={index} onClick={() => handleReceiver(user)}>
                  <img
                    src={user.profile}
                    alt="Profile"
                    className="profile-icon"
                  />
                  <span>{user.username}</span>
                </li>
              ))
            ) : (
              <li>No friends connected 🥲</li>
            )}
          </ul>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
