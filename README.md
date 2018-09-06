
<p align="center">
  <img src="https://avatars1.githubusercontent.com/u/42543587?s=200&v=4" alt="Fiery Vuex">  
</p>

<p align="center">
<img src="https://img.shields.io/npm/v/fiery-vuex.svg">
<img src="https://img.shields.io/npm/l/fiery-vuex.svg">
<img src="https://travis-ci.org/fiery-data/fiery-vuex.svg?branch=master">
</p>

## fiery-vuex

Vuex binding for Google Firebase Cloud Firestore.

Relies on [fiery-data](https://github.com/fiery-data/fiery-data) and is a sister library to [fiery-vue](https://github.com/fiery-data/fiery-vue) - you can go there to see more advanced examples on how to call `$fiery`

**Features**
- You can bind documents and collections to the store, and change them dynamically through actions.
- You can create actions & mutations which have access to `$fiery` for [saving, removing, etc](https://github.com/fiery-data/fiery-data/blob/master/src/types.ts#L151)

**Contents**
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Usage](#usage)

### Dependencies

- fiery-data: ^0.4.0 (pulled into build files)
- firebase ^5.0.0 (a runtime dependency only, since you are passing the references)
- vue: ^1.0.28 (not an actual dependency, since you are calling `Vue.use` yourself)
- vuex: ^2.2.0 (not an actual dependency)

### Installation

#### npm

Installation via npm : `npm install --save fiery-vuex`

### Usage

- [Setup](#setup)
- [Example (ES2015)](#example-es2015)
- [Example (Typescript)](#example-typescript)
- [Example (JS)](#example-js)

#### Setup

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import FieryVuex, { fieryBindings, fieryActions, fieryMutations, fieryMapMutations } from 'fiery-vuex'
import firebase from 'firebase'

require('firebase/firestore')

Vue.use(Vuex)
Vue.use(FieryVuex)

// FieryVuex.$fiery is available now, but not needed

const app = firebase.initializeApp({ ... })
const fs = firebase.firestore(app);
```

#### Example (ES2015)

```javascript
// The store has the following functionality:
// - store.commit( 'finishTodo', todo )
// - store.commit( 'nextPage' )
// - store.dispatch( 'setTodo', todoId )
// - store.dispatch( 'loadTodos' )
// - store.dispatch( 'searchTodos', {done: true, limit: 10} )
// - store.dispatch( 'checkForChanges' )

const store = new Vuex.Store({
  state: {
    currentTodo: null,
    todos: []
  },
  mutations: {
    // functions you want access to $fiery to perform operations
    ...fieryMutations({
      // store.commit('finishTodo', todo)
      finishTodo (state, todo, $fiery) {
        todo.done = true;
        todo.done_at = new Date();
        $fiery.save(todo);
      },
      // store.commit('nextPage') - only makes sense when searchTodos called
      nextPage (state, payload, $fiery) {
        $fiery.pager(state.todos).next()
      }
    }),
    // mutation which is given a result of a binding
    setTodos (state, getTodos) {
      state.todos = getTodos()
    },
    // or you can specify multiple mutations at once which take binding results
    ...fieryMapMutations({
      // mutation: stateVar
      'setTodo': 'currentTodo'
    })
  },
  actions: {
    // bind results of actions to variables, automatically calls listed mutation
    // when data changes from Firestore
    ...fieryBindings({
      // store.dispatch( 'setTodo', todoId )
      setTodo (context, todoId, $fiery) {
        return $fiery(fs.collection('todos').doc(todoId), {}, 'setTodo') // must list mutation here
      },
      // store.dispatch( 'loadTodos' )
      loadTodos (context, payload, $fiery) {
        return $fiery(fs.collection('todos'), {}, 'setTodos')
      },
      // store.dispatch( 'searchTodos', {done: true, limit: 10} )
      searchTodos (context, {done, limit}, $fiery) {
        const options = {
          query: q => q.where('done', '==', done),
          limit: limit
        }
        return $fiery(fs.collection('todos'), options, 'setTodos')
      }
    }),
    // custom actions with access to $fiery
    ...fieryActions({
      checkForChanges ({state, commit}, payload, $fiery) {
        // return a promise so you can chain this action
        return $fiery.getChanges(state.currentTodo).then(changes => {
          commit('evaluateChanges', changes)
        })
      }
    })
  }
})
```

#### Example (TypeScript)

```typescript
import { FieryRecordSave, FieryRecordRemove } from 'fiery-vuex'

class Todo {
  name: string = ''
  done: boolean = false
  done_at: Date | null = null

  save: FieryRecordSave
  remove: FieryRecordRemove
}

const TodoOptions = {
  shared: true,
  type: Todo,
  include: ['name', 'done', 'done_at'],
  timestamps: ['done_at'],
  record: true,
  recordOptions: {
    save: 'save',
    remove: 'remove'
  }
}

const store = new Vuex.Store({
  state: {
    currentTodo: null as Todo | null,
    todos: [] as Todo[]
  },
  mutations: {
    ...fieryMutations({
      nextPage (state, payload, $fiery) {
        $fiery.pager(state.todos).next()
      }
    }),
    // with active record, we don't need $fiery mutation
    finishTodo (state, todo) {
      todo.done = true
      todo.done_at = new Date()
      todo.save()
    },
    ...fieryMapMutations({
      'setTodos': 'todos',
      'setTodo': 'currentTodo'
    })
  },
  actions: {
    ...fieryBindings({
      setTodo (context, todoId, $fiery): Todo {
        return $fiery(fs.collection('todos').doc(todoId), TodoOptions, 'setTodo') // must list mutation here
      },
      loadTodos (context, payload, $fiery): Todo[] {
        return $fiery(fs.collection('todos'), TodoOptions, 'setTodos')
      },
      searchTodos (context, {done, limit}, $fiery): Todo[] {
        const options = {
          extends: TodoOptions,
          query: q => q.where('done', '==', done),
          limit: limit
        }
        return $fiery(fs.collection('todos'), options, 'setTodos')
      }
    })
  }
})
```

#### Example (JS)

```javascript
var fieryMutation = FieryVuex.fieryMutation;
var fieryBinding = FieryVuex.fieryBinding;
var fieryAction = FieryVuex.fieryAction;

var store = new Vuex.Store({
  state: {
    currentTodo: null,
    todos: []
  },
  mutations: {
    finishTodo: fieryMutation(function(state, todo, $fiery) {
      todo.done = true;
      todo.done_at = new Date();
      $fiery.save(todo);
    }),
    nextPage: fieryMutation(function(state, payload, $fiery) {
      $fiery.pager(state.todos).next()
    }),
    setTodos: function(state, getTodos) {
      state.todos = getTodos();
    },
    setTodo: function(state, getTodo) {
      state.currentTodo = getTodo();
    }
  },
  actions: {
    // For JS, you need to list the action name and return the result of calling $fiery
    setTodo: fieryBinding('setTodo', function(context, todoId, $fiery) {
      return $fiery(fs.collection('todos').doc(todoId), {}, 'setTodo')
    }),
    loadTodos: fieryBinding('loadTodos', function(context, payload, $fiery) {
      return $fiery(fs.collection('todos'), {}, 'setTodos');
    }),
    searchTodos: fieryBinding('searchTodos', function(context, search, $fiery) {
      var options = {
        limit: search.limit,
        query: function(q) {
          return q.where('done', '==', search.done)
        }
      }
      return $fiery(fs.collection('todos'), options, 'setTodos')
    }),
    checkForChanges: fieryAction(function(context, payload, $fiery) {
      return $fiery.getChanges(context.state.currentTodo).then(function(changes) {
        context.commit('evaluateChanges', changes);
      })
    })
  }
});
```

## LICENSE
[MIT](https://opensource.org/licenses/MIT)
