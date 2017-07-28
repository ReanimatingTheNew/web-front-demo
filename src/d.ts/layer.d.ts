declare module "layer" {
    var mod: {
        config: (data: {}) => number;
        close: (index: number) => void;
        closeAll: () => void;
        open: (option: any) => number;

        msg: (content: string, opts?: {}, callback?: any) => void;
        load: (icon: number, opts?: {}) => number;
        tips: (content: string, targetId: string, opts?: {}) => number;
        prompt: (opts: {}, callback: (value: string, index: number, elements?: HTMLElement[]) => void) => number;

        tab: (option: any) => number;
    };
    export = mod;
}