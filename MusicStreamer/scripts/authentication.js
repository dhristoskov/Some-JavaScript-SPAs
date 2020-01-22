import { errorMessage, infoMessage } from './notifications.js';

export function authenticationInfo (userInfo) {
    sessionStorage.setItem('authtoken', userInfo._kmd.authtoken);
    sessionStorage.setItem('name', userInfo.name);
    sessionStorage.setItem('username', userInfo.username)
    //sessionStorage.setItem('userId', userInfo._id);
}

export function setHeaderInfo (ctx) {
    ctx.isloggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.name = sessionStorage.getItem('name');
}

export function dataAuthentication (userData, repeatPassword) {
    if(userData.password !== repeatPassword){
        errorMessage('PASSWORDS MUST MATCH!');
        return false;
    }else if(userData.password.length < 4 || userData.username.length < 4){
        errorMessage('GIVEN DATA IS TOO SHORT!')
        return false
    }else{
        return true;
    }
}