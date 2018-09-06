import { FierySource, FieryTarget, FieryOptionsInput, FieryInstance } from 'fiery-data';
export * from 'fiery-data';
export declare type FieryMutation = (state: any, payload: any, Fiery: FieryInstance) => void;
export declare type FieryMutations = {
    [mutation: string]: FieryMutation;
};
export declare type FieryAction = (context: any, payload: any, Fiery: FieryInstance) => any;
export declare type FieryActions = {
    [action: string]: FieryAction;
};
export declare type FieryMutationMapping = {
    [mutation: string]: string;
};
export declare type FieryBindingFactory = <T extends FieryTarget>(source: FierySource, options: FieryOptionsInput, mutation: string) => T;
export declare type FieryBinding = (context: any, payload: any, fiery: FieryBindingFactory) => FieryTarget;
export declare type FieryBindings = {
    [action: string]: FieryBinding;
};
export declare type FieryState = (fiery: FieryInstance) => VuexState;
export declare type VuexMutation = (state: any, payload: any) => void;
export declare type VuexMutations = {
    [mutation: string]: VuexMutation;
};
export declare type VuexState = {
    [property: string]: any;
};
export declare type VuexAction = <T>(context: any, payload: any) => Promise<T> | T | any;
export declare type VuexActions = {
    [action: string]: VuexAction;
};
declare const _default: {
    install(Vue: any, options: any): void;
};
export default _default;
export declare function fieryState(factory: FieryState): VuexState;
export declare function fieryMapMutations(mappings: FieryMutationMapping): VuexMutations;
export declare function fieryMutations(mutations: FieryMutations): VuexMutations;
export declare function fieryMutation(mutationFactory: FieryMutation): VuexMutation;
export declare function fieryActions(actions: FieryActions): VuexActions;
export declare function fieryAction(action: FieryAction): VuexAction;
export declare function fieryBindings(actions: FieryBindings): VuexActions;
export declare function fieryBinding(action: string, actionFactory: FieryBinding): VuexAction;
