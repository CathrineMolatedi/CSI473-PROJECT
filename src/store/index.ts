import { createStore } from 'redux';
import { Provider } from 'react-redux';

// Define initial state
const initialState = {
    user: null,
    notifications: [],
    patrols: [],
};

// Define action types
const SET_USER = 'SET_USER';
const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const ADD_PATROL = 'ADD_PATROL';

// Define action creators
export const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});

export const addNotification = (notification) => ({
    type: ADD_NOTIFICATION,
    payload: notification,
});

export const addPatrol = (patrol) => ({
    type: ADD_PATROL,
    payload: patrol,
});

// Define reducer
const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        case ADD_NOTIFICATION:
            return { ...state, notifications: [...state.notifications, action.payload] };
        case ADD_PATROL:
            return { ...state, patrols: [...state.patrols, action.payload] };
        default:
            return state;
    }
};

// Create store
const store = createStore(rootReducer);

// Export the store and provider
export { store, Provider };