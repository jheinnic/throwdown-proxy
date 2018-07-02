const { Machine } = require('stent');
const { call, connect } = require('stent/lib/helpers');

const machine = Machine.create('app', {
  state: { name: 'idle', todos: [] },
  transitions: {
    'idle': {
      'add new todo': function ({ todos }, todo) {
        return { name: 'idle', todos: [...todos, todo] };
      },
      'delete todo': function ({ todos }, index) {
        return { name: 'idle', todos: todos.splice(index, 1) };
      },
      'fetch todos': function * () {
        yield 'fetching';

        try {
          const todos = yield call(getTodos, '/api/todos');
          console.log('Got', todos);
          this.fetchedTodos(todos);
          // return { name: 'idle', todos };
        } catch (error) {
          this.failToFetch(error);
        }
      }
    },
    'fetching': {
      'fetched todos': function(_, todos) {
        return { name: 'idle', todos };
      },
      'fail to fetch': function(_, error) {
        return { name: 'fetching failed', error };
      }
    },
    'fetching failed': {
      'fetch todos': function * () {
        yield { name: 'idle', error: null };
        this.fetchTodos();
      }
    }
  }
});

function getTodos(path) {
  return new Promise((resolve) => {
    setTimeout(function() {resolve([{ todo: 'todo', path}]);}, 1750);
  });
}

connect()
  .with('app')
  .map((app) => {
    console.log(app.state);
  });

console.log(machine.fetchTodos()());
console.log(machine.fetchTodos());
