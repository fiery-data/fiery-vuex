
import Vuex from 'vuex'
import getInstance, { getOptions, FierySource, FieryTarget, FieryOptions, FieryOptionsInput, FieryInstance } from 'fiery-data'



export * from 'fiery-data'

export type FieryMutation = (state: any, payload: any, Fiery: FieryInstance) => void

export type FieryMutations = { [mutation: string]: FieryMutation }

export type FieryAction = (context: any, payload: any, Fiery: FieryInstance) => any

export type FieryActions = { [action: string]: FieryAction }

export type FieryMutationMapping = { [mutation: string]: string }

export type FieryBindingFactory = <T extends FieryTarget>(source: FierySource, options: FieryOptionsInput, mutation: string) => T

export type FieryBinding = (context: any, payload: any, fiery: FieryBindingFactory) => FieryTarget

export type FieryBindings = { [action: string]: FieryBinding }



let $fiery: FieryInstance

export default {

  install (Vue, options)
  {
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

export function fieryMapMutations(mappings: FieryMutationMapping)
{
  const out = {}

  assertObject(mappings, 'fieryMapMutations can only be passed an object')

  for (let mutation in mappings)
  {
    const property = mappings[mutation]

    assertString(property, 'fieryMapMutations can only have properties that are strings')

    out[mutation] = (state, mutator) => {
      state[property] = mutator()
    }
  }

  return out
}

export function fieryMutations(mutations: FieryMutations)
{
  const out = {}

  assertObject(mutations, 'fieryMutations can only be passed an object')

  for (let mutationName in mutations)
  {
    out[mutationName] = fieryMutation(mutations[mutationName])
  }

  return out
}

export function fieryMutation(mutationFactory: FieryMutation)
{
  assertFunction(mutationFactory, 'fieryMutation can only be passed a function which accepts (state, payload, $fiery)')

  return (state: any, payload: any) =>
  {
    mutationFactory(state, payload, $fiery)
  }
}

export function fieryActions(actions: FieryActions)
{
  const out = {}

  assertObject(actions, 'fieryActions can only be passed an object')

  for (let action in actions)
  {
    out[action] = fieryAction(actions[action])
  }

  return out
}

export function fieryAction(action: FieryAction)
{
  assertFunction(action, 'fieryAction can only be passed a function which accepts (context, payload, $fiery)')

  return (context: any, payload: any) =>
  {
    return action(context, payload, $fiery)
  }
}

export function fieryBindings(actions: FieryBindings)
{
  const out = {}

  for (let action in actions)
  {
    out[action] = fieryBinding(action, actions[action])
  }

  return out
}

export function fieryBinding(action: string, actionFactory: FieryBinding)
{
  assertString(action, 'fieryBinding must be passed the action name as the first argument')
  assertFunction(actionFactory, 'fieryBinding can only be passed a function which accepts (context, payload, $fiery)')

  return function(context: any, payload: any)
  {
    const store: any = this
    let initialized: boolean = false
    let actionMutation: string = ''
    let actionOptions: FieryOptionsInput

    const actionFiery: FieryBindingFactory = (source, options, mutation) =>
    {
      const parsedOptions = options
        ? getOptions(options)
        : undefined

      actionMutation = mutation
      actionOptions = {
        extends: parsedOptions,
        sub: injectSubMutation(store, parsedOptions),
        onMutate: (mutator) => {
          context.commit(mutation, mutator)
          initialized = true
        }
      }

      assertString(mutation, 'fieryBinding must be passed the mutation as the third argument to $fiery')

      return $fiery(source, actionOptions, action)
    }

    const initial = actionFactory(context, payload, actionFiery)

    if (!initialized && actionMutation)
    {
      context.commit(actionMutation, () => initial)
    }

    const entry = $fiery.entryFor(action)

    return entry && entry.promise ? entry.promise : Promise.resolve(initial)
  }
}

function injectSubMutation (store: any, options?: FieryOptions): any
{
  if (options && options.sub)
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

function assertObject(x: any, message: string)
{
  assert(x !== null && typeof x === 'object', message)
}

function assertFunction(x: any, message: string)
{
  assert(typeof x === 'function', message)
}

function assertString(x: any, message: string)
{
  assert(typeof x === 'string', message)
}

function assert(x: boolean, message: string)
{
  if (!x) throw message
}
