import React from "react";
import { graphql, createFragmentContainer } from "react-relay";
import {Todo_todo} from "src/fragmentContainer/__generated__/Todo_todo.graphql";
import TodoStatus from "src/fragmentContainer/TodoStatus";


interface TodoProps {
    todo: Todo_todo;
}

function Todo({ todo }: TodoProps): JSX.Element {
    return <div>
        <div>{todo.id}</div>
        <span>{todo.title}</span>
        <TodoStatus todo={todo} />
        <div>{todo.body}</div>
    </div>
}

export default createFragmentContainer(Todo, {
    todo: graphql`
        fragment Todo_todo on Todo {
            __typename
            id
            title
            body
            ...TodoStatus_todo
        }
    `
})