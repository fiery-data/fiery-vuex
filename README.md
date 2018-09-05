
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

Relies on [fiery-data](https://github.com/fiery-data/fiery-data) and is a sister library to [fiery-vue](https://github.com/fiery-data/fiery-vue) - you can go there to see more advanced examples

**Contents**
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Support](#support)
- [Usage](#usage)
- [Todo](#todo)

### Dependencies

- fiery-data: ^0.4.0 (pulled into build files)
- firebase ^5.0.0 (a runtime dependency only, since you are passing the references)
- vue: ^1.0.28 (not an actual dependency, since you are calling `Vue.use` yourself)
- vuex: ^2.2.0 (not an actual dependency, since you are calling `fieryActions` yourself)

### Installation

#### npm

Installation via npm : `npm install --save fiery-vuex`

### Support

The following caveats exist with this implementation that sets it apart from fiery-data's default functionality:

- Sub collections are not updated through a mutation
- You cannot use the functions on $fiery to perform operations, you must rely on active record functions

### Usage

```typescript
import Vue from 'vue'
import Vuex from 'vuex'
import FieryVuex from 'fiery-vue'
import firebase from 'firebase'

require('firebase/firestore')

Vue.use(Vuex)
Vue.use(FieryVuex)

const app = firebase.initializeApp({ ... })
const fs = firebase.firestore(app);

class Todo {}

const TodoOptions = {
  shared: true,
  type: Todo,
  include: ['name', 'done'],
  record: true,
  nullifyMissing: true
}

const store = new Vuex.Store({
  strict: true,
  state: {
    todo: new Todo(),
    todos: [] as Todo[]
  },
  mutations: {
    // mutations receive a function which MUST be called which updates the data in the state synchronously
    setTodo (state, getTodo) {
      state.todo = getTodo()
    },
    setTodos (state, getTodos) {
      state.todos = getTodos()
    }
  },
  actions: {
    ...fieryActions({
      // special function to fiery-vuex
      // commit must be called "normally" with a name and the result of $fiery.
      // this registers this mutation so live updates can call this same mutation
      loadTodo ($fiery, commit, payload, context) {
        commit('setTodo', $fiery(fs.collection('todos').doc(payload), TodoOptions))
      },
      updateTodos ($fiery, commit, payload, context) {
        commit('setTodos', $fiery(fs.collection('todos'), {
          extends: TodoOptions,
          query: q => q.orderBy('name').where('done', '==', payload.done)
        }))
      }
    })
  }
})

// since fiery operates synchronously and asynchronously so actions must be used

// update collection with parameters
store.dispatch('updateTodos', {done: true})

// update document with parameters
store.dispatch('loadTodo', 1)
```

### Todo

- Access to $fiery in mutations
- Shared $fiery instance between mutations and actions
- Sub collections are handled through mutations (perhaps dynamically created mutation)

## LICENSE
[MIT](https://opensource.org/licenses/MIT)
