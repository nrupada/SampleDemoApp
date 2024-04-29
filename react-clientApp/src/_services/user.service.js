import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const userService = {
    getAll,
    getById,
    deleteUser,
    createUser,
    getUserRole,
    editUser
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function deleteUser(id) {
    const requestOptions = { method: 'Delete', headers: authHeader() };
    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function createUser(createUser) {
    const requestOptions = {
        method: 'Post',
        headers: { 'Content-Type': 'application/json', "Authorization" : authHeader().Authorization},
        body: JSON.stringify(createUser)
    };
    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function editUser(editUser) {
    const requestOptions = {
        method: 'Put',
        headers: { 'Content-Type': 'application/json', "Authorization": authHeader().Authorization },
        body: JSON.stringify(editUser)
    };
    return fetch(`${config.apiUrl}/users/${editUser.id}`, requestOptions).then(handleResponse);
}

function getUserRole() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/dropdown/GetRoleSelectList`, requestOptions).then(handleResponse);
}
