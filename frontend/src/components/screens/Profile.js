import React, { useEffect, useState, useContext } from 'react';
import { userContext } from '../../App';
import M from 'materialize-css';

const Profile = () => {
    const [posts, setPosts] = useState([]);
    const { state, dispatch } = useContext(userContext);
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');

    const fetchMyPost = () => {
        fetch('/mypost', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
        }).then(res => res.json()).then(data => {
            setPosts(data.posts);
        });
    }

    useEffect(() => {
        fetchMyPost();
    }, []);

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

    const updateImage = () => {
        fetch('/updateimage', {
            method: 'put',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
            body: JSON.stringify({ image: url })
        }).then(res => res.json()).then(data => {
            if (data.error) {
                M.toast({ html: data.error, classes: 'rounded red lighten-1' });
            } else {
                M.toast({ html: 'image updated', classes: 'rounded green lighten-1' });
                localStorage.setItem('user', JSON.stringify(data));
                dispatch({ type: 'UPDATEIMAGE', payload: { image: data.image } })
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        if (url) {
            updateImage();
        }
    }, [url]);

    useEffect(() => {
        if (image) {
            postImage();
        }
    }, [image]);

    return (
        <div style={{ maxWidth: "60%", margin: "0px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-around", margin: "18px 0px", borderBottom: "1px solid grey" }}>
                <div>
                    <img style={{ width: "160px", height: "160px", borderRadius: "80px" }} src={state ? state.image : ''} alt={state ? state.name : ''} />
                    <div className="file-field input-field">
                        <div className="btn blue darken-2">
                            <span>Upload Image</span>
                            <input type="file" onChange={(e) => { setImage(e.target.files[0]); }} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="btn file-path validate" type="text" />
                        </div>
                    </div>
                </div>
                <div>
                    <h4>{state ? state.name : ''}</h4>
                    <h6>{state ? state.email : ''}</h6>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "110%" }}>
                        {posts ? <h6>{posts.length} post</h6> : ''}
                        {state && state.followers ? <h6>{state.followers.length} followers</h6> : ''}
                        {state && state.following ? <h6>{state.following.length} following</h6> : ''}
                    </div>
                </div>
            </div >
            <div className="gallery">
                {posts.map(post => {
                    return (
                        <img key={post._id} className="item" src={post.image} alt={post.title} />
                    );
                })}
            </div>
        </div >
    );
}

export default Profile;