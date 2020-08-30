import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import { userContext } from '../../App';

const Signin = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(userContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const postData = () => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            M.toast({ html: 'invalid email address', classes: 'rounded red lighten-1' });
            return;
        }
        fetch('/signin', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        }).then(res => res.json()).then(data => {
            if (data.error) {
                M.toast({ html: data.error, classes: 'rounded red lighten-1' });
            } else {
                localStorage.setItem('jwt', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                dispatch({ type: 'USER', payload: data.user });
                M.toast({ html: 'signin sucessfully', classes: 'rounded green lighten-1' });
                history.push('/');
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <div className="my-card">
            <div className="card auth-card input-field">
                <h2 className="brand-logo">Instagram</h2>
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="btn waves-effect waves-light blue darken-2" onClick={() => postData()}>Sign in</button>
                <h6>Don't have an account? <Link to="/signup" className="blue-text darken-2">Sign up</Link></h6>
            </div>
        </div>
    );
}

export default Signin;