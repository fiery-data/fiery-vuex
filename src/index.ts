
import getInstance, { FierySource, FieryTarget, FieryOptionsInput } from 'fiery-data'

let Vue

export default {

  install (vue, options)
  {
    Vue = vue
  }
}

export function fieryActions(actions)
{
  const out = {}
  const nullers = {}
  const $fiery = getInstance({
    ...fierySettings,
    removeNamed (name: string) {
      if (name in nullers) {
        nullers[name]()
      }
    }
  })

  for (let actionName in actions)
  {
    out[actionName] = fieryAction($fiery, actionName, actions[actionName], (nuller) => nullers[actionName] = nuller)
  }

  return out
}

export function fieryAction($fiery, actionName, actionFactory, getNuller)
{
  let actionMutation: string
  let actionOptions: FieryOptionsInput
  let actionContext: any

  getNuller(() =>
  {
    if (actionContext && actionMutation)
    {
      actionContext.commit(actionMutation, () => null)
    }
  })

  return (context, payload) =>
  {
    actionContext = context

    let actionFiery = (source: FierySource, options: FieryOptionsInput): FieryTarget =>
    {
      actionOptions = {
        extends: options,
        onMutate: (mutator) => {
          if (actionMutation) {
            context.commit(actionMutation, mutator)
          } else {
            mutator()
          }
        }
      }

      return $fiery(source, actionOptions, actionName)
    }

    let actionCommit = (mutation: string, initial: FieryTarget) =>
    {
      context.commit(actionMutation = mutation, () => initial)
    }

    actionFactory(actionFiery, actionCommit, payload, context)
  }
}

export const fierySettings =
{
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
}
