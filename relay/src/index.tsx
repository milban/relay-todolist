import ReactDom from 'react-dom'
import React from 'react';
import ViewerTodoList from "src/viewer/TodoList";

function App() {
    return <ViewerTodoList />;
}

ReactDom.render(<App/>, document.getElementById('root'))