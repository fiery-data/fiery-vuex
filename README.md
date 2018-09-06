
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
  - [Document Example](#document-example)
  - [Collection Example](#collection-example)
- You can create actions & mutations which have access to `$fiery` for [saving, removing, etc](https://github.com/fiery-data/fiery-data/blob/master/src/types.ts#L151)
  - [Mutation Example](#mutation-example)
  - [Action Example](#action-example)

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
import FieryVuex, { fieryBindings, fieryActions, fieryMutations, fieryMapMutations, fieryState } from 'fiery-vuex'
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
    todos: [],
    // this should not be used in strict mode, since this document or collection will receive real-time updates outside of a mutation
    ...fieryState($fiery => {
      specificTodo: $fiery(fs.collection('todos').doc(23))
    })
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
    todos: [] as Todo[],
    // this should not be used in strict mode, since this document or collection will receive real-time updates outside of a mutation
    ...fieryState($fiery => {
      specificTodo: $fiery(fs.collection('todos').doc(23), TodoOptions) as Todo
    })
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
var fieryState = FieryVuex.fieryState;

var store = new Vuex.Store({
  // You must wrap the entire state with fieryState if you want access to $fiery
  // this should not be used in strict mode, since this document or collection will receive real-time updates outside of a mutation
  state: fieryState(function($fiery) {
    return {
      currentTodo: null,
      todos: [],
      specificTodo: $fiery(fs.collection('todos').doc(23))
    }
  }),
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

### Document Example

```javascript
const SET_POST = 'setPost'

const store = new Vuex.Store({
  state: {
    post: null
  },
  mutations: {
    // since state should only be modified synchronously through mutations, this
    // is necessary so the action below can update the post when it changes.
    [SET_POST] (state, getPost) {
      state.post = getPost()
      // you can do other stuff in here, stuff you want done each time post changes
    },
    // this is equivalent and can generate multiple mutations in one call.
    ...fieryMapMutations({
      [SET_POST]: 'post'
    })
  },
  actions: {
    ...fieryBindings({
      // state is modified asynchronously through actions, this will call setPost
      // with a function which MUST be called ONCE or the post will not be updated
      // with the data from Firestore
      loadPost (context, postId, $fiery) {
        return $fiery(fs.collection('posts').doc(postId), {}, SET_POST)
      }
    })
  }
})

// SET post to posts/123
// this returns a promise which resolves when the post is first loaded from cache/server
store.dispatch('loadPost', 123)
```

### Collection Example

```javascript
const SET_GROUPS = 'setGroups'

const store = new Vuex.Store({
  state: {
    groups: []
  },
  mutations: {
    // since state should only be modified synchronously through mutations, this
    // is necessary so the action below can update the groups when they change
    [SET_GROUPS] (state, getGroups) {
      state.groups = getGroups()
      // you can do other stuff in here, stuff you want done each time groups changes
    },
    // this is equivalent and can generate multiple mutations in one call.
    ...fieryMapMutations({
      [SET_GROUPS]: 'groups'
    })
  },
  actions: {
    ...fieryBindings({
      // state is modified asynchronously through actions, this will call setGroups
      // with a function which MUST be called ONCE or the groups will not be updated
      // with the data from Firestore
      loadGroups (context, search, $fiery) {
        const options = {
          query: q => {
            if (search.user) return q.where('users', 'array-contains', search.user)
            if (search.code) return q.where('code', '==', search.code)
            return q
          }
        }
        return $fiery(fs.collection('groups'), options, SET_GROUPS)
      }
    })
  }
})

// this returns a promise which resolves when the post is first loaded from cache/server
store.dispatch('loadGroups') // all groups
store.dispatch('loadGroups', {user: 34}) // all groups with user 34
store.dispatch('loadGroups', {code: 'ABC'}) // all groups with code ABC
```

### Mutation Example

```javascript
const FINISH_TASK = 'finishTask'
const ADD_TASK = 'addTask'

const store = new Vuex.Store({
  mutations: {
    // This will call mutations normally but passes $fiery so operations can be
    // performed on the state or payload.
    ...fieryMutations({
      [FINISH_TASK] (state, task, $fiery) {
        task.done = true
        task.done_at = new Date()
        $fiery.save(task) // creates or updates the task
      },
      [ADD_TASK] (state, name, $fiery) {
        const task = $fiery(fs.collection('tasks').doc(), {once: true}) // we don't want real-time updates of this object
        task.name = name
        $fiery.save(task)
      }
    })
  }
})

// updates the task and saves it to Firestore
store.commit(FINISH_TASK, task)

// adds a new task
store.commit(ADD_TASK, 'Task Name')
```

### Action Example

```javascript
const EVALUATE_CHANGES = 'evaluateChanges'
const CHECK_FOR_CHANGES = 'checkForChanges'

const store = new Vuex.Store({
  state: {
    todo: null
  },
  mutations: {
    [EVALUATE_CHANGES] (state, changes) {
      // do something with the changes found in todo
    }
  },
  actions: {
    // This will call actions normally but passes $fiery so operations can be
    // performed on the context or payload
    ...fieryActions({
      [CHECK_FOR_CHANGES] ({state, commit}, payload, $fiery) {
        // return a promise so you can chain this action like normal
        return $fiery.getChanges(state.todo).then(changes => {
          commit(EVALUATE_CHANGES, changes)
        })
      }
    })
  }
})

// runs the possibly asynchronous operation of comparing local changes to
// remote changes for a todo
store.dispatch(CHECK_FOR_CHANGES) //: Promise
```

## LICENSE
[MIT](https://opensource.org/licenses/MIT)
