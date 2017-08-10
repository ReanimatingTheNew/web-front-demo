let langs = [];

langs['en'] = {
    'title': 'english',
    'path': 'en',
    'navs': [
        {'link': 'page/1.html', 'name': 'nav1'},
        {'link': 'page/2.html', 'name': 'nav2'},
        {'link': 'page/3.html', 'name': 'nav3'}
    ],
};

langs['cn'] = {
    'title': 'chinese',
    'path': 'cn',
    'navs': [
        {'link': 'page/1.html', 'name': '导航1'},
        {'link': 'page/2.html', 'name': '导航1'},
        {'link': 'page/3.html', 'name': '导航1'}
    ],
};

const LANG = process.env.lang;