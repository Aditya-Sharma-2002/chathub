import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { setProfile, getProfile } from "./apiUser";

function Profile() {
  const [name, setName] = useState(JSON.parse(localStorage.getItem('token')).user.name);
  const [username, setUsername] = useState(JSON.parse(localStorage.getItem('token')).user.username || '');
  const [profile, setProfile] = useState(JSON.parse(localStorage.getItem('token')).user.profile || '');
  const [image, setImage] = useState(JSON.parse(localStorage.getItem('token')).user.profile || 'https://via.placeholder.com/250');

  // useEffect(() => {
    // async function fetchProfile(){
    //   const email = JSON.parse(localStorage.getItem('token')).user.email;
    //   try{
    //     const res = await getProfile(email);
    //     if(res && res.data && res.data.profile)
    //       setProfile(res.data.profile);
    //   }catch(err){
    //     console.log(err);
    //   }
    // }
    // fetchProfile();
    // setImage(JSON.parse(localStorage.getItem('token')?.user.profile))
  // },[]);

  async function handleImage(e){
    const img = e.target.files[0];
    if(!img) return;
    setProfile(URL.createObjectURL(img));
    const formData = new FormData();    
    formData.append('profile', img);
    formData.append('email', JSON.parse(localStorage.getItem('token')).user.email);
    setProfile(formData).then((response) => {
      console.log(response.data.message);
    })
  }

  return (
    <div className="modal">
      <div className="profile-container">
        <div className="profile-picture">
          <img
            src={image || profile}
            alt="Profile"
            className="profile-img"
          />          
          <input
            type="file"
            accept="image/*"
            id="upload"
            style={{ display: "none" }}
            onChange={handleImage}
          />
          <button onClick={() => document.getElementById('upload').click()} className="edit-icon">
            <i className="fa-solid fa-pencil"></i>{" "}
            {/* Font Awesome Pencil Icon */}
          </button>
        </div>
      </div>
      <form>
        <input
          type="text"
          placeholder="Enter name"
          onChange={(e) => setName(e.target.value)}
          value={JSON.parse(localStorage.getItem('token')).user.name || ''}
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <br />
        <br />
        <button>
          <Link to="/home">Submit</Link>
        </button>
      </form>
    </div>
  );
}

export default Profile;
