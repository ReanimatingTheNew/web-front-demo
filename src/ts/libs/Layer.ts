/// <reference path="../../d.ts/layer.d.ts" />

import layerUI = require('layer');

enum LayerType {
    Info,
    page,
    iframe,
    loading,
    tip
}

export interface Option {
    type : LayerType,
    title?: string,
    content?: string | string[],
    skin?: string,
    area?: string[],
    offset?: string,
    icon?: number,
    btn?: string | string[],
    btnAlign?: string,
    closeBtn?: string,
    time?: number,
    id?: string,
    anim?: number,
    isOutAnim?: boolean,
    fixed?: boolean,
    resize?: boolean,
    tips?: number | string[],
    scrollbar?: boolean,
    success?(objs: HTMLElement[], index: number): void,
    yes?(index?: number, elements?: HTMLElement[]): void,
    cancel?(index?: number, elements?: HTMLElement[]): void,
    btn2?(index?: number, elements?: HTMLElement[]): void,
    btn3?(index?: number, elements?: HTMLElement[]): void,
    end?(): void
}

export interface ButtonAction {
    yes(index?: number, elements?: HTMLElement[]): void,
    btn2?(index?: number, elements?: HTMLElement[]): void,
    btn3?(index?: number, elements?: HTMLElement[]): void,
    cancel?(index?: number, elements?: HTMLElement[]): void
}

export interface CallbackFunction {
    (index?: number, elements?: HTMLElement[]): void
}

export enum TipDirection {
    Top = 1,
    Right,
    Bottom,
    Left
}

export enum PromptInput {
    Text = 0,
    Password,
    Textarea
}

export interface PromptInputOption {
    maxlength?: number,
    area?: string[]
}

export interface PromptCallback {
    (value: string, index:number, elements?: HTMLElement[]): void;
}

export interface IframeOption {
    area: string[],
    scrollbar?: boolean
}

export class Layer {
    public static close(index: number): void {
        layerUI.close(index);
    }

    public static closeAll(): void {
        layerUI.closeAll();
    }

    public static dialogOK(title: string, content: string, button: string, callback?: CallbackFunction) {
        let opts: ButtonAction = {
            yes: (index: number) => {
                callback.call(this, index);
            }
        };
        this.dialog(title, content, [button], opts)
    }

    public static dialogOkCancel(title: string, content: string, buttons: string[], yesCallback?: CallbackFunction, cancelCallback?: CallbackFunction): number {
        let opts: ButtonAction = {
            yes: (index: number) => {
                yesCallback.call(this, index);
            },
            btn2: (index: number) => {
                cancelCallback.call(this, index);
            },
            cancel: (index: number) => {
                cancelCallback.call(this, index);
            }
        };
        return this.dialog(title, content, buttons, opts)
    }

    public static dialog(title: string, content: string, buttons?: string | string[], buttonActions?: ButtonAction): number {
        let opts = {
            type: LayerType.Info,
            title: title,
            content: content,
            btnAlign: 'c',
            btn: buttons
        };

        if (buttonActions) {
            for (let item in buttonActions) {
                opts[item] = buttonActions[item];
            }
        }
        return layerUI.open(opts);
    }

    public static msg(content: string, callback?: CallbackFunction, icon?: number): void {
        let opts = {
            icon: icon
        };
        layerUI.msg(content, opts, callback);
    }

    /**
     * 显示风格
     * @param icon 0~2
     * @param delay 最长等待时间(毫秒)
     * @returns {number}
     */
    public static load(icon?: number, delay?: number): number {
        return layerUI.load(icon, {time: delay, shade: 0})
    }

    public static tip(content: string, targetId: string, direction?: TipDirection): void {
        layerUI.tips(content, targetId, {
            tips: direction
        });
    }

    public static prompt(type: PromptInput, title: string, value: string, callback: PromptCallback, params?:PromptInputOption) {
        let opts = {
            formType: type,
            title: title,
            value: value
        };
        if (params) {
            for (let item in params) {
                opts[item] = params[item];
            }
        }
        layerUI.prompt(opts, callback);
    }

    public static iframe(title: string, url: string, params: IframeOption): number {
        let opts = {
            type: LayerType.iframe,
            title: title,
            content: url
        };
        if (params) {
            for (let item in params) {
                opts[item] = params[item];
            }
        }
        return layerUI.open(opts);
    }

    public static open(opts: Option): number {
        return layerUI.open(opts);
    }
}