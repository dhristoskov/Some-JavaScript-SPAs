import { errorMessage, infoMessage } from './notifications.js';

export function authenticationInfo (userInfo) {
    sessionStorage.setItem('authtoken', userInfo._kmd.authtoken);
    sessionStorage.setItem('name', userInfo.name);
    sessionStorage.setItem('username', userInfo.username);
    sessionStorage.setItem('id', userInfo._id);
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
    }else if(!/^[A-Za-z\d]{5,}$/.test(userData.username)){
        errorMessage('USERNAME SHOULD BE AT LAST 5 CHARACHTERS LONG!')
        return false;
    }else if(!/^[A-Za-z\d]{4,}$/.test(userData.password)) {
        errorMessage('PASSWORD SHOULD BE AT LAST 4 CHARACHTARS LONG!');
        return false;
    }else{
        return true;
    }
}

