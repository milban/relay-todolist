import ReactDom from 'react-dom'
import React, {useEffect} from 'react';
import ViewerTodoList from "src/viewer/TodoList";
import 'antd/dist/antd.css';

function App() {
    return <ViewerTodoList />;
}

ReactDom.render(<App/>, document.getElementById('root'))