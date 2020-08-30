import React, { useEffect, useReducer, useContext, createContext } from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import { initialState, userReducer } from './reducers/userReducer';
import Navbar from './components/Navbar';
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Signup from './components/screens/Signup';
import Explore from './components/screens/Explore';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import './App.css';

export const userContext = createContext();

const Routing = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(userContext);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            dispatch({ type: 'USER', payload: user });
        } else {
            history.push('/signin');
        }
    }, []);
    return (
        <Switch>
            <Route exact path='/'><Home /></Route>
            <Route path='/signin'><Signin /></Route>
            <Route path='/signup'><Signup /></Route>
            <Route path='/explore'><Explore /></Route>
            <Route exact path='/profile'><Profile /></Route>
            <Route path='/profile/:_id'><UserProfile /></Route>
            <Route path='/createPost'><CreatePost /></Route>
        </Switch>
    );
}

function App() {
    const [state, dispatch] = useReducer(userReducer, initialState);
    return (
        <userContext.Provider value={{ state, dispatch }}>
            <BrowserRouter>
                <Navbar />
                <Routing />
            </BrowserRouter>
        </userContext.Provider>
    );
}

export default App;