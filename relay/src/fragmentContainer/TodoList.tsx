import React, {useCallback, useState} from "react";
import {createFragmentContainer, graphql} from 'react-relay';
import {TodoList_todos} from "src/fragmentContainer/__generated__/TodoList_todos.graphql";
import {Button, Checkbox} from "antd";
import TodoModal from "src/components/TodoModal";

interface TodoListProps {
    todos: TodoList_todos;
}

function TodoList({todos}: TodoListProps): JSX.Element {
    const [visible, setVisible] = useState(false);
    const [selectedId, setSelectedId] = useState<string>()

    const onClick = useCallback((selectedId: string) => {
        setSelectedId(selectedId);
        setVisible(true);
    },[])

    return (<>
            <div>{`총 ${todos.totalCount} 개의 할 일 목록`}</div>
            {todos.edges?.map(todo => (<div>
                <span>{todo.id}</span>
                <Button type="link" onClick={() => onClick(todo.id as string)}>{todo.title}</Button>
                <Checkbox checked={todo.isCompleted ?? undefined} />
            </div>)
            )}
            {visible && <TodoModal id={selectedId as string} onCancel={() => setVisible(false)} closable />}
            </>
    );
}

export default createFragmentContainer(TodoList, {
    todos: graphql`
        fragment TodoList_todos on TodoPage {
            totalCount,
            edges {
                __typename
                id
                title
                isCompleted
            }
        }
    `
})