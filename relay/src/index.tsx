import ReactDom from 'react-dom'
import React from 'react';
import ViewerTodo from "src/viewer/Todo";

function App() {
    return <ViewerTodo id={'1'} />
}

ReactDom.render(<App/>, document.getElementById('root'))