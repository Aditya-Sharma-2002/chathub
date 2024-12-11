import { useState } from "react";
import { Link } from "react-router-dom";
import { setProfile } from "./apiUser";

function Profile() {
  const [name, setName] = useState(JSON.parse(localStorage.getItem('token')).user.name);
  const [number, setNumber] = useState('');
  const [image, setImage] = useState('https://via.placeholder.com/250');

  async function handleImage(e){
    const img = e.target.files[0];
    if(!img) return;
    setImage(URL.createObjectURL(img));    
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
          value={JSON.parse(localStorage.getItem('token'))?.user.name || ''}
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
