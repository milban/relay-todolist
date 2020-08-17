import ReactDom from 'react-dom'
import React from 'react';
import Todo from "./todo";

function App() {
    return <Todo />
}

ReactDom.render(<App/>, document.getElementById('root'))