import {graphql, commitMutation} from 'react-relay';
import {Environment} from "relay-runtime/lib/store/RelayStoreTypes";
import environment from "src/relay.environment";
import {ToggleTodoStatusMutation} from "src/mutation/__generated__/ToggleTodoStatusMutation.graphql";

const mutation = graphql`
    mutation ToggleTodoStatusMutation($input: TodoUpdateInput!) {
        updateTodo(input: $input) {
            __typename
            id
            isCompleted
        }
    }
`

function commit(
    environment: Environment,
    isCompleted: boolean,
    id: string,
) {
    return commitMutation<ToggleTodoStatusMutation>(
        environment,
        {
            mutation,
            variables: {
                input: {
                    id,
                    isCompleted,
                },
            },
        }
    )
}

export default {commit}