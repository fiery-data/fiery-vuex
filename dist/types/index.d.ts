import { Mutation, MutationTree, Action, ActionTree } from 'vuex';
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
export declare type FieryBinding = (context: any, payload: any, fiery: FieryBindingFactory, commit: FieryCommit) => FieryTarget;
export declare type FieryBindings = {
    [action: string]: FieryBinding;
};
export declare type FieryState = <S>(fiery: FieryInstance) => S;
export declare type FieryCommit = <T extends FieryTarget>(mutation: string, target: T) => T;
declare const plugin: {
    $fiery: FieryInstance;
    install(_Vue: any, options: any): void;
};
export default plugin;
export declare function fieryDestroy(global?: boolean): FieryInstance;
export declare function fieryCreate(Vue: any): FieryInstance;
export declare function fieryState<S = any>(factory: FieryState): S;
export declare function fieryMapMutations<S = any>(mappings: FieryMutationMapping): MutationTree<S>;
export declare function fieryMutations<S = any>(mutations: FieryMutations): MutationTree<S>;
export declare function fieryMutation<S = any>(mutationFactory: FieryMutation): Mutation<S>;
export declare function fieryActions<S = any>(actions: FieryActions): ActionTree<S, S>;
export declare function fieryAction<S = any>(action: FieryAction): Action<S, S>;
export declare function fieryBindings<S = any>(actions: FieryBindings): ActionTree<S, S>;
export declare function fieryBinding<S = any>(action: string, actionFactory: FieryBinding): Action<S, S>;
