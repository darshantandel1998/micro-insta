import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import M from 'materialize-css';
import { userContext } from '../../App';

const UserProfile = () => {
    const { state, dispatch } = useContext(userContext);
    const [user, setUser] = useState('');
    const [posts, setPosts] = useState([]);
    const { _id } = useParams();

    const fetchUserPost = () => {
        fetch(`/profile/${_id}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
        }).then(res => res.json()).then(data => {
            setUser(data.user);
            setPosts(data.posts);
        });
    }

    const followUser = () => {
        fetch('/follow', {
            method: 'put',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
            body: JSON.stringify({ _id: user._id })
        }).then(res => res.json()).then(data => {
            if (data.error) {
                M.toast({ html: data.error, classes: 'rounded red lighten-1' });
            } else {
                M.toast({ html: 'sucessfully done', classes: 'rounded green lighten-1' });
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.state));
                dispatch({ type: 'UPDATE', payload: { followers: data.state.followers, following: data.state.following } })
            }
        });
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: 'put',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
            body: JSON.stringify({ _id: user._id })
        }).then(res => res.json()).then(data => {
            if (data.error) {
                M.toast({ html: data.error, classes: 'rounded red lighten-1' });
            } else {
                M.toast({ html: 'sucessfully done', classes: 'rounded green lighten-1' });
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.state));
                dispatch({ type: 'UPDATE', payload: { followers: data.state.followers, following: data.state.following } })
            }
        });
    }

    useEffect(() => {
        fetchUserPost();
    }, []);

    return (
        <div style={{ maxWidth: "60%", margin: "0px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-around", margin: "18px 0px", borderBottom: "1px solid grey" }}>
                <div>
                <img style={{ width: "160px", height: "160px", borderRadius: "80px" }} src={user ? user.image : ''} alt={user ? user.name : ''} />
                </div>
                <div>
                    <h4>{user ? user.name : ''}</h4>
                    <h6>{user ? user.email : ''}</h6>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "110%" }}>
                        {posts ? <h6>{posts.length} post</h6> : ''}
                        {user && user.followers ? <h6>{user.followers.length} followers</h6> : ''}
                        {user && user.following ? <h6>{user.following.length} following</h6> : ''}
                    </div>
                    <h6>
                        {state && state.following.includes(user._id)
                            ? <button className="btn waves-effect waves-light blue darken-2" onClick={() => unfollowUser()}>Unfollow</button>
                            : <button className="btn waves-effect waves-light blue darken-2" onClick={() => followUser()}>Follow</button>
                        }
                    </h6>
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

export default UserProfile;