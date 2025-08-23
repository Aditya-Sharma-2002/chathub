import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { searchUsers, logout, getFriends } from "./apiUser";
import CreateGroupModal from "./CreateGroupModal";

const Sidebar = (props) => {
  const [image] = useState(
    JSON.parse(localStorage.getItem("token")).user.profile
  );
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [collapsed, setCollapsed] = useState(true);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const userId = JSON.parse(localStorage.getItem("token")).user._id;

  useEffect(() => {
    try {
      getFriends(userId).then((response) => {
        setFriends(response.data.friends);
      });
    } catch (err) {
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

  function handleCreateGroup(data) {
    console.log("Group Created:", data);
    // 👉 call backend API here later
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
                  <div className="user-info">
                    <span className="name">{user.name}</span>
                    <span className="username">{user.username}</span>
                    <span className="last-message">                      
                      {user.latestMessage?.content
                        ? user.latestMessage.content.length > 20
                          ? user.latestMessage.content.slice(0, 20) + "..."
                          : user.latestMessage.content
                        : "No messages yet"}
                    </span>
                  </div>
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
                  <div className="user-info">
                    <span className="username">{user.username}</span>
                    <span className="last-message">
                      {user.latestMessage?.content
                        ? user.latestMessage.content.length > 20
                          ? user.latestMessage.content.slice(0, 20) + "..."
                          : user.latestMessage.content
                        : "No messages yet"}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li>No friends connected 🥲</li>
            )}
          </ul>
        </div>

        {/* Sidebar Footer: Create Group + Logout */}
        <div className="sidebar-footer">
          <button
            className="create-group-btn"
            onClick={() => setIsGroupModalOpen(true)}
          >
            ➕ Create Group
          </button>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Group Modal */}
      <CreateGroupModal
        friends={friends}
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onCreate={handleCreateGroup}
      />
    </>
  );
};

export default Sidebar;
