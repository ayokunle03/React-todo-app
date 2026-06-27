import { useState, useEffect } from 'react'
import axios from 'axios';
import { MdOutlineDone, MdModeEditOutline } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';


function App() {
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState('');

  const getTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/todos');
      setTodos(response.data);
      console.log('Fetched todos:', response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/todos', { description, completed: false }); 
      setDescription('');
      getTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-800 ">
     <div className="bg-gray-50 rounded-2xl shadow-xl w-full">
     <h1 className="text-4xl font-bold text-gray-800">
        React Todo App  
     </h1> 
        <form 
        onSubmit={onSubmit}
        className="flex items-center justify-between gap-2 p-2 rounded-lg mb-6"
        action="">
          <input className="flex-1 w-full 
          outline-none px-3 py-2 text-gray-700 
          placeholder:text-gray-400" 
          type="text" value={description} 
          onChange={(e) => setDescription(e.target.value)}
           placeholder="what need to be done" 
           required />
          <button className="bg-blue-500 
          hover:bg-blue-700 
          text-white font-medium py-2 px-4 
          rounded-md cursor-pointer" 
          type="submit"
          >
            Add Task
          </button>
        </form>
        <div>
          {todos.length === 0 ? (
            <p className="text-gray-500">No tasks available</p>
          ) : (
  
            <div className="flex flex-col gap-y-4">
              {todos.map((todo) => (
               <div key={todo.todo_id} className="pb-4">

                {editingTodo === todo.todo_id ? (
                  <div>
                    <input
                      type="text"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="border rounded-lg p-3 
                      border-gray-200 outline-none
                      focus:ring-2 focus:ring-blue-300
                      text-gray-700 shadow-inner
                      "/>

                      <div>
                        <button className='px-4 py-2 bg-green-500
                        text-white rounded-lg mr-2
                        mt-2 hover:bg-green-600 duration-200'><MdOutlineDone /></button>
                        <button className='px-4 py-2 bg-red-500
                        text-white rounded-lg
                        mt-2 hover:bg-red-600 duration-200'><IoClose /></button>
                      </div>
                  </div>
               
                ) : (
                  
                    <div className=" flex justify-between items-center">
                         <div className="flex items-center    gap-x-4 " >
                        <button
                        className={`h-6 w-6 border-2 rounded-full flex items-center justify-center ${todo.completed ? 'bg-green-500 border-green-500 text-white' : 'text-gray-300 hover:bg-gray-300           hover:text-blue-400'}`}
                        >
                        {todo.completed && <MdOutlineDone />}
                        </button>
                        <span>
                        {todo.description}
                        </span>
                        
                     </div>
                     <div className="flex items-center gap-x-2">
                          <button 
                            onClick={() => {
                            setEditingTodo(todo.todo_id);
                            setEditedText(todo.description);
                            }}
                            className="text-blue-500 rounded-lg p-2   
                            hover:bg-blue-500 duration-200  
                            hover:text-white">
                              <MdModeEditOutline />
                          </button>
                          <button className="text-red-500 rounded-lg p-2 hover:bg-red-500 duration-200 hover:text-white">
                              <FaTrash />
                          </button>
                        </div>
                    </div>
                
                )}

               

               </div>
              )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
