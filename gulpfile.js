let gulp = require('gulp'),
    minifyCss = require('gulp-clean-css'),
    less = require('gulp-less'),
    cssSprite = require('gulp.spritesmith'),
    rev = require('gulp-rev'),
    through = require('through2'),
    typescript = require('gulp-typescript'),
    concatJs = require('gulp-concat'),
    uglifyJs = require('gulp-uglify'),
    fs = require('fs'),
    clean = require('gulp-clean'),
    tpl = require('gulp-tmod'),
    ejs = require('ejs'),
    os = require('os'),
    path = require('path'),
    exec = require('child_process').exec;

let projectConfig = {
    devRootDir: 'dev/',    //开发环境根目录
    distRootDir: 'dist/',   //线上环境目录,

    assetSrc: 'assets/**/*',  //静态文件目录
    devAsset: 'dev/assets/',   //静态文件目录(发开环境)
    distAsset: 'dist/assets/',  //静态文件目录(线上环境)
    devImageDst: 'dev/assets/images/',  //图片静态文件目录(发开环境)

    lessFileSrc: 'src/less/',   //less源文件目录
    lessFileSrcFiles: 'src/less/style.less',   //需要编译为css的less源文件
    cssFileDst: 'dev/assets/css/',  //生成css的文件目录

    cssIconSrc: 'src/images/icons/*.png', //需要生成sprite的icon文件目录

    tsFileSrc: 'src/ts/', //typescript源文件目录
    jsFileSrc: 'src/js/**/*.js', //js源文件目录
    jsFileDst: 'dev/assets/js/',   //生成js的文件目录

    tplFileBase: 'src/tpl', //模板文件根目录
    tplFileSrc: 'src/tpl/**/*.html', //模板目录

    pageRoot: 'src/pages/', //需要处理layout、include等html文件根目录
    pageSrc: ['src/pages/**/*.html', '!src/pages/layout/*'], //需要处理layout、include等html文件目录

    publishCssSrc: 'dev/assets/css/*.css',    //css源文件目录
    publishCssDst: 'dist/assets/css',  //压缩后的css文件目录
    publishJsSrc: 'dev/assets/js/**/*.js', //js源文件目录
    publishJsDst: 'dist/assets/js/',   //压缩后的js文件目录
    publishJsDstName: 'main.js', //压缩、合并后js文件名

    htmlSrc: 'dev/**/*.html', //html源文件目录
    tmpDir: ['dist/', 'dev/'],  //临时文件夹

    watchTsDir: 'src/ts/**/*.ts', //监听的typescript目录
    watchLessDir: 'src/less/*.less' //监听的less目录
};

//生成css sprite
gulp.task('cssSprite', function () {
    let obj= gulp.src(projectConfig.cssIconSrc)
        .pipe(cssSprite({
            algorithm: 'binary-tree',
            padding: 1,
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        }));

    obj.img.pipe(gulp.dest(projectConfig.devImageDst));
    obj.css.pipe(fixSpritePath());
    return obj;
});

//less生成css
gulp.task('less', () => {
    return gulp.src(projectConfig.lessFileSrcFiles)
        .pipe(less())
        .pipe(gulp.dest(projectConfig.cssFileDst));
});

//typescript生成javascript (requirejs加载器)
gulp.task('typescript', () => {
    let tsConfig = typescript.createProject('tsconfig.json');
    return tsConfig.src()
        .pipe(tsConfig())
        .js
        .pipe(fixRequirejs())
        .pipe(gulp.dest(projectConfig.jsFileDst));
});

//将js文件复制到开发环境目录
gulp.task('js', () => {
    return gulp.src(projectConfig.jsFileSrc)
        .pipe(gulp.dest(projectConfig.jsFileDst));
});

//发布css: 压缩css
gulp.task('publishCss', () => {
    return gulp.src(projectConfig.publishCssSrc)
        .pipe(minifyCss())
        .pipe(gulp.dest(projectConfig.publishCssDst));
});

//发布js: 合并/压缩javascript
gulp.task('publishJs', [], () => {
    return gulp.src(projectConfig.publishJsSrc)
        .pipe(fixTemplate())
        .pipe(concatJs(projectConfig.publishJsDstName))
        .pipe(uglifyJs())
        .pipe(gulp.dest(projectConfig.publishJsDst));
});

//生成js/css添加hash值
gulp.task('hashJsCss', ['copyAssetDist', 'publishCss', 'publishJs'], () => {
    return gulp.src([projectConfig.publishCssDst +'/*.css', projectConfig.publishJsDst +'/*.js'])
        .pipe(rev())
        .pipe(rev.manifest({path:'manifest.json'}))
        .pipe(fixHash())
        .pipe(gulp.dest(projectConfig.distRootDir));
});

//将html文件中的js/css文件添加时间戳(单css/js文件)
gulp.task('publishHtml', ['hashJsCss'], () => {
    return gulp.src(projectConfig.htmlSrc)
        .pipe(replaceHash())
        .pipe(gulp.dest(projectConfig.distRootDir));
});

//拷贝静态文件(发开环境)
gulp.task('copyAssetDev', () => {
    return gulp.src(projectConfig.assetSrc)
        .pipe(gulp.dest(projectConfig.devAsset));
});

//拷贝静态文件(线上环境)
gulp.task('copyAssetDist', ['copyCssSpriteDist'], () => {
    return gulp.src(projectConfig.assetSrc)
        .pipe(gulp.dest(projectConfig.distAsset));
});

//拷贝css sprite(线上环境),
gulp.task('copyCssSpriteDist', () => {
    return gulp.src(projectConfig.devImageDst +'sprite.png')
        .pipe(gulp.dest(projectConfig.distAsset +'images/'));
});

//生成模板 (arttemplate)
gulp.task('tpl', () => {
    gulp.src(projectConfig.tplFileSrc)
        .pipe(tpl({templateBase: projectConfig.tplFileBase, escape: false, runtime: 'template.js'}))
        .pipe(gulp.dest(projectConfig.jsFileDst))
});

//处理HTML的layout
gulp.task('page', () => {
    return gulp.src(projectConfig.pageSrc)
        .pipe(fixPage())
        .pipe(gulp.dest(projectConfig.devRootDir));
});

//清除临行文件/夹
gulp.task('clean', () => {
    return gulp.src([projectConfig.devRootDir, projectConfig.distRootDir])
        .pipe(clean());
});

//发布项目: 开发环境
gulp.task('publishDev', ['clean'], () => {
    let lang = process.env.lang;
    if (!lang) {
        process.env.lang = 'cn';
    }

    exec('gulp cssSprite');
    setTimeout(() => {
        exec('gulp less typescript tpl page copyAssetDev');
    }, 3000);
});

//发布项目: 开发环境(中文)
gulp.task('publishDevCn', () => {
    process.env.lang = 'cn';
    exec('gulp publishDev')
});

//发布项目: 开发环境(英文)
gulp.task('publishDevEn', () => {
    process.env.lang = 'en';
    exec('gulp publishDev')
});

//发布项目: 线上环境
gulp.task('publish', ['publishDev'], () => {
    exec('gulp publishCn');
});

//发布项目: 线上环境(中文)
gulp.task('publishCn', ['publishDevCn'], () => {
    setTimeout(() => {
        exec('gulp publishHtml');
    }, 8000);
});

//发布项目: 线上环境(英文)
gulp.task('publishEn', ['publishDevEn'], () => {
    setTimeout(() => {
        exec('gulp publishHtml');
    }, 8000);
});

//监听开发环境
gulp.task('watch', () =>{
    let lang = process.env.lang;
    if (!lang) {
        process.env.lang = 'cn';
    }

    gulp.watch(projectConfig.watchTsDir, ['typescript']);
    //gulp.watch(projectConfig.jsFileSrc, ['js']);    //与typescript二选一
    gulp.watch(projectConfig.cssIconSrc, ['cssSprite']);
    gulp.watch(projectConfig.watchLessDir, ['less']);
    gulp.watch(projectConfig.tplFileSrc, ['tpl']);
    gulp.watch(projectConfig.pageSrc, ['page']);
    gulp.watch(projectConfig.assetSrc, ['copyAssetDev']);
});

gulp.task('watchCn', () =>{
    process.env.lang = 'cn';
    exec('gulp watch');
});

gulp.task('watchEn', () =>{
    process.env.lang = 'en';
    exec('gulp watch');
});

//修正requirejs打包，添加模块名称， window与linux目录不同，需要在window下测试
function fixRequirejs() {
    return through.obj(function (file, enc, cb) {
        let filename = file.path.replace(file.base.replace(/\\/g, '\/'), '').replace('.js', '');
        let str = file.contents.toString().replace('define(', 'define("'+ filename +'",');
        file.contents = new Buffer(str);
        return cb(null, file);
    });
}

//将类style-b47bb72002.css修改为style.css?v=b47bb72002
function fixHash() {
    return through.obj(function (file, enc, cb) {
        let reg = new RegExp('(.*)-([0-9a-z]+).([a-z]+)');
        let settings = JSON.parse(file.contents.toString());
        Object.keys(settings).forEach((key) => {
            settings[key] = settings[key].replace(reg, '$1.$3?v=$2');
        });
        file.contents = new Buffer(JSON.stringify(settings).toString());
        return cb(null, file);
    });
}

//将html中的js/css的引用添加hash值
function replaceHash() {
    let filename = projectConfig.distRootDir +'manifest.json';
    let settings = JSON.parse(fs.readFileSync(filename));
    fs.unlink(filename);

    return through.obj(function (file, enc, cb) {
        let str = file.contents.toString();
        Object.keys(settings).forEach(function (key) {
            str = str.replace(key, settings[key]);
        });
        file.contents = new Buffer(str);
        return cb(null, file);
    });
}

//修正css sprite中sprite图片的路径并保存到less目录
function fixSpritePath() {
    return through.obj(function (file, enc, cb) {
        let str = file.contents.toString();
        str = str.replace(/sprite.png/g, '../images/sprite.png');
        file.contents = new Buffer(str);

        fs.writeFileSync(projectConfig.lessFileSrc + 'sprite.less', file.contents);
        return cb(null, file);
    });
}

//处理layout、include等html文件
function fixPage() {
    return through.obj(function (file, enc, cb) {
        let str = handlePage(file.path);
        file.contents = new Buffer(str);
        return cb(null, file);
    });
}

//读取文件内容
function getContent(filename) {
    return fs.readFileSync(filename).toString().trim();
}

//处理模板/layout文件
function handlePage(filename) {
    let pageContent = getContent(filename);

    //检测是否含有extends
    let rs = pageContent.match(/{\s*extends\s*['"](.*)['"]\s*}/);
    if (rs != null) {
        let layout = getContent(projectConfig.pageRoot + rs[1] +'.html');

        //找出所有的block的块
        let reg = /{\s*block\s*['"](.*)['"]\s*}([\s\S]*?){\s*\/block\s*}/g;
        let blocks = pageContent.match(reg);

        if (blocks != null) {
            blocks.forEach((val, key) => {
                let item = val.match(/{\s*block\s*['"](.*)['"]\s*}([\s\S]*){\s*\/block\s*}/);
                if (item != null) {
                    let blockName = item[1].trim(),
                        blockContent = item[2].trim();

                    //替换layout中的block
                    let reg = new RegExp("{\\s*block\\s*['\"]"+ blockName +"['\"]\\s*}([\\s\\S]*?){\\s*\/block\\s*}");
                    layout = layout.replace(reg, blockContent);
                }
            });

            //未被替换的block，使用默认内容
            layout = layout.replace(/{\s*block\s*['"](.*)['"]\s*}/g, '');
            pageContent = layout.replace(/{\s*\/block\s*}/g, '');
        }

        //替换include
        let parts = pageContent.match(/{\s*include\s*['"](.*)['"]\s*}/g);

        if (parts != null) {
            parts.forEach((val, key) => {
                let item = val.match(/{\s*include\s*['"](.*)['"]\s*}/);
                if (item != null) {
                    let filename = item[1],
                        ext = path.extname(filename);
                    if (ext == '') {
                        filename += '.html';
                    }
                    let content = getContent(projectConfig.pageRoot + filename);

                    //替换include的内容
                    let reg = new RegExp("{\\s*include\s* ['\"]"+ filename +"['\"]\\s*}");
                    pageContent = pageContent.replace(reg, content);
                }
            });
        }
    }

    return ejs.render(pageContent).trim();
}

//修正arttemplate，添加模块名称
function fixTemplate() {
    return through.obj(function (file, enc, cb) {
        if (file.path.replace(file.base, '') == 'template.js') {
            let str = file.contents.toString();
            str = str.replace('define(function() {return template;})', 'define("template",function() {return template;})');
            file.contents = new Buffer(str);
        }
        return cb(null, file);
    });
}
