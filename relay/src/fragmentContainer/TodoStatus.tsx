import { graphql, createFragmentContainer } from "react-relay";
import {Checkbox} from "antd";
import React, {useCallback} from "react";
import {CheckboxChangeEvent} from "antd/lib/checkbox";
import environment from "src/relay.environment";
import {TodoStatus_todo} from "src/fragmentContainer/__generated__/TodoStatus_todo.graphql";
import ToggleTodoStatusMutation from "src/mutation/ToggleTodoStatusMutation";

interface TodoStatusProps {
    todo: TodoStatus_todo;
}

function TodoStatus({todo}: TodoStatusProps): JSX.Element {
    const onClickCheckBox = useCallback((e: CheckboxChangeEvent) => {
        ToggleTodoStatusMutation.commit(environment, e.target.checked, todo.id as string);
    },[todo])

    return <Checkbox checked={todo.isCompleted as boolean} onChange={onClickCheckBox}/>
}

export default createFragmentContainer(TodoStatus, {
    todo: graphql`
        fragment TodoStatus_todo on Todo {
            __typename
            id
            isCompleted
        }
    `
})