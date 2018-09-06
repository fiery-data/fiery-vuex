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
declare const _default: {
    install(Vue: any, options: any): void;
};
export default _default;
export declare function fieryMapMutations(mappings: FieryMutationMapping): {};
export declare function fieryMutations(mutations: FieryMutations): {};
export declare function fieryMutation(mutationFactory: FieryMutation): (state: any, payload: any) => void;
export declare function fieryActions(actions: FieryActions): {};
export declare function fieryAction(action: FieryAction): (context: any, payload: any) => any;
export declare function fieryBindings(actions: FieryBindings): {};
export declare function fieryBinding(action: string, actionFactory: FieryBinding): (context: any, payload: any) => Promise<FieryTarget>;
