import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { userContext } from '../App';

const Navbar = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(userContext);

    const logout = () => {
        localStorage.clear();
        dispatch({ type: 'CLEAR' });
        history.push('/signin');
    }

    const renderList = () => {
        if (state) {
            return [
                <li key="explore"><Link to='/explore'>Explore</Link></li>,
                <li key="profile"><Link to='/profile'>Profile</Link></li>,
                <li key="create-post"><Link to='/createPost'>Create Post</Link></li>,
                <li key="logout"><button className="btn waves-effect waves-light red lighten-2" onClick={() => logout()}>Log Out</button></li>
            ];
        }
        return [
            <li key="signin"><Link to='/signin'>Signin</Link></li>,
            <li key="signup"><Link to='/signup'>Signup</Link></li>
        ];
    }

    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? "/" : "/signin"} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;