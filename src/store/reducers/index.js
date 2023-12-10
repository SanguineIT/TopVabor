// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import User from './User';
import UserEmail from './UserEmail';
// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu , User , UserEmail });

export default reducers;
