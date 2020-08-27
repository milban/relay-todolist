import React from "react";
import { Modal } from 'antd';
import ViewerTodo from "src/viewer/Todo";
import {ModalProps} from "antd/lib/modal";

interface TodoModalProps extends ModalProps {
    id: string;
}

function TodoModal({id, ...rest}: TodoModalProps): JSX.Element {
    return <Modal visible={true} {...rest}>
        <ViewerTodo id={id} />
    </Modal>
}

export default TodoModal;