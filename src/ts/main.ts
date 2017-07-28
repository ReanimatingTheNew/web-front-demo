/// <reference path='../d.ts/requirejs.d.ts' />

requirejs.config({
    baseUrl: '/assets/js/',
    paths: {
        jquery: '/assets/libs/jquery/jquery',
        layer: '/assets/libs/layer/layer'
    }
});

requirejs(['app', 'layer'], (app, layer) => {
    layer.config({
        path: '/assets/libs/layer/'
    });

    (new app.App()).start();
});