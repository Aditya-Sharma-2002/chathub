import { useState } from 'react';
import { Link } from 'react-router-dom';

function Profile(){
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');

    return(
        <div className=''>
            <input type='image' />
            <form>
                <i className="fa-solid fa-cross"></i>
                <input type='text' placeholder = "Enter name" onChange={(e) => setName(e.target.value)}/>
                <input type='number' placeholder = "Enter phone number" onChange={(e) => setNumber(e.target.value)}/><br />
                <button><Link to='/home'>Submit</Link></button>
            </form>
        </div>
    );

}

export default Profile;
