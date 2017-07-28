declare module "layerMobile" {
    var mod: {
        close: (index: number) => void;
        closeAll: () => void;
        open: (option: any) => number;
    }
    export = mod;
}