import { addTaskToProject, deleteProject, deleteTask, editTask, getProjects, getTaskData, newProject, newTask, toggleFinished } from "./objects";
import defaultPicture from './add-default.svg'
import projectPicture from './project.svg'
import inboxPicture from './inbox.svg'
import removePicture from './remove.svg'

function clearInputs(){
    document.getElementById("title-input").value = ''
    document.getElementById("description-input").value = ''
    document.getElementById("date-input").value = ''
    document.getElementById("due-hour-input").value = ''
    document.getElementById("priority-input").value = ''
}

function refreshCards(){
    const content = document.getElementById("content");
    while(content.firstChild){
        content.removeChild(content.firstChild);
    }
    displayCards();
}

function handleAdding(){
    let title = document.getElementById("title-input").value
    let description = document.getElementById("description-input").value
    let date = document.getElementById("date-input").value
    let hour = document.getElementById("due-hour-input").value
    let priority = document.getElementById("priority-input").value
    let project = document.getElementById("project-input").value
    let theNewTask = newTask(title, description, date, hour, priority);
    addTaskToProject(project, theNewTask);
    hideAddTaskDialog();
    if(project == 0){
        selectPage('inbox');
        refreshCards();
    }else{
        loadProjects(project);
        selectPage("button-" + project);
    }
    const confirmButton = document.getElementById("confirm-submission")
    confirmButton.removeEventListener("click", handleAdding);
}

function showAddTaskDialog(){
    const dialog = document.getElementById("dialog");
    clearInputs();
    dialog.addEventListener("keydown", e => {
        if(e.key == "Escape"){
            hideAddTaskDialog();
        }
    })
    const closeDialog = document.getElementById("close-dialog");
    closeDialog.addEventListener("click", hideAddTaskDialog);
    dialog.style.display="flex";
    dialog.showModal();
    const priority = document.getElementById("priority-one")
    priority.selected = true;
    let date = document.getElementById("date-input")
    let currentDate = new Date().toJSON().slice(0,10);
    date.value = currentDate
    let hour = document.getElementById("due-hour-input")
    let currentHour = new Date().toJSON().slice(11, 16);
    hour.value = currentHour;
    const confirmButton = document.getElementById("confirm-submission")
    confirmButton.addEventListener("click", handleAdding)
}

function hideAddTaskDialog(){
    const dialog = document.getElementById("dialog");
    dialog.style.display="none";
    dialog.close();
}

let lastHandleClick = null;

function handleEditing(projectId, taskId, title, description, dueDate, dueHour, priority){
    editTask(projectId, taskId, title, description, dueDate, dueHour, priority)
    const confirmEdit = document.getElementById("confirm-edit");
    confirmEdit.removeEventListener("click", lastHandleClick);
    hideEditTaskDialog();
    if(projectId == 0){
        loadInbox();
    }else{
        loadProjects(projectId);
    }
}

function showEditTaskDialog(projectId, taskId){
    const dialog = document.getElementById("task-edit-dialog");
    dialog.addEventListener("keydown", e => {
        if(e.key == "Escape"){
            hideEditTaskDialog();
        }
    })
    const closeDialog = document.getElementById("close-task-dialog");
    closeDialog.addEventListener("click", hideEditTaskDialog);
    let currentTask = getTaskData(projectId, taskId);
    const title = document.getElementById("title-input-edit")
    title.value = currentTask.title
    const description = document.getElementById("description-input-edit")
    description.value = currentTask.description
    const dueDate = document.getElementById("date-input-edit")
    dueDate.value = currentTask.dueDate
    const dueHour = document.getElementById("due-hour-input-edit")
    dueHour.value = currentTask.dueHour
    const priority = document.getElementById("priority-input-edit")
    priority.value = currentTask.priority

    const confirmEdit = document.getElementById("confirm-edit");

    if (lastHandleClick) {
        confirmEdit.removeEventListener("click", lastHandleClick);
    }

    lastHandleClick = () => {
        handleEditing(projectId, taskId, title.value, description.value, dueDate.value, dueHour.value, priority.value);
    };

    confirmEdit.addEventListener("click", lastHandleClick);

    dialog.style.display="flex";
    dialog.showModal();
}

function hideEditTaskDialog(){
    const dialog = document.getElementById("task-edit-dialog");
    dialog.style.display="none";
    dialog.close();
}



function addProject(){
    let name = document.getElementById("name-input").value
    let color = document.getElementById("proj-color").value
    const confirm = document.getElementById("project-submit")
    confirm.removeEventListener("click", addProject);
    newProject(name, color);
    hideAddProjectDialog();
    reloadProjects();
    addProjectsToDropdown();
    selectPage('my-projects-button');
    loadProjects(0);
}

function showAddProjectDialog(){
    const nameInput = document.getElementById("name-input")
    nameInput.value = '';
    const dialog = document.getElementById("project-dialog");
    dialog.addEventListener("keydown", e => {
        if(e.key == "Escape"){
            hideAddProjectDialog();
        }
    })
    const confirm = document.getElementById("project-submit")
    confirm.addEventListener("click", addProject)
    dialog.style.display="flex";
    dialog.showModal();
}

function hideAddProjectDialog(){
    const dialog = document.getElementById("project-dialog");
    dialog.style.display="none";
    dialog.close();
}

function selectPage(id){
    const sidebar = document.getElementById("sidebar");
    const button = document.getElementById(id);
    let sidebarButtons = Array.from(sidebar.children);
    sidebarButtons.forEach(element => {
        element.classList.remove("selected-page")
    });
    button.classList.add("selected-page");
}

function clearMain(){
    const content = document.getElementById("content")
    while(content.firstChild){
        content.removeChild(content.firstChild);
    }
}

function loadInbox(){
    clearMain();
    refreshCards();
}

function loadProjects(projectId){
    clearMain();
    const content = document.getElementById("content");
    let projects = getProjects()
    if(projectId == 0){
        const pageTitle = document.createElement("h1");
        pageTitle.textContent = "My Projects";
        content.appendChild(pageTitle);
        let count = 0;
        projects.forEach(element => {
            count++;
            const card = document.createElement("div");
            card.classList.add("container-card")
            const row = document.createElement("div");
            row.classList.add("row-centered")
            card.appendChild(row);
            const cardTitle = document.createElement("h4");
            cardTitle.classList.add("item2")
            cardTitle.textContent = element.name;
            card.style.borderLeftColor = element.color;
            row.appendChild(cardTitle);
            card.addEventListener("click", () =>{
                if(element.id == 0){
                    selectPage("inbox");
                    loadInbox();
                }else{
                    loadProjects(element.id);
                    selectPage("button-" + element.id);
                }
            })
            if(count!=1){
                const removeProject = document.createElement("img")
                removeProject.src = removePicture
                removeProject.classList.add("delete-button")
                removeProject.addEventListener("click", (e)=>{
                    deleteProject(element.id)
                    reloadProjects();
                    loadProjects(0);
                    addProjectsToDropdown();
                    e.stopPropagation();
                })
                row.appendChild(removeProject)
            }
            content.appendChild(card);
            if(count < projects.length){
                const separator = document.createElement("hr")
                separator.classList.add("separator")
                content.appendChild(separator);
            }
        });
    }else{
        let projects = getProjects()
        let myProject = projects.find((element) => element.id == projectId);
        let tasks = myProject.tasks;
        const pageTitle = document.createElement("h1");
        pageTitle.textContent = myProject.name + " (" + tasks.length + ")";
        content.appendChild(pageTitle);
        if(tasks.length == 0){
            const header = document.createElement("h5");
            header.textContent = "No tasks yet."
            content.appendChild(header);
        }else{
            let completedCount = 0;
            let incompleteCount = 0;
            tasks.forEach((element) =>{
                if(element.completed == true){
                    completedCount++;
                }else{
                    incompleteCount++;
                }
            })
            let count = 0;
            tasks.forEach(element => {
                if(!element.completed){
                    count++;
                const card = document.createElement("div");
                card.classList.add("container-card")
                const row = document.createElement("div");
                row.classList.add("row-centered")
                card.appendChild(row);
                const toggleButton = document.createElement("button")
                    toggleButton.textContent = "✓";
                    toggleButton.classList.add("toggle-button")
                    toggleButton.addEventListener("click", (e) =>{
                        toggleFinished(projectId, element.id);
                        loadProjects(projectId);
                        e.stopPropagation();
                    })
                row.appendChild(toggleButton);
                const column = document.createElement("div");
                column.classList.add("column")
                column.classList.add("item2")
                row.appendChild(column);
                const cardTitle = document.createElement("h4");
                cardTitle.textContent = element.title;
                column.appendChild(cardTitle);
                const cardDue = document.createElement("p")
                cardDue.textContent = element.dueHour + ', ' +element.dueDate;
                column.appendChild(cardDue);
                if(element.priority == 1){
                    card.style.borderLeftColor = "red";
                }else if(element.priority == 2){
                    card.style.borderLeftColor = "orange"
                }else{
                    card.style.borderLeftColor = "green"
                }

                const removeProject = document.createElement("img")
                removeProject.src = removePicture
                removeProject.classList.add("delete-button")
                removeProject.addEventListener("click", (e)=>{
                    deleteTask(projectId, element.id);
                    reloadProjects();
                    loadProjects(projectId);
                    e.stopPropagation();
                })
                row.appendChild(removeProject)
                content.appendChild(card);
                if(count < incompleteCount){
                    const separator = document.createElement("hr")
                    separator.classList.add("separator")
                    content.appendChild(separator);
                }
                card.addEventListener("mouseover", ()=>{
                    card.style.backgroundColor = myProject.color;
                })
                card.addEventListener("mouseout", ()=>{
                    card.style.backgroundColor = '';
                })
                card.addEventListener("click", () =>{
                    showEditTaskDialog(myProject.id, element.id);
                })
                }
            });
            if(completedCount != 0 && completedCount != tasks.length){
                const separator = document.createElement("hr")
                separator.classList.add("separator")
                content.appendChild(separator);
            }
            count = 0;
            tasks.forEach(element => {
                if(element.completed){
                    count++;
                    const card = document.createElement("div");
                    card.classList.add("container-card")
                    card.classList.add("completed")
                    const row = document.createElement("div");
                    row.classList.add("row-centered")
                    card.appendChild(row);
                    const toggleButton = document.createElement("button")
                    toggleButton.textContent = "✓";
                    toggleButton.classList.add("toggle-button")
                    toggleButton.addEventListener("click", (e) =>{
                        toggleFinished(projectId, element.id);
                        loadProjects(projectId);
                        e.stopPropagation();
                    })
                    row.appendChild(toggleButton);
                    const column = document.createElement("div");
                    column.classList.add("column")
                    column.classList.add("item2")
                    row.appendChild(column);
                    const cardTitle = document.createElement("h4");
                    cardTitle.textContent = element.title;
                    column.appendChild(cardTitle);
                    const cardDue = document.createElement("p")
                    cardDue.textContent = element.dueHour + ', ' +element.dueDate;
                    column.appendChild(cardDue);
                    if(element.priority == 1){
                        card.style.borderLeftColor = "red";
                    }else if(element.priority == 2){
                        card.style.borderLeftColor = "orange"
                    }else{
                        card.style.borderLeftColor = "green"
                    }

                    const removeProject = document.createElement("img")
                    removeProject.src = removePicture
                    removeProject.classList.add("delete-button")
                    removeProject.addEventListener("click", (e)=>{
                        deleteTask(projectId, element.id);
                        reloadProjects();
                        loadProjects(projectId);
                        e.stopPropagation();
                    })
                    row.appendChild(removeProject)
                    content.appendChild(card);
                    if(count < completedCount){
                        const separator = document.createElement("hr")
                        separator.classList.add("separator")
                        content.appendChild(separator);
                    }
                    card.addEventListener("mouseover", ()=>{
                        card.style.backgroundColor = myProject.color;
                    })
                    card.addEventListener("mouseout", ()=>{
                        card.style.backgroundColor = '';
                    })
                    card.addEventListener("click", () =>{
                        showEditTaskDialog(myProject.id, element.id);
                    })
                }
            });
        }
    }
}

function reloadProjects(){
    const sidebar = document.getElementById("sidebar")
    while(sidebar.lastChild.classList.contains("project")){
        sidebar.removeChild(sidebar.lastChild)
    }
    let projects = getProjects().slice(1);
    projects.forEach((element) => {
        const projectButton = document.createElement("button");
        const projectColor = document.createElement("img");
        projectColor.style.backgroundColor = element.color;
        projectColor.style.borderRadius = '10px'
        projectColor.src = projectPicture;
        projectColor.style.height = '25px'
        projectColor.style.width = '25px'
        projectButton.appendChild(projectColor);
        const projectName = document.createElement("p")
        projectName.textContent = element.name;
        projectName.style.marginLeft = '1em';
        projectButton.appendChild(projectName);
        projectButton.classList.add("sidebar-button")
        projectButton.classList.add("project");
        projectButton.id = "button-" + element.id;
        projectButton.addEventListener("click", (e) =>{
            selectPage(projectButton.id);
            loadProjects(element.id);
        })
        sidebar.appendChild(projectButton);
    });
}

function makeButtonsVisible(){
    const addButton = document.getElementById("add-project")
    addButton.classList.remove("hidden");
}
function makeButtonsHidden(){
    const addButton = document.getElementById("add-project")
    addButton.classList.add("hidden");
}

export function createPageFormat() {
    const sidebar = document.getElementById("sidebar");
    sidebar.addEventListener("pointerenter", ()=>{
        makeButtonsVisible();
    })
    sidebar.addEventListener("pointerleave", ()=>{
        makeButtonsHidden();
    })
    const addTaskButton = document.createElement("button");
    addTaskButton.id = "add-task"
    addTaskButton.classList.add("sidebar-button")
    addTaskButton.addEventListener("click", showAddTaskDialog)
    const iconAdding = document.createElement("img");
    iconAdding.src = defaultPicture;
    iconAdding.style.width = '25px';
    iconAdding.style.height = '25px';
    addTaskButton.appendChild(iconAdding);
    const addTaskText = document.createElement('p');
    addTaskText.textContent = "Add new task"
    addTaskText.style.marginLeft = '1em';
    addTaskButton.appendChild(addTaskText);
    sidebar.appendChild(addTaskButton);
    const inboxButton = document.createElement("button")
    inboxButton.id = "inbox"
    inboxButton.classList.add("sidebar-button");
    inboxButton.addEventListener("click", () =>{
        selectPage(inboxButton.id);
        loadInbox();
    })
    const inboxImage = document.createElement("img");
    inboxImage.src = inboxPicture;
    inboxImage.style.width = inboxImage.style.height = '25px';
    const inboxText = document.createElement('p');
    inboxText.textContent = "Inbox"
    inboxText.style.marginLeft = '1em';
    inboxButton.appendChild(inboxImage);
    inboxButton.appendChild(inboxText);
    sidebar.appendChild(inboxButton);




    const myProjects = document.createElement("button");
    myProjects.textContent = "My Projects"
    myProjects.classList.add("sidebar-button")
    myProjects.classList.add("category");
    myProjects.id = "my-projects-button"
    myProjects.addEventListener("click", (e) =>{
        selectPage(myProjects.id);
        loadProjects(0);
    })

    const addProject = document.createElement("button");
    addProject.textContent = '+'
    addProject.classList.add("sidebar-subbutton")
    addProject.classList.add("hidden")
    addProject.id = "add-project"
    addProject.addEventListener("click", (e) => {
        showAddProjectDialog();
        e.stopPropagation();
    })
    myProjects.appendChild(addProject)
    sidebar.appendChild(myProjects);

    const container = document.getElementById("container")
    const content = document.createElement("div")
    content.id = "content";
    container.appendChild(content)
    reloadProjects();
    addProjectsToDropdown();
    loadProjects(0);
    selectPage('my-projects-button');
}

export function displayCards() {
    let tasks = getProjects()[0].tasks;
    const content = document.getElementById("content");
    const theTitle = document.createElement("h1");
    theTitle.textContent = "Inbox" + " (" + tasks.length + ")";
    content.appendChild(theTitle);
    if(tasks.length == 0){
        const header = document.createElement("h5");
        header.textContent = "No tasks yet."
        content.appendChild(header);
    }else{
        let completedCount = 0;
        let incompleteCount = 0;
        tasks.forEach((element) =>{
            if(element.completed == true){
                completedCount++;
            }else{
                incompleteCount++;
            }
        })
        let count = 0;
        tasks.forEach(element => {
            if(!element.completed){
                count++;
            const card = document.createElement("div");
            card.classList.add("container-card")
            const row = document.createElement("div");
            row.classList.add("row-centered")
            card.appendChild(row);
            const toggleButton = document.createElement("button")
            toggleButton.textContent = "✓";
            toggleButton.classList.add("toggle-button")
            toggleButton.addEventListener("click", (e) =>{
                toggleFinished(0, element.id);
                refreshCards();
                e.stopPropagation();
            })
            row.appendChild(toggleButton);
            const column = document.createElement("div");
            column.classList.add("column")
            column.classList.add("item2")
            row.appendChild(column);
            const cardTitle = document.createElement("h4");
            cardTitle.textContent = element.title;
            column.appendChild(cardTitle);
            const cardDue = document.createElement("p")
            cardDue.textContent = element.dueHour + ', ' +element.dueDate;
            column.appendChild(cardDue);
            if(element.priority == 1){
                card.style.borderLeftColor = "red";
            }else if(element.priority == 2){
                card.style.borderLeftColor = "orange"
            }else{
                card.style.borderLeftColor = "green"
            }

            const removeProject = document.createElement("img")
            removeProject.src = removePicture
            removeProject.classList.add("delete-button")
            removeProject.addEventListener("click", (e)=>{
                deleteTask(projectId, element.id);
                reloadProjects();
                loadProjects(projectId);
                e.stopPropagation();
            })
            row.appendChild(removeProject)
            content.appendChild(card);
            if(count < incompleteCount){
                const separator = document.createElement("hr")
                separator.classList.add("separator")
                content.appendChild(separator);
            }
            card.addEventListener("mouseover", ()=>{
                card.style.backgroundColor = getProjects()[0].color;
            })
            card.addEventListener("mouseout", ()=>{
                card.style.backgroundColor = '';
            })
            card.addEventListener("click", () =>{
                showEditTaskDialog(0, element.id);
            })
            }
        });
        if(completedCount != tasks.length && completedCount != 0){
            const separator = document.createElement("hr")
            separator.classList.add("separator")
            content.appendChild(separator);
        }
        count = 0;
        tasks.forEach(element => {
            if(element.completed){
                count++;
                const card = document.createElement("div");
                card.classList.add("container-card")
                card.classList.add("completed")
                const row = document.createElement("div");
                row.classList.add("row-centered")
                card.appendChild(row);
                const toggleButton = document.createElement("button")
                toggleButton.textContent = "✓";
                toggleButton.classList.add("toggle-button")
                toggleButton.addEventListener("click", (e) =>{
                    toggleFinished(0, element.id);
                    refreshCards();
                    e.stopPropagation();
                })
                row.appendChild(toggleButton);
                const column = document.createElement("div");
                column.classList.add("column")
                column.classList.add("item2")
                row.appendChild(column);
                const cardTitle = document.createElement("h4");
                cardTitle.textContent = element.title;
                column.appendChild(cardTitle);
                const cardDue = document.createElement("p")
                cardDue.textContent = element.dueHour + ', ' +element.dueDate;
                column.appendChild(cardDue);
                if(element.priority == 1){
                    card.style.borderLeftColor = "red";
                }else if(element.priority == 2){
                    card.style.borderLeftColor = "orange"
                }else{
                    card.style.borderLeftColor = "green"
                }

                const removeProject = document.createElement("img")
                removeProject.src = removePicture
                removeProject.classList.add("delete-button")
                removeProject.addEventListener("click", (e)=>{
                    deleteTask(0, element.id);
                    reloadProjects();
                    refreshCards();
                    e.stopPropagation();
                })
                row.appendChild(removeProject)
                content.appendChild(card);
                if(count < completedCount){
                    const separator = document.createElement("hr")
                    separator.classList.add("separator")
                    content.appendChild(separator);
                }
                card.addEventListener("mouseover", ()=>{
                    card.style.backgroundColor = getProjects()[0].color;
                })
                card.addEventListener("mouseout", ()=>{
                    card.style.backgroundColor = '';
                })
                card.addEventListener("click", () =>{
                    showEditTaskDialog(0, element.id);
                })
            }
        });
    }
}

export function addProjectsToDropdown(){
    const dropdownProject = document.getElementById("project-input")
    // <option value="0">Inbox</option>
    while(dropdownProject.lastChild){
        dropdownProject.removeChild(dropdownProject.lastChild);
    }
    let projectsArray = getProjects()
    projectsArray.forEach(element => {
        const newSelect = document.createElement("option");
        newSelect.value = element.id;
        newSelect.textContent = element.name;
        dropdownProject.appendChild(newSelect)
    });
}