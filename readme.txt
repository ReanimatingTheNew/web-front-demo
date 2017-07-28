一个简单的WEB前端构建框架，基于gulp。
可编译typescript、less，使用tmod编译arttemplate模板，实现html的layout功能，添加css/js引用hash等，AMD(requirejs)加载合并等。


一、使用说明

step 1. 安装nodejs

step 2.安装所有依赖
    npm install

step 3. 开发环境使用
    1. 如果没有使用IDE生成css、js等功能，则需要监听开发环境，less生成css、typescript生成javascriptt等
    gulp watch

step 4. 发布项目
    1. 在项目根目录运行：
        gulp publish
    2. 将dist目录所有文件发布到测试或线上环境

step 5. 本地调试
    设置两个虚拟主机目录，分别映射到dev与dist目录

二、模块使用说明
    1. layout使用
        使用`{ block 'body' } ... { /block }`标记html区域，这里的"body"可以是任何字符。
        子模板继承使用extends标签，使用block替换父模板的内容，任何在{block}以外的内容都会被自动忽略。
        子/父模板中可以使用include标签包含模板，不支持多级include。
        详情使用，请查看示例。
    2. 模板中使用变量
        ejs模板语法
    3. css sprite使用
        将所有icon图片保存在src/images/icons/目录中，运行"gulp cssSprite"，将生成sprite.less与sprite.png，
        sprite.less使用“.icon-{文件名}”的方式命名

附：
step 1. 初始化项目
	npm init

step 2. 安装本地gulp
	npm install --save-dev gulp

step 3. 项目依赖说明：
	npm install	--save-dev plugin-name

	一、css
	    1. less生成css
	    npm install --save-dev gulp-less
	    2. css压缩
	    npm install --save-dev gulp-clean-css
	    3. css hash值计算
	    npm install --save-dev gulp-rev
	    4. 生成sprite图
	    npm install --save-dev gulp.spritesmith

    二、javascript
        1. typescript生成javascript (requirejs加载器)
        npm install --save-dev gulp-typescript typescript
        2. 合并javascript
        npm install --save-dev gulp-concat
        3. 压缩javascript
        npm install --save-dev gulp-uglify

    三、删除文件/夹
        1.删除临时文件/夹
        npm install --save-dev gulp-clean

    四、template
        1. 安装tmodjs
        npm install --save-dev gulp-tmod
        2. 安装ejs
        npm install -save-dev ejs

