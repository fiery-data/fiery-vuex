
import Vuex from 'vuex'

import { getInstance, getOptions, FierySource, FieryTarget, FieryOptions, FieryOptionsMap, FieryOptionsInput, FieryInstance } from 'fiery-data'



export * from 'fiery-data'

export type FieryMutation = (state: any, payload: any, Fiery: FieryInstance) => void

export type FieryMutations = { [mutation: string]: FieryMutation }

export type FieryAction = (context: any, payload: any, Fiery: FieryInstance) => any

export type FieryActions = { [action: string]: FieryAction }

export type FieryMutationMapping = { [mutation: string]: string }

export type FieryBindingFactory = <T extends FieryTarget>(source: FierySource, options: FieryOptionsInput, mutation: string) => T

export type FieryBinding = (context: any, payload: any, fiery: FieryBindingFactory, commit: FieryCommit) => FieryTarget

export type FieryBindings = { [action: string]: FieryBinding }

export type FieryState = (fiery: FieryInstance) => VuexState

export type FieryCommit = <T extends FieryTarget>(mutation: string, target: T) => T



export type VuexMutation = (state: any, payload: any) => void

export type VuexMutations = { [mutation: string]: VuexMutation }

export type VuexState = { [property: string]: any }

export type VuexAction = <T>(context: any, payload: any) => Promise<T> | T | any

export type VuexActions = { [action: string]: VuexAction }



let $fiery: FieryInstance

let $strict: boolean = false

export default {

  install (Vue, options)
  {
    $strict = !!(options && options.strict)
    $fiery = getInstance({
      setProperty: (target: any, property: string, value: any) =>
      {
        Vue.set(target, property, value)
      },
      removeProperty: (target: any, property: string) =>
      {
        Vue.delete(target, property)
      },
      arraySet: (target: any[], index: number, value: any) =>
      {
        if (target[index] !== value)
        {
          target.splice(index, 1, value)
        }
      },
      arrayResize: (target: any[], size: number) =>
      {
        if (target.length > size)
        {
          target.splice(size, target.length - size)
        }
        else if (target.length < size)
        {
          target.length = size
        }
      }
    })

    this.$fiery = $fiery
  }
}

export function fieryState(factory: FieryState): VuexState
{
  /*
  // maybe one day when function states have this = Store we can do this
  const bind: FieryBindingFactory = (source, options, mutation) =>
  {
    const parsedOptions = options ? getOptions(options) : undefined
    const mutateOptions = {
      extends: parsedOptions,
      sub: injectSubMutation(store, parsedOptions),
      onMutate: (mutator) => {
        if (mutation) {
          store.commit(mutation, mutator)
        } else {
          store._withCommit(mutator)
        }
      }
    }

    return $fiery(source, mutateOptions, mutation)
  }
  */

  return factory($fiery)
}

export function fieryMapMutations(mappings: FieryMutationMapping): VuexMutations
{
  const out = {}

  assertObject(mappings, 'fieryMapMutations can only be passed an object')

  for (let mutation in mappings)
  {
    const property = mappings[mutation]

    assertString(property, 'fieryMapMutations can only have properties that are strings')

    out[mutation] = (state, mutator) =>
    {
      state[property] = mutator()
    }
  }

  return out
}

export function fieryMutations(mutations: FieryMutations): VuexMutations
{
  const out = {}

  assertObject(mutations, 'fieryMutations can only be passed an object')

  for (let mutationName in mutations)
  {
    out[mutationName] = fieryMutation(mutations[mutationName])
  }

  return out
}

export function fieryMutation(mutationFactory: FieryMutation): VuexMutation
{
  assertFunction(mutationFactory, 'fieryMutation can only be passed a function which accepts (state, payload, $fiery)')

  return (state, payload) =>
  {
    mutationFactory(state, payload, $fiery)
  }
}

export function fieryActions(actions: FieryActions): VuexActions
{
  const out = {}

  assertObject(actions, 'fieryActions can only be passed an object')

  for (let action in actions)
  {
    out[action] = fieryAction(actions[action])
  }

  return out
}

export function fieryAction(action: FieryAction): VuexAction
{
  assertFunction(action, 'fieryAction can only be passed a function which accepts (context, payload, $fiery)')

  return (context, payload) =>
  {
    return action(context, payload, $fiery)
  }
}

export function fieryBindings(actions: FieryBindings): VuexActions
{
  const out = {}

  for (let action in actions)
  {
    out[action] = fieryBinding(action, actions[action])
  }

  return out
}

export function fieryBinding(action: string, actionFactory: FieryBinding): VuexAction
{
  assertString(action, 'fieryBinding must be passed the action name as the first argument')
  assertFunction(actionFactory, 'fieryBinding can only be passed a function which accepts (context, payload, $fiery)')

  return function(context, payload)
  {
    const store: any = this
    let initialized: boolean = false
    let actionMutation: string = ''
    let actionOptions: FieryOptionsInput

    const actionFiery: FieryBindingFactory = (source, options, mutation) =>
    {
      const parsedOptions = options ? getOptions(options) : undefined

      if (mutation) {
        actionMutation = mutation
      }

      actionOptions = {
        extends: parsedOptions,
        sub: injectSubMutation(store, parsedOptions),
        onMutate: (mutator) => {
          if (actionMutation) {
            context.commit(actionMutation, mutator)
            initialized = true
          } else {
            mutator()
          }
        }
      }

      return $fiery(source, actionOptions, action)
    }

    const actionCommit: FieryCommit = (mutation, target) =>
    {
      actionMutation = mutation

      return target
    }

    const initial = actionFactory(context, payload, actionFiery, actionCommit)

    assertString(actionMutation, 'fieryBinding must be passed the mutation through $fiery or commit')

    if (!initialized)
    {
      context.commit(actionMutation, () => initial)
    }

    const entry = $fiery.entryFor(action)

    return entry && entry.promise ? entry.promise : Promise.resolve(initial)
  }
}

function injectSubMutation (store: any, options?: FieryOptions): FieryOptionsMap | undefined
{
  if (options && options.sub && $strict)
  {
    const subs = options.sub
    const out = {}

    for (var sub in subs)
    {
      const subOptions = subs[sub]

      out[sub] = {
        extends: subOptions,
        sub: injectSubMutation(store, subOptions as FieryOptions),
        onMutate: (mutator) => {
          store._withCommit(mutator)
        }
      }
    }

    return out
  }
}

function assertObject(x: any, message: string): void
{
  assert(x !== null && typeof x === 'object', message)
}

function assertFunction(x: any, message: string): void
{
  assert(typeof x === 'function', message)
}

function assertString(x: any, message: string): void
{
  assert(typeof x === 'string', message)
}

function assert(x: boolean, message: string): void
{
  if (!x) throw message
}
