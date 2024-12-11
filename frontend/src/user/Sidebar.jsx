import { Link } from "react-router-dom";
import "../index.css";
import { getProfile } from "./apiUser";
import { useState, useEffect } from "react";

function Sidebar() {
  const [profile, setProfile] = useState('https://via.placeholder.com/250');

  useEffect(() => {
    async function fetchProfile(){
      const email = JSON.parse(localStorage.getItem('token')).user.email;
      try{
        const res = await getProfile(email);
        if(res && res.data && res.data.profile)
          setProfile(res.data.profile);        
      }catch(err){
        console.log(err);
      }
    }
    fetchProfile();
  },[]);

  useEffect(() => {
    console.log(profile);
  }, [profile]);

  return (
    <div className="sidebar">
      {/* Top Section with Image */}
      <div className="sidebar-header">
        <Link to="/home/profile" className="profile-btn">        
          <img
            src= {profile}
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
