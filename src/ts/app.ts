/// <reference path="../d.ts/template.d.ts" />
/// <reference path="../d.ts/jquery.d.ts" />

import $ = require('jquery');
import tpl = require('template');
import cfg = require('config');
import layer = require('libs/Layer');
import http = require('libs/Http')

export class App {
    public start(): void {
        this.initDialog();

        this.initAjax();

        this.initTpl();
    }

    private initDialog(): void {
        $('#btn11').click(() => {
            layer.Layer.dialog('Demo', '默认对话框');
        });

        $('#btn12').click(() => {
            layer.Layer.dialogOK('Demo', 'OK', '确定', (index: number) => {
                console.info('OK')
                layer.Layer.close(index);
            });
        });

        $('#btn13').click(() => {
            layer.Layer.dialogOkCancel('Demo', '[OK, Cancel]', ['确定', '取消'], (index: number) => {
                console.info('OK');
                layer.Layer.close(index);
            }, () => {
                console.info('Cancel');
            });
        });

        $('#btn14').click(() => {
            let btns: string[] = ['btn1', 'btn2', 'btn3'];
            let btnActions: layer.ButtonAction = {
                yes: (index: number) => {
                    console.info('btn1');
                    layer.Layer.close(index);
                },
                btn2: (index: number) => {
                    console.info('btn2');
                },
                btn3: (index: number) => {
                    console.info('btn3');
                },
                cancel: (index: number) => {
                    console.info('cancel');
                }
            };
            layer.Layer.dialog('Demo', '复杂按钮', btns, btnActions);
        });

        $('#btn21').click(() => {
            layer.Layer.msg('Yes, You done!');
        });

        $('#btn22').click(() => {
            //layer.Layer.msg('Yes, You done!');
            layer.Layer.msg('Yes, You done!', () => {
                console.info('hidden');
            }, 3);
        });

        $('#btn31').click(() => {
            layer.Layer.load();
        });

        $('#btn32').click(() => {
            layer.Layer.load(1, 5000);
        });

        $('#btn41').click(() => {
            layer.Layer.tip('show tip', '#btn41', layer.TipDirection.Left);
        });

        $('#btn51').click(() => {
            layer.Layer.prompt(layer.PromptInput.Textarea, 'Demo', 'default value', (value: string, index: number, elements: HTMLElement[]) => {
                console.info(value);
                layer.Layer.close(index);
            }, {
                maxlength: 10,
                area: ['300px', '300px']
            });
        });

        $('#btn61').click(() => {
            let opts: layer.IframeOption = {
                area: ['300px', '300px']
            };
            layer.Layer.iframe('Demo', 'http://easyar.cn', opts);
        });
    }

    private initAjax(): void {
        let host = 'http://t.cn/http.php';

        $('#btnAjax-1').click(() => {
            let params = {
                name: 'Tom',
                age: 10
            };

            http.Http.get(host, params, (data) => {
                console.info('success');
                console.info(data);
            }, (jqXHR) => {
                console.info('error');
                console.info(jqXHR);
            })
        });

        $('#btnAjax-2').click(() => {
            let params = {
                name: 'Tom',
                age: 10
            };

            http.Http.post(host, params, (data) => {
                console.info('success');
                console.info(data);
            }, (jqXHR) => {
                console.info('error');
                console.info(jqXHR);
            })
        });

        $('#btnAjax-3').click(() => {
            let params = {
                name: 'Tom',
                age: 10
            };
            let data = JSON.stringify(params);

            http.Http.put(host, data, (data) => {
                console.info('success');
                console.info(data);
            }, (jqXHR) => {
                console.info('error');
                console.info(jqXHR);
            })
        });

        $('#btnAjax-4').click(() => {
            let params = {
                name: 'Tom',
                age: 10
            };

            http.Http.delete(host, params, (data) => {
                console.info('success');
                console.info(data);
            }, (jqXHR) => {
                console.info('error');
                console.info(jqXHR);
            })
        });

        $('#btnAjax-file').change((e: any) => {
            let fd = new FormData();
            fd.append('name', 'Tom');
            fd.append('age', '10');
            fd.append('postFile', '1');
            //fd.append('file', e.target.files[0]);

            for (let i = 0, len = e.target.files.length; i < len; i++) {
                fd.append('file['+ i.toString() +']', e.target.files[i]);
            }

            http.Http.postFile(host, fd, (data) => {
                console.info('success');
                console.info(data);
            }, (jqXHR) => {
                console.info('error');
                console.info(jqXHR);
            })
        });
        $('#btnAjax-5').click(() => {
            $('#btnAjax-file').click();
        });
    }

    private initTpl(): void {
        $('#btnTpl-1').click(() => {
            let params = {
                username: '请输入用户名',
                password: '请输入密码'
            };
            let str = tpl('login', params);
            $('#tplShow').html(str);
        });
    }
}