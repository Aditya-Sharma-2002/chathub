import { Link } from "react-router-dom";
import "../index.css";
import { getProfile, searchUsers } from "./apiUser";
import { useState, useEffect } from "react";
 
function Sidebar() {
  const [image, setImage] = useState(JSON.parse(localStorage.getItem('token')).user.profile || ''); //'https://via.placeholder.com/250'

  // useEffect(() => {
  //   async function fetchProfile(){
  //     const email = JSON.parse(localStorage.getItem('token')).user.email;
  //     try{
  //       const res = await getProfile(email);
  //       if(res && res.data && res.data.profile)
  //         setProfile(res.data.profile);        
  //     }catch(err){
  //       console.log(err);
  //     }
  //   }
  //   fetchProfile();
  // },[]);

  function handleSearch(e){
    console.log(e.target.value.trim());
    searchUsers(e.target.value.trim());
  }

  return (
    <div className="sidebar">
      {/* Top Section with Image */}
      <div className="sidebar-header">
        <Link to="/home/profile" className="profile-btn">        
          <img
            src= {image}
            alt="Profile"
            className="profile-icon"
          />
        </Link>
        <input
          type="text"
          className="search-bar"
          placeholder="Looking for someone ?"
          onChange={handleSearch}
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
