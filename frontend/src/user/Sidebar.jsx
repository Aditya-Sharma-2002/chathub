import { Link } from "react-router-dom";
import "../index.css";
import { searchUsers } from "./apiUser";
import { useState } from "react";
 
function Sidebar() {
  const [image, setImage] = useState(JSON.parse(localStorage.getItem('token')).user.profile || 'https://via.placeholder.com/250');
  const [searchResults, setSearchResults] = useState([]);

  async function handleSearch(e){    
    const query = e.target.value.trim();
    if(!query){
      setSearchResults(['']);
      console.log(searchResults);
      return
    }
    try{
      const res = await searchUsers(e.target.value.trim());
      setSearchResults(res.data.users);
    }catch(err){
      console.log(err);
    }    
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
          {
            searchResults.length > 0 ?
            (
              searchResults.map((user, index) => (
                <li key={index}>{user.username}</li>
              ))
            ) : (<li>No friends connected 🥲</li>)
          }
        </ul>        
      </div>
    </div>
  );
}

export default Sidebar;