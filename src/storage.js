import { getProjects } from "./objects";

export function storageUploadProjects(){
    let myProjects = getProjects();
    localStorage.setItem('projects', JSON.stringify(myProjects))
}

export function storageGetProjects(){
    return JSON.parse(localStorage.getItem('projects'));
}

export function storageUpdateLastTaskId(lastId){
    localStorage.setItem('LastTaskId', lastId)
}

export function storageGetLastTaskId(){
    return (localStorage.getItem('LastTaskId'))
}

export function storageUpdateLastProjectId(lastId){
    localStorage.setItem('LastProjectId', lastId)
}

export function storageGetLastProjectId(){
    return (localStorage.getItem('LastProjectId'))
}