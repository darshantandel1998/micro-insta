import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const CreatePost = () => {
    const history = useHistory();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');

    const postImage = () => {
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', 'insta-clone');
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
        fetch('/createpost', {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
            body: JSON.stringify({ title, body, image: url }),
        }).then(res => res.json()).then(data => {
            if (data.error) {
                M.toast({ html: data.error, classes: 'rounded red lighten-1' });
            } else {
                M.toast({ html: 'post uploaded', classes: 'rounded green lighten-1' });
                history.push('/');
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
        <div className="card input-field" style={{ margin: "30px auto", maxWidth: "500px", padding: "20px", textAlign: "center" }} >
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} />
            <div className="file-field input-field">
                <div className="btn blue darken-2">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light blue darken-2" onClick={() => postImage()}>Submit Post</button>
        </div>
    );
}

export default CreatePost;