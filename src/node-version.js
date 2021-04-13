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




fs.readdir(__dirname + '/../public/_posts/blog', (err, files) => {
    if (err) return console.log('errrr', err)

    console.log('files', files)


    // write a list of routes
    var _files = files.map(file => path.basename(file, '.md'))
    fs.writeFileSync(__dirname + '/links.json', JSON.stringify(_files))



    files.forEach(fileName => {
        console.log('name', path.basename(fileName))
        var m = router.match('/posts/' + path.basename(fileName, '.md'))
        var { view, getContent } = m.action(m)

        getContent().then(content => {
            var el = html`<${shell} active=${path.basename(fileName, '.md')}
                links=${_files}
            >
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


    // after doing the routes for all the pages, need to do the index page
    var m = router.match('/')
    var { view, getContent } = m.action(m)

    getContent().then(content => {
        var _el = html`<${shell} active=${'/'} links=${_files}>
            <${view} content=${content} />
        <//>`

        var filePath = path.join(__dirname + '/../public', 'index.html')
        var hs = hyperstream({
            '#content': {
                _appendHtml: renderToString(_el)
            }
        })

        var rs = fs.createReadStream(__dirname + '/index.html')
        var ws = fs.createWriteStream(filePath)
        rs.pipe(hs).pipe(ws)
    })
    // ------------------------------------------------------
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
