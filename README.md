# Apollo vs Relay (Todo list)
## Todo list를 만들어보며 비교해보는 Apollo와 Relay

## 기능 명세

- Create todo
    - [x]  server
    - [ ]  apollo
    - [ ]  relay
- Read todo
    - [x]  server
    - [ ]  apollo
    - [ ]  relay
- Read todo list
    - [x]  server
    - [ ]  apollo
    - [ ]  relay
- Update todo
    - [x]  server
    - [ ]  apollo
    - [ ]  relay
- Delete todo
    - [x]  server
    - [ ]  apollo
    - [ ]  relay

## Server

with Nexus

<details>
    <summary>Init</summary>
    
    Init
    
    ```powershell
    $ mkdir your-dir-name && cd your-dir-name
    $ npm init -y
    $ npm add nexus
    ```
    
    Nexus cli 스크립트 생성
    
    ```json
    "scripts": {
      "dev": "nexus dev",
      "build": "nexus build"
    }
    ```
    
    Conventional entrypoint
    
    ```powershell
    $ mkdir api && touch api/app.ts
    $ npm run dev
    ```
    
    In-memory db
    
    ```tsx
    // $ touch api/db.ts
    // api/db.ts
    export const db = {
        todos: [
            {
                id: 1,
                title: 'Graphql 서버 만들기',
                body: 'Nexus를 사용하여 간단한 Graphql 서버를 만들자.',
                isCompleted: false,
            },
            {
                id: 2,
                title: 'React App 만들기 - Apollo',
                body: 'Apollo-client를 사용하여 간단한 React App을 만들자.',
                isCompleted: false,
            },
            {
                id: 3,
                title: 'React App 만들기 - Relay',
                body: 'Relay를 사용하여 간단한 React App을 만들자.',
                isCompleted: false,
            },
        ]
    }
    ```
    
    Graphql context에 In-memory db 주입
    
    ```tsx
    // api/app.ts
    import { schema } from 'nexus'
    import { db } from './db'
    
    schema.addToContext(() => {
        return {
            db
        }
    })
    ```
</details>


<details>
    <summary>Object Type 작성</summary>
    
    파일 생성
    
    ```powershell
    $ mkdir api/graphql && touch api/graphql/Todo.ts
    ```
    
    Object Type 작성 - Todo
    
    ```tsx
    // api/graphql/Todo.ts
    import {schema} from 'nexus';
    
    schema.objectType({
        name: 'Todo',
        definition(t) {
            t.int('id')
            t.string('title')
            t.string('body')
            t.boolean('isCompleted')
        },
    });
    ```
    
    `api.graphql` 파일을 확인해보면 다음과 같이 SDL(GraphQL Schema Definition Language)로 `Todo`가 작성돼있음을 볼 수 있다.
    
    ```graphql
    # api.graphql
    type Todo {
      body: String
      id: Int
      isCompleted: Boolean
      title: String
    }
    ```
</details>


<details>
    <summary>Query 확장</summary>
    
    Query 확장 - Todo, Todo list
    
    ```tsx
    // api/graphql/Todo.ts
    ...
    schema.extendType({
        type: 'Query',
        definition(t) {
            t.field('todo', {
                nullable: false,
                type: 'Todo',
                args: {
                  id: schema.intArg({ required: true })
                },
                resolve(_root, _args, ctx) {
                    const todo = ctx.db.todos.find(todo => todo.id === _args.id);
    
                    if(!todo) {
                        throw new Error('Could not find todo with id ' + _args.id);
                    }
    
                    return todo;
                }
            })
            t.list.field('todos', {
                nullable: false,
                type: 'Todo',
                resolve(_root, _args, ctx) {
                    return ctx.db.todos;
                }
            })
        }
    })
    ```
</details>


<details>
    <summary>Mutation 확장</summary>
    
    Mutation 확장 - CreateTodo
    
    ```tsx
    // api/graphql/Todo.ts
    ...
    schema.inputObjectType({
        name: 'TodoCreateInput',
        definition(t) {
            t.string('title', { required: true })
            t.string('body', { required: true })
        }
    })
    ...
    schema.extendType({
        type: 'Mutation',
        definition(t) {
            t.field('createTodo', {
                nullable: false,
                type: 'Todo',
                args: {
                    input: schema.arg({ type: 'TodoCreateInput', required: true })
                },
                resolve(_root, _args, ctx) {
                    const todo = {
                        id: ctx.db.todos.length + 1,
                        title: _args.input.title,
                        body: _args.input.body,
                        isCompleted: false,
                    }
                    ctx.db.todos.push(todo);
                    return todo;
                }
            })
        }
    })
    ...
    
    ```
    
    ---
    
    Mutation 확장 - UpdateTodo
    
    ```tsx
    // api/graphql/Todo.ts
    ...
    schema.inputObjectType({
        name: 'TodoUpdateInput',
        definition(t) {
            t.int('id', { required: true })
            t.string('title', { required: false })
            t.string('body', { required: false })
            t.boolean('isCompleted', { required: false })
        }
    })
    ...
    schema.extendType({
        type: 'Mutation',
        definition(t) {
            ...
            t.field('updateTodo', {
                nullable: false,
                type: 'Todo',
                args: {
                    input: schema.arg({ type: 'TodoUpdateInput', required: true })
                },
                resolve(_root, _args, ctx) {
                    let todo = ctx.db.todos.find(todo => todo.id === _args.input.id);
    
                    if (!todo) {
                        throw new Error('Could not find todo with id ' + _args.input.id);
                    }
    
                    todo = {
                        id: todo.id,
                        body: _args.input.body || todo.body,
                        title: _args.input.title || todo.body,
                        isCompleted: _args.input.isCompleted ?? todo.isCompleted,
                    };
    
                    ctx.db.todos = [
                        ...ctx.db.todos.filter(todo => todo.id !== _args.input.id),
                        todo,
                    ];
    
                    return todo;
                }
            })
        }
    })
    ```
    
    ---
    
    Mutation 확장 - UpdateTodo
    
    ```tsx
    // api/graphql/Todo.ts
    ...
    schema.extendType({
        type: 'Mutation',
        definition(t) {
            ...
            t.field('deleteTodo', {
                nullable: false,
                type: 'Todo',
                args: {
                    id: schema.intArg({ required: true })
                },
                resolve(_root, _args, ctx) {
                    const targetTodo = ctx.db.todos.find(todo => todo.id === _args.id);
    
                    if (!targetTodo) {
                        throw new Error('Could not find todo with id ' + _args.id);
                    }
    
                    ctx.db.todos = ctx.db.todos.filter(todo => todo.id !== targetTodo.id);
    
                    return targetTodo;
                }
            })
        }
    })
    ...
    ```
</details>


<details>
    <summary>모든 코드</summary>
    
    ```tsx
    // db.ts
    export const db = {
        todos: [
            {
                id: 1,
                title: 'Graphql 서버 만들기',
                body: 'Nexus를 사용하여 간단한 Graphql 서버를 만들자.',
                isCompleted: false,
            },
            {
                id: 2,
                title: 'React App 만들기 - Apollo',
                body: 'Apollo-client를 사용하여 간단한 React App을 만들자.',
                isCompleted: false,
            },
            {
                id: 3,
                title: 'React App 만들기 - Relay',
                body: 'Relay를 사용하여 간단한 React App을 만들자.',
                isCompleted: false,
            },
        ]
    }
    ```
    
    ```tsx
    // api/app.ts
    import { schema } from 'nexus'
    import { db } from './db'
    
    schema.addToContext(() => {
        return {
            db
        }
    })
    ```
    
    ```tsx
    // api/graphql/Todo.ts
    import { schema } from 'nexus';
    
    schema.objectType({
        name: 'Todo',
        definition(t) {
            t.int('id')
            t.string('title')
            t.string('body')
            t.boolean('isCompleted')
        },
    });
    
    schema.inputObjectType({
        name: 'TodoCreateInput',
        definition(t) {
            t.string('title', { required: true })
            t.string('body', { required: true })
        }
    })
    
    schema.inputObjectType({
        name: 'TodoUpdateInput',
        definition(t) {
            t.int('id', { required: true })
            t.string('title', { required: false })
            t.string('body', { required: false })
            t.boolean('isCompleted', { required: false })
        }
    })
    
    schema.extendType({
        type: 'Query',
        definition(t) {
            t.field('todo', {
                nullable: false,
                type: 'Todo',
                args: {
                  id: schema.intArg({ required: true })
                },
                resolve(_root, _args, ctx) {
                    const todo = ctx.db.todos.find(todo => todo.id === _args.id);
    
                    if(!todo) {
                        throw new Error('Could not find todo with id ' + _args.id);
                    }
    
                    return todo;
                }
            })
            t.list.field('todos', {
                nullable: false,
                type: 'Todo',
                resolve(_root, _args, ctx) {
                    return ctx.db.todos;
                }
            })
        }
    })
    
    schema.extendType({
        type: 'Mutation',
        definition(t) {
            t.field('createTodo', {
                nullable: false,
                type: 'Todo',
                args: {
                    input: schema.arg({ type: 'TodoCreateInput', required: true })
                },
                resolve(_root, _args, ctx) {
                    const todo = {
                        id: ctx.db.todos.length + 1,
                        title: _args.input.title,
                        body: _args.input.body,
                        isCompleted: false,
                    }
                    ctx.db.todos.push(todo);
                    return todo;
                }
            })
            t.field('updateTodo', {
                nullable: false,
                type: 'Todo',
                args: {
                    input: schema.arg({ type: 'TodoUpdateInput', required: true })
                },
                resolve(_root, _args, ctx) {
                    let todo = ctx.db.todos.find(todo => todo.id === _args.input.id);
    
                    if (!todo) {
                        throw new Error('Could not find todo with id ' + _args.input.id);
                    }
    
                    todo = {
                        id: todo.id,
                        body: _args.input.body || todo.body,
                        title: _args.input.title || todo.body,
                        isCompleted: _args.input.isCompleted ?? todo.isCompleted,
                    };
    
                    ctx.db.todos = [
                        ...ctx.db.todos.filter(todo => todo.id !== _args.input.id),
                        todo,
                    ];
    
                    return todo;
                }
            })
            t.field('deleteTodo', {
                nullable: false,
                type: 'Todo',
                args: {
                    id: schema.intArg({ required: true })
                },
                resolve(_root, _args, ctx) {
                    const targetTodo = ctx.db.todos.find(todo => todo.id === _args.id);
    
                    if (!targetTodo) {
                        throw new Error('Could not find todo with id ' + _args.id);
                    }
    
                    ctx.db.todos = ctx.db.todos.filter(todo => todo.id !== targetTodo.id);
    
                    return targetTodo;
                }
            })
        }
    })
    ```
</details>