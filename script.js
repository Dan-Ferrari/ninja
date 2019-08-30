function Todolist(){
    let ultodo, input, btnAll, btnTodo, btnCompleted;
    //todos è la lista di oggetti che corrispondono ai compiti da svolgere, specificando il nome, concluso e l'id univoco
    //createLi è la funzione che crea gli elementi nel file html dove andranno i compiti
    //addNewTodo mi aggunge il todo sia nella todos che attiva la funzione createLi per creare lo spazio corrispettivo nel file html (e lo mette in cima)
    //addTodo (che viene attivata con l'eventlistener sotto) mi dice quali dati (creando l'oggetto TODO) prelevare quando l'evento INVIO viene attivato

    let todos = [];
    /*
        {
            id: 0,
            text: 'Go shopping',
            completed: false
        },
        {
            id: 1,
            text: 'Go to school',
            completed: false
        },
        {
            id: 2,
            text: 'Do homework',
            completed: true
        },*/
    const loadTodosFromLocalStorage = () =>{
        const localTodos = localStorage.getItem('todos');
        console.log(localTodos);
        if(localTodos){
            const todoArr = JSON.parse(localTodos);
            if(todoArr) {
                todos = todoArr;
            }
        }

    };

    const saveTodosToLocalStorage = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    const removeTodo = id => {
        //seleziono con la prima riga il todos da eliminare
            todos = todos.filter((todo)=>todo.id !== id);
            console.log(todos)
            saveTodosToLocalStorage();
            ultodo.removeChild(ultodo.querySelector('#todo-'+id));
    };

    const toggleTodo = (id, ele) => {
            todos = todos.map(ele => {
                if(ele.id===id){
                    ele.completed = !ele.completed;
                }
                return ele;
            });
            saveTodosToLocalStorage();
            console.log(todos);
            //variabile dello span (classe)
            const oldClass = ele.classList.contains('completed') ? 'completed' : 'uncomplete';
            const newClass = oldClass === 'completed' ? 'uncomplete' : 'completed';
            ele.classList.replace(oldClass, newClass);
            ele.parentNode.classList.toggle('completed');
    };

const createLi = ({text, completed, id}) => {
        

        const li = document.createElement('li');
        li.id = 'todo-'+id;
        if(completed){
            li.classList.add('completed');
        };

        const spancheck = document.createElement('span');
        spancheck.classList.add(completed ? 'completed':'uncomplete');
        spancheck.addEventListener('click', (e)=>{
            toggleTodo(id, e.target);
        });

        const spancross = document.createElement('span');
        spancross.classList.add('cross');
        //schiacciando la cross(croce) elimino il todo. genero l'evento removeTodo
        spancross.addEventListener('click', (e)=>{
            removeTodo(id);
        });

        const textNode = document.createTextNode(text);
        
        li.appendChild(spancheck);
        li.appendChild(textNode);
        li.appendChild(spancross);
        return li;
        /*
<li class="completed">
            <span class="completed"></span>
            Todo1
            <span class="cross"></span>
        </li>
        */
    };
const addNewTodo = (todo) => {
        todos.unshift(todo); //unshift anziché push per aggiungerlo all'inizio invece che alla fine
        saveTodosToLocalStorage();
        const li = createLi(todo)
        const firstLi = ultodo.firstChild;
        if(!firstLi){
            ultodo.appendChild(li);
        } else {
            ultodo.insertBefore(li, firstLi)
        }
    }
//la funzione const vale solo all'interno dell'oggetto questo
const addTodo = (e) => {        
        const key = e.keyCode, ele = e.target;
        // 13 = ENTER KEY
        if(key === 13 && ele.value.length>2) {
           const todo = {
               text: ele.value.trim(),
               id: todos.length,
               completed: false
           };           
            addNewTodo(todo);
            ele.value ='';
        }
    }
const renderTodos = (todoType) => {
    const lis = ultodo.querySelectorAll('li');
    if(lis){
        lis.forEach( li => ultodo.removeChild(li));
    }
    const currentTodos = todos.filter(todo=> {
        if(todoType==='all'){
            return todo;
        }
        return (todoType ==='completed') ? todo.completed : !todo.completed;
    });

    currentTodos.map(todo => createLi(todo))
    .forEach( li => ultodo.appendChild(li));
};
const toggleBtnClasses = (target, btns = []) => {
    target.classList.toggle('active');
    target.setAttribute('disabled', true);
    btns.forEach (btn => {
        btn.removeAttribute('disabled');
        btn.classList.remove('active');
    });
}
const addListeners = () => {
    input.addEventListener('keyup',addTodo);
    btnAll = document.querySelector('#btnAll');
    btnCompleted = document.querySelector('#btnCompleted');
    btnTodo = document.querySelector('#btnTodo');

    btnAll.addEventListener('click',e=>{
        toggleBtnClasses(e.target, [btnTodo, btnCompleted]);
        /*e.target.classList.toggle('active');
        e.target.setAttribute('disabled', true);
        
        btnCompleted.removeAttribute('disabled');
        btnTodo.removeAttribute('disabled');
        btnCompleted.classList.remove('active');
        btnTodo.classList.remove('active');*/
        renderTodos('all');
    });

    btnCompleted.addEventListener('click',e=>{
        toggleBtnClasses(e.target, [btnAll, btnTodo]);
        renderTodos('completed');
    });

    btnTodo.addEventListener('click',e=>{
        toggleBtnClasses(e.target, [btnAll, btnCompleted]);
        renderTodos('uncomplete');
    });
};
const renderTodoList = () => {
        //alert('sono funziono solo qua');  
        loadTodosFromLocalStorage();
        ultodo = document.querySelector('ul#todolist');
        if(!ultodo){
            ultodo = document.createElement('ul');
            ultodo.id='todolist';
            document.body.appendChild(ultodo);
        }
        //const lis = 
        renderTodos('all');
        
        input = document.querySelector('#todo');
        if(!input){
            input = document.createElement('input');
            input.id='todo';
            input.name='todo';
            input.placeholder=' Add new todo';
            ultodo.parentNode.insertBefore(input, ultodo);
        }
        // la funzione addTodo è semplicemente stata enunziata sopra, qui viene attivata
    addListeners();
    
};

return {
        getTodos: function(){
            return todos;
        },
        init: function(){
            renderTodoList();
            //renderTodos(); per far vedere che la funzione funziona in tutto lo spazio dell'oggetto
        }
    }
}
const myTodo = Todolist();
myTodo.init(); //così chiamo la funzione specifica-vedi myTodo che è una variabile con la funzione dentro
//console.log(myTodo.getTodos());//ho creato un metodo nell'oggetto dei todos che mi permette di ritornarmeli se lo chiamo
//console.log(myTodo);
