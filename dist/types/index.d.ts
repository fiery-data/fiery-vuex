declare const _default: {
    install(vue: any, options: any): void;
};
export default _default;
export declare function fieryActions(actions: any): {};
export declare function fieryAction($fiery: any, actionName: any, actionFactory: any, getNuller: any): (context: any, payload: any) => void;
export declare const fierySettings: {
    setProperty: (target: any, property: string, value: any) => void;
    removeProperty: (target: any, property: string) => void;
    arraySet: (target: any[], index: number, value: any) => void;
    arrayResize: (target: any[], size: number) => void;
};
