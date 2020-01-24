//Server data


const baseUrl = '';   // Have to be added 
const appKey = '';  // Have to be added
const appSecret = '';   // Have to be added

//Setting Header Type (Basic or Kinvey)
function authentication (type) {
    
    return type === 'Basic'
    ? 'Basic ' +  btoa(appKey + ':' + appSecret)
    : 'Kinvey ' + sessionStorage.getItem('authtoken');
};

//Create header for the request
function createHeader (authType, methodType, userData) {
    const header = {
        method: methodType,
        headers: {
            'Authorization': authentication(authType),
            'Content-Type':'application/json'
        }
    };
    if(methodType === 'POST' || methodType === 'PUT'){
        header.body = JSON.stringify(userData);
    };

    return header;
};

function handleError (e) {
    if(!e.ok){
        throw new Error (e.statusText)
    }
    return e
}

function deserializeData (e) {
    if(e.status === 204){
        return e;
    } 
    return e.json();
}

//Requester
function makeRequest (urlModule, endPoint, header) {
    const url = `${baseUrl}/${urlModule}/${appKey}/${endPoint}`;

    return fetch(url, header)
            .then(handleError)
            .then(deserializeData);
}

//POST request
export function post (authType, urlModule, endPoint, userData) {
    const header = createHeader(authType, 'POST', userData);

    return makeRequest(urlModule, endPoint, header);
}

//GET request
export function get (authType, urlModule, endPoint) {
    const header = createHeader(authType, 'GET');

    return makeRequest(urlModule, endPoint, header);
}

//PUT request
export function put (authType, urlModule, endPoint, userData) {
    const header = createHeader(authType, 'PUT', userData);

    return makeRequest(urlModule, endPoint, header);
}

//DELETE request
export function del (authType, urlModule, endPoint, userData) {
    
}
