import React from "react";
import {graphql, QueryRenderer} from "react-relay";
import relayEnvironment from "./relay.environment";
import {todoQuery, todoQueryResponse} from "src/__generated__/todoQuery.graphql";

interface RenderQuery {
    error: Error | null;
    props: todoQueryResponse | null;
}

const renderQuery = ({error, props}: RenderQuery) => {
    if (error) {
        return <div>{error.message}</div>;
    } else if (props) {
        console.log(props);
        return (
            <div>
                <div>{`id: ${props.todo.id}`}</div>
            </div>
        )
    }
    return <div>Loading</div>;
}

export default function Todo() {
    return (
    <QueryRenderer<todoQuery>
        environment={relayEnvironment}
        query={graphql`
                query todoQuery($id: ID!) {
                    todo(id: $id) {
                        id
                        title
                        body
                        isCompleted
                    }
                }
            `}
        variables={{
            id: '1'
        }}
        render={renderQuery}
    />)
}