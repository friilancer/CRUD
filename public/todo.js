const buildIds = (id) => {
    return {
        editId : `edit${id}`,
        deleteId : `del${id}`,
        elemId : `elem${id}`
    };
}

const createTodo = (id, todo, container) => {
    let {editId, deleteId, elemId} = buildIds(id);
    let elem = document.createElement('div');
    elem.classList.add('todo');
    elem.id = elemId;
    let secondary = document.createElement('div');
    secondary.textContent = todo;
    let edit = document.createElement('button');
    edit.textContent = 'edit';
    edit.id = editId;
    edit.onclick = () => editTodo(editId, elemId);
    let del = document.createElement('button');
    del.id = deleteId;
    del.onclick = () => deleteTodo(deleteId, elemId);
    del.textContent = 'delete'
    del.classList.add('todoButton', 'deleteButton');
    edit.classList.add('todoButton', 'editButton');
    elem.append(secondary);
    elem.append(edit);
    elem.append(del);
    container.append(elem);
};

const displayTodo = (data) => {
    let display = document.getElementById('todoDisplay');
    for(let x = 0; x < data.length; x++ ){
        let {_id : id, todo} = data[x];            
        createTodo(id, todo, display);
    }
}

const getTodo = () => {
    fetch('/todos', {method: 'get'}).then((res) => res.json()).then(data => {displayTodo(data)}).catch(err => console.log(err))
    
};

document.getElementById('form').onsubmit = (e) => {
    let val = document.getElementById('input').value.toString().trim();
    
    fetch('/', {
        method : 'post',
        body: JSON.stringify({todo:val}),
        headers:{
            "Content-Type" : "application/json"
        }   
    }).then(res => res.json()).then((res) => {
        console.log(res);
        let {data, docs} = res;
        if(data.result.ok == 1 && data.result.n == 1){
            let {_id:id, todo} = docs;
            createTodo(id, todo, document.getElementById('todoDisplay'));
            document.getElementById('input').value = '';
        }        
    })
    e.preventDefault();
}

const deleteTodo = (deleteId, elemId) => {
    let id = deleteId.slice(3, deleteId.length);
    fetch(`/${id}`, {method: 'delete'}).then((res) => res.json()).then((res) => {
        if(res.result.ok == 1 && res.result.n==1){
             let todo = document.getElementById(elemId);
             todo.remove();
        }
    });
};

const editTodo = (editId, elemId) => {
    let id = editId.slice(4, editId.length);
    console.log(id);
    let val = document.getElementById('input').value.toString().trim();
    fetch(`/${id}`, {
        method: 'put',
        headers:{
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({todo:val})
    }).then(res => res.json()).then((res) => {
        
        if(res.lastErrorObject.n == 1 && res.ok == 1 ){
            let todo = document.getElementById(elemId);
            todo.firstChild.textContent = val;
            document.getElementById('input').value = '';
        }
    })
}

getTodo();