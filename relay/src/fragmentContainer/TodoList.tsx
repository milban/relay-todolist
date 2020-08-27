import React from "react";
import {createFragmentContainer, graphql} from 'react-relay';
import {TodoList_todos} from "src/fragmentContainer/__generated__/TodoList_todos.graphql";
import Todo from "src/fragmentContainer/Todo";

interface TodoListProps {
    todos: TodoList_todos;
}

function TodoList({todos}: TodoListProps): JSX.Element {
    return (<>
            <div>{`총 ${todos.totalCount} 개의 할 일 목록`}</div>
            {todos.edges?.map(todo => <Todo todo={todo} />)}
            </>
    );
}

export default createFragmentContainer(TodoList, {
    todos: graphql`
        fragment TodoList_todos on TodoPage {
            totalCount,
            edges {
                ...Todo_todo
            }
        }
    `
})