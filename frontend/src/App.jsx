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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const getTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/todos');
      setTodos(response.data);
      console.log('Fetched todos:', response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('failed to fetch todos....please try again later..');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Description cannot be empty');
      return;
    }
    try {
      setError(null);
      const res =await axios.post('http://localhost:5000/todos', { description, completed: false });
      setTodos([...todos, res.data]);
      setDescription('');
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo....please try again later..'); 
    }
  };

  const saveEditedTodo = async (todoId) => {
    try {
      setError(null);
      const todoToUpdate = todos.find((todo) => todo.todo_id === todoId);
      const trimmedText = editedText.trim();

      if(todoToUpdate.description === trimmedText) {
        setEditingTodo(null);
        setEditedText('');
        return;
      }

      if (!trimmedText) {
        setError('Description cannot be empty');
        return;
      }


    const res = await axios.put(`http://localhost:5000/todos/${todoId}`, { description: editedText });
      setEditingTodo(null);
      setEditedText('');
      setTodos(todos.map((todo) => (todo.todo_id === todoId ? {...todo, description: editedText,completed: false} : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo....please try again later..');
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${todoId}`);
      setTodos(todos.filter((todo) => todo.todo_id !== todoId));
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo....please try again later..');
    }
  };

  const toggleComplete = async (todoId) => {
    try {
      const todo = todos.find((todo) => todo.todo_id === todoId);
      await axios.put(`http://localhost:5000/todos/${todoId}`, { 
        description: todo.description,
        completed: !todo.completed });

        setTodos(todos.map((todo) =>
          todo.todo_id === todoId ? { ...todo, completed: !todo.completed } : todo
        )); 
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo....please try again later..');
    }
  }; 

  return (
    <div className="min-h-screen  flex items-center justify-center p-6 bg-gray-800 ">
     <div className="bg-gray-50 p-6 rounded-2xl shadow-xl w-full">
     <h1 className="text-4xl font-bold text-gray-800">
        React Todo App  
     </h1> 
     {error && <p className="text-red-500 mt-2">{error}</p> }
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
          {loading ? (
            <p className="text-gray-500">Loading tasks...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : todos.length === 0 ? (
            <p className="text-gray-500">No tasks available</p>
          ) : (
  
            <div className="flex flex-col gap-y-4">
              {todos.map((todo) => (
               <div key={todo.todo_id} className="pb-4">

                {editingTodo === todo.todo_id ? (
                  <div className="flex items-center gap-x-3">
                    <input
                      type="text"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="
                      flex-1
                      border rounded-lg p-3 
                      border-gray-200 outline-none
                      focus:ring-2 focus:ring-blue-300
                      text-gray-700 shadow-inner
                      "/>

                      <div >
                        <button 
                        onClick={() => saveEditedTodo(todo.todo_id)}  
                        className='px-4 py-2 bg-green-500
                        text-white rounded-lg mr-2
                        mt-2 hover:bg-green-600 duration-200'
                        >
                          <MdOutlineDone />
                         </button>
                         <button 
                         onClick={() => setEditingTodo(null)}
                         className='px-4 py-2 bg-gray-500
                        text-white rounded-lg
                        mt-2 hover:bg-gray-600 duration-200'
                        >
                          <IoClose />
                         </button>
                      </div>
                  </div>
               
                ) : (
                  
                    <div className=" flex justify-between items-center">
                         <div className="flex items-center overflow-hidden gap-x-4 " >
                        <button
                        onClick={() => toggleComplete(todo.todo_id)}  
                        className={`flex-shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center ${todo.completed ? 'bg-green-500 border-green-500 text-white' : 'text-gray-300 hover:bg-gray-300           hover:text-blue-400'}`}
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
                          <button 
                          onClick={() => deleteTodo(todo.todo_id)}
                          className="text-red-500 rounded-lg p-2 hover:bg-red-500 duration-200 hover:text-white">
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
