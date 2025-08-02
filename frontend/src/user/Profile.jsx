import { useState } from "react";
import { Link } from "react-router-dom";
import { setProfile as uploadProfile, getProfile, setNames } from "./apiUser";
import './Profile.css';

function Profile() {
  const tokenUser = JSON.parse(localStorage.getItem('token')).user;

  const [name, setName] = useState(tokenUser.name);
  const [username, setUsername] = useState(tokenUser.username || '');
  const [profile, setProfile] = useState(tokenUser.profile || '');
  const [image, setImage] = useState(tokenUser.profile || 'https://via.placeholder.com/250');

  async function handleForm(e) {
    e.preventDefault(); // ✅ prevent page refresh
    try {
      const res = await setNames(name, username);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleImage(e) {
    const img = e.target.files[0];
    if (!img) return;

    // Preview locally
    setImage(URL.createObjectURL(img));

    const formData = new FormData();    
    formData.append('profile', img);
    formData.append('email', tokenUser.email);

    try {
      const response = await uploadProfile(formData);
      console.log(response.data.message);

      // update state with new profile from backend
      setProfile(response.data.profile || image);
    } catch (err) {
      console.error("Error uploading profile:", err);
    }
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
          <button
            type="button"
            onClick={() => document.getElementById('upload').click()}
            className="edit-icon"
          >
            <i className="fa-solid fa-camera"></i>
          </button>
        </div>
      </div>
      <form onSubmit={handleForm}>
        <label>Name</label>
        <input
          type="text"
          placeholder="Enter name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <br /><br />
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <br /><br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Profile;
