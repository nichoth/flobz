const __dirname = path.dirname(new URL(import.meta.url).pathname);
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import path from 'path';
import pkg from 'htm/preact/index.js'
const { html } = pkg
const renderToString = require('preact-render-to-string');
import shell from './view/shell';
var mkdirp = require('mkdirp')
var hyperstream = require('hyperstream')
var fs = require('fs')
import router from './routes'

// Could make a router module that works as a static page generator also

var _routes = router.routes.map(obj => obj.src)

_routes.forEach(routePath => {
    var m = router.match(routePath)
    var { view, getContent } = m.action(m)
    // console.log('aaaaa', routePath)
    getContent().then(content => {
        var el = html`<${shell} active=${routePath}>
            <${view} content=${content} />
        <//>`

        var dirPath = path.join(__dirname + '/../public', routePath)
        console.log('dirpath', dirPath)
        var filePath = path.join(__dirname + '/../public', routePath,
            'index.html')
        console.log('filepath', filePath)
        mkdirp(dirPath).then(() => {
            var hs = hyperstream({
                '#content': {
                    _appendHtml: renderToString(el)
                }
            })

            var rs = fs.createReadStream(__dirname + '/index.html');
            var ws = fs.createWriteStream(filePath)
            rs.pipe(hs).pipe(ws)
        })

    })
})
