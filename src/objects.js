import { storageGetLastProjectId, storageGetLastTaskId, storageGetProjects, storageUpdateLastProjectId, storageUpdateLastTaskId, storageUploadProjects } from "./storage";

export function getProjects(){
    return projects;
}
class Task{
    constructor(title, description, dueDate, dueHour, priority){
        this.title = title;
        this.id = tid++;
        this.description = description;
        this.dueDate = dueDate;
        this.dueHour = dueHour
        this.priority = priority;
        this.completed = false;
    }
}
class Project{
    constructor(name, color){
        this.name = name;
        this.color = color;
        this.id = pid++;
        this.tasks = [];
    }
}

export function getLastTaskId(){
    return tid;
}

export function getLastProjectId(){
    return pid;
}

export function newTask(title, description, dueDate, dueHour, priority){
    let aNewtask = new Task(title, description, dueDate, dueHour, priority)
    storageUpdateLastTaskId(tid);
    return aNewtask;
}


export function newProject(name, color){
    let aNewProject = new Project(name, color);
    projects = getProjects()
    projects.push(aNewProject);
    storageUploadProjects();
    storageUpdateLastProjectId(pid);
    return aNewProject;
}

export function addTaskToProject(id, task){
    let myproject = getProjects().find((element) => element.id == id)
    myproject.tasks.push(task);
    storageUploadProjects()
}

export function deleteProject(weGetTheId){
    let myproject = getProjects().find((element) => element.id == weGetTheId)
    let index = projects.indexOf(myproject)
    projects.splice(index, 1);
    storageUploadProjects()
}

export function getTaskData(projectId, taskId){
    let theProject = getProjects().find((element) => element.id == projectId)
    let theProjectsTasks = theProject.tasks;
    let currentTask = theProjectsTasks.find((element) => element.id == taskId)
    return currentTask;
}

export function deleteTask(weGetTheId, position){
    let theProject = getProjects().find((element) => element.id == weGetTheId)
    let theProjectsTasks = theProject.tasks;
    let theTaskIndex = theProjectsTasks.indexOf(theProjectsTasks.find((element) => element.id == position))
    theProjectsTasks.splice(theTaskIndex, 1);
    storageUploadProjects()
}

export function editTask(projectId, taskId, title, description, dueDate, dueHour, priority){
    let theProject = getProjects().find((element) => element.id == projectId)
    let theProjectsTasks = theProject.tasks;
    let currentTask = theProjectsTasks.find((element) => element.id == taskId)
    currentTask.title = title;
    currentTask.description = description;
    currentTask.dueDate = dueDate;
    currentTask.dueHour = dueHour;
    currentTask.priority = priority;
    storageUploadProjects()
}

export function toggleFinished(projectId, taskId){
    let theProject = getProjects().find((element) => element.id == projectId)
    let theProjectsTasks = theProject.tasks;
    let currentTask = theProjectsTasks.find((element) => element.id == taskId)
    if(currentTask.completed){
        currentTask.completed = false;
    }else{
        currentTask.completed = true;
    }
    storageUploadProjects()
}
let projects;
let tid;
let pid;

if(storageGetProjects() == null){
    projects = [];
    tid = pid = 0;
    storageUploadProjects();
    let inbox = newProject("Inbox", "white")
    storageUpdateLastTaskId(tid);
    storageUpdateLastProjectId(pid);
}else{
    projects = storageGetProjects();
    tid = storageGetLastTaskId() || 0;
pid = storageGetLastProjectId() || 0;
}