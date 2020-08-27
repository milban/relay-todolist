import React from "react";
import {graphql, QueryRenderer} from 'react-relay';
import {TodoQuery, TodoQueryResponse} from "src/viewer/__generated__/TodoQuery.graphql";
import environment from "src/relay.environment";
import Todo from "src/fragmentContainer/Todo";

interface ViewerTodoProps {
    id: string;
}

export default function ViewerTodo({ id }: ViewerTodoProps): JSX.Element {
    return (
        <QueryRenderer<TodoQuery>
            environment={environment}
            query={graphql`
                query TodoQuery($id: ID!) {
                    todo(id: $id) {
                        ...Todo_todo
                    }
                }
            `}
            variables={{
                id
            }}
            render={ViewerTodoRender}
        />
    )
}

interface ViewerTodoRenderProps {
    error: Error | null;
    props: TodoQueryResponse | null;
}

function ViewerTodoRender({error, props}: ViewerTodoRenderProps): JSX.Element {
    if (error) {
        return <p>error...</p>
    }
    if (props) {
        return <Todo todo={props.todo} />
    }
    return <div>Loading...</div>
}