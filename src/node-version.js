import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import pkg from 'htm/preact';
const { html } = pkg;
const renderToString = require('preact-render-to-string');
import shell from './view/shell';
var mkdirp = require('mkdirp')
var hyperstream = require('hyperstream')
var fs = require('fs')
import router from './routes'

// Could make a router module that works as a static page generator also

// @TODO
// write the link hrefs to a json file
// @TODO -- should create files based on the CMS source files, not the routes
// in the router



fs.readdir(__dirname + '/../public/_posts/blog', (err, files) => {
    if (err) return console.log('errrr', err)
    files.forEach(fileName => {
        console.log('name', path.basename(fileName))
        var m = router.match('/posts/' + path.basename(fileName, '.md'))
        var { view, getContent } = m.action(m)

        getContent().then(content => {
            var el = html`<${shell} active=${path.basename(fileName, '.md')}>
                <${view} content=${content} />
            <//>`

            console.log('file name', fileName, path.basename(fileName, '.md'))

            var dirPath = path.join(__dirname + '/../public/posts',
                path.basename(fileName, '.md'))
            var indexPath = path.join(__dirname + '/../public/posts',
                path.basename(fileName, '.md'), 'index.html')

            mkdirp(dirPath).then(() => {
                var hs = hyperstream({
                    '#content': {
                        _appendHtml: renderToString(el)
                    }
                })

                var rs = fs.createReadStream(__dirname + '/index.html');
                var ws = fs.createWriteStream(indexPath)
                rs.pipe(hs).pipe(ws)
            })
        })
    })
})




// var _routes = router.routes.map(obj => obj.src)
// _routes.forEach(routePath => {
//     var m = router.match(routePath)
//     var { view, getContent } = m.action(m)
//     // console.log('aaaaa', routePath)
//     getContent().then(content => {
//         var el = html`<${shell} active=${routePath}>
//             <${view} content=${content} />
//         <//>`

//         var dirPath = path.join(__dirname + '/../public', routePath)
//         console.log('dirpath', dirPath)
//         var filePath = path.join(__dirname + '/../public', routePath,
//             'index.html')
//         console.log('filepath', filePath)
//         mkdirp(dirPath).then(() => {
//             var hs = hyperstream({
//                 '#content': {
//                     _appendHtml: renderToString(el)
//                 }
//             })

//             var rs = fs.createReadStream(__dirname + '/index.html');
//             var ws = fs.createWriteStream(filePath)
//             rs.pipe(hs).pipe(ws)
//         })

//     })
// })
