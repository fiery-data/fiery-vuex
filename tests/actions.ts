
/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai/index.d.ts" />
/// <reference path="../node_modules/fiery-data/dist/types/types.d.ts" />

import { getStore, getStored } from './util'
import { expect } from 'chai'
import FieryVuex, { fieryActions } from '../src'
import * as Vue from 'vue'
import * as Vuex from 'vuex'

describe('actions', function()
{
  const VueTest: any = Vue

  before(function() {
    VueTest.use(Vuex)
    VueTest.use(FieryVuex)
  })

  class Todo {
    name: string = ''
    done: boolean = false
  }

  const TodoOptions = {
    shared: true,
    type: Todo,
    include: ['name', 'done'],
    record: true,
    nullifyMissing: true
  }

  it('documents', function()
  {
    const fs = getStore('actions documents', {
      'todos/1': { name: 'T1', done: false },
      'todos/2': { name: 'T2', done: true }
    })

    const store = new Vuex.Store({
      strict: true,
      state: {
        todo: new Todo()
      },
      mutations: {
        setTodo (state, getTodo) {
          state.todo = getTodo()
        },
        unfinishTodo (state, todo) {
          todo.done = false
          todo.$save()
        }
      },
      actions: {
        ...fieryActions({
          loadTodo ($fiery, commit, payload, context) {
            commit('setTodo', $fiery(fs.collection('todos').doc(payload), TodoOptions))
          }
        })
      }
    })

    expect(store.state.todo).to.be.ok
    expect(store.state.todo.name).to.equal('')

    store.dispatch('loadTodo', 1)

    expect(store.state.todo).to.be.ok
    expect(store.state.todo.name).to.equal('T1')

    const todo1 = store.state.todo

    store.dispatch('loadTodo', 2)

    expect(store.state.todo).to.be.ok
    expect(store.state.todo).to.not.equal(todo1)
    expect(store.state.todo.name).to.equal('T2')

    const todo2 = store.state.todo

    store.dispatch('loadTodo', 3)

    expect(store.state.todo).to.be.null

    store.dispatch('loadTodo', 2)

    expect(store.state.todo).to.be.ok
    expect(store.state.todo.name).to.equal('T2')

    fs.doc('todos/2').delete()

    expect(store.state.todo).to.be.undefined
  })

  it('collections', function()
  {
    const fs = getStore('actions collections', {
      'todos/1': { name: 'T1', done: false },
      'todos/2': { name: 'T2', done: true },
      'todos/3': { name: 'T3', done: false },
      'todos/4': { name: 'T4', done: true },
      'todos/5': { name: 'T5', done: true }
    })

    const store = new Vuex.Store({
      strict: true,
      state: {
        todos: [] as Todo[]
      },
      mutations: {
        setTodos (state, getTodos) {
          state.todos = getTodos()
        },
        unfinishTodo (state, todo) {
          todo.done = false
          todo.$save()
        }
      },
      actions: {
        ...fieryActions({
          updateTodos ($fiery, commit, payload, context) {
            commit('setTodos', $fiery(fs.collection('todos'), {
              extends: TodoOptions,
              query: q => q.orderBy('name').where('done', '==', payload.done)
            }))
          }
        })
      }
    })

    expect(store.state.todos).to.be.ok
    expect(store.state.todos.length).to.equal(0)

    store.dispatch('updateTodos', {done: true})

    expect(store.state.todos).to.be.ok
    expect(store.state.todos.length).to.equal(3)
    expect(store.state.todos[0].name).to.equal('T2')
    expect(store.state.todos[1].name).to.equal('T4')
    expect(store.state.todos[2].name).to.equal('T5')

    store.commit('unfinishTodo', store.state.todos[0])

    expect(store.state.todos.length).to.equal(2)
    expect(store.state.todos[0].name).to.equal('T4')
    expect(store.state.todos[1].name).to.equal('T5')

    fs.doc('todos/3').update({done: true})

    expect(store.state.todos.length).to.equal(3)
    expect(store.state.todos[0].name).to.equal('T3')
    expect(store.state.todos[1].name).to.equal('T4')
    expect(store.state.todos[2].name).to.equal('T5')

    const todos = store.state.todos

    store.dispatch('updateTodos', {done: false})

    expect(store.state.todos).to.equal(todos)
    expect(store.state.todos.length).to.equal(2)
    expect(store.state.todos[0].name).to.equal('T1')
    expect(store.state.todos[1].name).to.equal('T2')
  })

})
