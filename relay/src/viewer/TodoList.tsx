import React from "react";
import {graphql, QueryRenderer} from 'react-relay'
import environment from "src/relay.environment";
import {TodoListQuery, TodoListQueryResponse} from "src/viewer/__generated__/TodoListQuery.graphql";
import TodoList from "src/fragmentContainer/TodoList";

export default function ViewerTodoList(): JSX.Element {
    return (
        <QueryRenderer<TodoListQuery>
            environment={environment}
            query={graphql`
                query TodoListQuery {
                    todos {
                        ...TodoList_todos
                    }
                }
            `}
            variables={{}}
            render={ViewerTodoListRender}
        />
    )
}

interface ViewerTodoListRenderProps {
    error: Error | null;
    props: TodoListQueryResponse | null;
}

function ViewerTodoListRender({error, props}: ViewerTodoListRenderProps): JSX.Element {
    if (error) {
        return <p>error...</p>
    }
    if (props) {
        return <TodoList todos={props.todos} />
    }
    return <div>Loading...</div>
}