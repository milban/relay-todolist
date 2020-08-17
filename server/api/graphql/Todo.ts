import { schema } from 'nexus';

schema.objectType({
    name: 'Todo',
    definition(t) {
        t.id('id')
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
        t.id('id', { required: true })
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
              id: schema.idArg({ required: true })
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
                    id: String(ctx.db.todos.length + 1),
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
                id: schema.idArg({ required: true })
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