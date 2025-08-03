import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setProfile as uploadProfile, setNames } from "./apiUser";
import './Profile.css';

function Profile() {
  const tokenUser = JSON.parse(localStorage.getItem('token')).user;

  const [name, setName] = useState(tokenUser.name);
  const [username, setUsername] = useState(tokenUser.username || '');
  const [profile, setProfile] = useState(tokenUser.profile);
  const navigate = useNavigate();

  async function handleForm(e) {
    e.preventDefault();
    try {
      await setNames(name, username);
      const token = JSON.parse(localStorage.getItem('token'));
      token.user.name = name;
      token.user.username = username;
      localStorage.setItem('token', JSON.stringify(token));
      navigate('/home');
    } catch (err) {
      console.log(err);
    }
  }

  async function handleImage(e) {
    const img = e.target.files[0];
    if (!img) return;

    // Show preview immediately
    const previewUrl = URL.createObjectURL(img);
    setProfile(previewUrl);

    const formData = new FormData();
    formData.append('profile', img);
    formData.append('email', tokenUser.email);

    try {
      const response = await uploadProfile(formData);
      if (response.data.profile) {
        // Update from backend (base64 or URL)
        setProfile(response.data.profile);

        // Update token in localStorage
        const token = JSON.parse(localStorage.getItem('token'));
        token.user.profile = response.data.profile;
        localStorage.setItem('token', JSON.stringify(token));
      }
    } catch (err) {
      console.error("Error uploading profile:", err);
    }
  }

  return (
    <div className="modal">
      <div className="profile-container">
        <div className="profile-picture">
          <img
            src={profile}
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
