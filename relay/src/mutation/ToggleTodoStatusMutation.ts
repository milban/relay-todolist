import {graphql, commitMutation} from 'react-relay';
import {Environment} from "relay-runtime/lib/store/RelayStoreTypes";
import {
    ToggleTodoStatusMutation,
    ToggleTodoStatusMutationResponse
} from "src/mutation/__generated__/ToggleTodoStatusMutation.graphql";

const mutation = graphql`
    mutation ToggleTodoStatusMutation($input: TodoUpdateInput!) {
        updateTodo(input: $input) {
            id
            isCompleted
        }
    }
`

function getOptimisticResponse(id: string, isCompleted: boolean): ToggleTodoStatusMutationResponse {
    return {
        updateTodo:{
            id,
            isCompleted
        }
    }
}

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
            optimisticResponse: getOptimisticResponse(id, isCompleted),
        }
    )
}

export default {commit}