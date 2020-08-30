import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';

const Signup = () => {
    const history = useHistory();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');

    const postImage = () => {
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', 'insta-clone-user');
        data.append('cloud_name', 'darshantandel');
        fetch('https://api.cloudinary.com/v1_1/darshantandel/image/upload', {
            method: 'post',
            body: data
        }).then(res => res.json()).then(data => {
            setUrl(data.url);
        }).catch((err) => {
            console.log(err);
        });
    }

    const postData = () => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            M.toast({ html: 'invalid email address', classes: 'rounded red lighten-1' });
            return;
        }
        fetch('/signup', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, image: url })
        }).then(res => res.json()).then(data => {
            if (data.error) {
                M.toast({ html: data.error, classes: 'rounded red lighten-1' });
            }
            if (data.message) {
                M.toast({ html: data.message, classes: 'rounded green lighten-1' });
                history.push('/signin');
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        if (url) {
            postData();
        }
    }, [url]);

    return (
        <div className="my-card">
            <div className="card auth-card input-field">
                <h2 className="brand-logo">Instagram</h2>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className="file-field input-field">
                    <div className="btn blue darken-2">
                        <span>Upload Image</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light blue darken-2" onClick={() => postImage()}>Sign up</button>
                <h6>Have an account? <Link to="/signin" className="blue-text darken-2">Sign in</Link></h6>
            </div>
        </div>
    );
}

export default Signup;