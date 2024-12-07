import { useState } from "react";
import { Link } from "react-router-dom";
import { profile } from "./apiUser";

function Profile() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [image, setImage] = useState('https://via.placeholder.com/250');

  function handleImage(e){
    setImage(e.target.files[0]);
    const img = image;
    console.log(img);
    console.log(img ? 'Image exists' : 'Image do not exists');
    const formData = new FormData();
    formData.append('profile', img);
    formData.append('email', localStorage.getItem('email'));
    profile(formData).then((response) => {
      console.log(response.data.message);
    })
  }

  return (
    <div className="modal">
      <div className="profile-container">
        <div className="profile-picture">
          <img
            src={image}
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
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="Enter phone number"
          onChange={(e) => setNumber(e.target.value)}
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
