import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { userContext } from '../../App';
import M from 'materialize-css';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const { state, dispatch } = useContext(userContext);

    const fetchPost = () => {
        fetch('/post', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
        }).then(res => res.json()).then(data => {
            setPosts(data.posts);
        });
    }

    const likePost = (_id) => {
        fetch('/like', {
            method: 'put',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
            body: JSON.stringify({ _id })
        }).then(res => res.json()).then(data => {
            const newPosts = posts.map((post) => {
                if (post._id == data._id) {
                    return data;
                }
                return post;
            });
            setPosts(newPosts);
        });
    }

    const unlikePost = (_id) => {
        fetch('/unlike', {
            method: 'put',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
            body: JSON.stringify({ _id })
        }).then(res => res.json()).then(data => {
            const newPosts = posts.map((post) => {
                if (post._id == data._id) {
                    return data;
                }
                return post;
            });
            setPosts(newPosts);
        });
    }

    const postComment = (_id, text) => {
        fetch('/comment', {
            method: 'put',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
            body: JSON.stringify({ _id, text }),
        }).then(res => res.json()).then(data => {
            if (data.error) {
                M.toast({ html: data.error, classes: 'rounded red lighten-1' });
            } else {
                M.toast({ html: 'comment uploaded', classes: 'rounded green lighten-1' });
                const newPosts = posts.map((post) => {
                    if (post._id == data._id) {
                        return data;
                    }
                    return post;
                });
                setPosts(newPosts);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    const deletePost = (_id) => {
        fetch(`/deletepost/${_id}`, {
            method: 'delete',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
        }).then(res => res.json()).then(data => {
            if (data.error) {
                M.toast({ html: data.error, classes: 'rounded red lighten-1' });
            } else {
                M.toast({ html: 'post deleted', classes: 'rounded green lighten-1' });
                const newPosts = posts.filter((post) => {
                    return post._id !== data._id;
                });
                setPosts(newPosts);
            }
        });
    }

    const deleteComment = (postId, commentId) => {
        fetch(`/deletecomment/${postId}/${commentId}`, {
            method: 'delete',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
        }).then(res => res.json()).then(data => {
            if (data.error) {
                M.toast({ html: data.error, classes: 'rounded red lighten-1' });
            } else if (!data) {
                M.toast({ html: "comment not deleted", classes: 'rounded red lighten-1' });
            } else {
                M.toast({ html: 'comment deleted', classes: 'rounded green lighten-1' });
                const newPosts = posts.map((post) => {
                    if (post._id == data._id) {
                        return data;
                    }
                    return post;
                });
                setPosts(newPosts);
            }
        });
    }

    useEffect(() => {
        fetchPost();
    }, []);

    return (
        <div className="home">
            {posts.map((post) => {
                return (
                    <div key={post._id} className="card home-card">
                        <h5>
                            <img style={{ width: "50px", height: "50px", borderRadius: "25px" }} src={post.postedBy.image} alt={post.postedBy.name} />
                            <Link to={state._id == post.postedBy._id ? "/profile" : "/profile/" + post.postedBy._id}>{post.postedBy.name}</Link>
                            {state._id == post.postedBy._id && <i className="material-icons" style={{ float: "right" }} onClick={() => deletePost(post._id)}>delete</i>}
                        </h5>
                        <div className="card-image">
                            <img src={post.image} alt={post.title} />
                        </div>
                        <div className="card-content input-field">
                            {post.likes.includes(state._id)
                                ? <i className="material-icons" onClick={() => unlikePost(post._id)} style={{ color: "red" }}>favorite</i>
                                : <i className="material-icons" onClick={() => likePost(post._id)}>favorite_border</i>
                            }
                            <h6>{post.likes.length ? post.likes.length + ' Likes' : ''}</h6>
                            <h6>{post.title}</h6>
                            <p>{post.body}</p>
                            {post.comments.map((comment) => {
                                return (
                                    <div key={comment._id}>
                                        {comment.postedBy.name}: {comment.text}
                                        {(state._id == post.postedBy._id || state._id == comment.postedBy._id) && <i style={{ float: "right" }} onClick={() => deleteComment(post._id, comment._id)}>x</i>}
                                    </div>
                                );
                            })}
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                postComment(post._id, e.target.text.value);
                            }}>
                                <input type="text" name="text" placeholder="add a comment" />
                            </form>
                        </div>
                    </div>
                );
            })}
        </div >
    );
}

export default Home;