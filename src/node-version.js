import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// import { render, hydrate } from 'preact'
// import { useEffect } from 'preact/hooks'
// import { html } from 'htm/preact'
import pkg from 'htm/preact/index.js'
const { html } = pkg
// var Route = require('route-event')
var router = require('ruta3')()
const renderToString = require('preact-render-to-string');
import view from './view/index.js';
import shell from './view/shell';
var mkdirp = require('mkdirp')
var hyperstream = require('hyperstream')
var fs = require('fs')

// Could make a router module that works as a static page generator also

function getFoo () {
    return new Promise((resolve, _reject) => {
        setTimeout(() => {
            resolve('fooooooo')
        }, 3000)
    })
}

function getHome () {
    return new Promise((resolve, _reject) => {
        setTimeout(() => {
            resolve('homeeeee')
        }, 3000)
    })
}

router.addRoute('/', () => {
    return {
        getContent: getHome,
        view: view.home
    }
})


router.addRoute('/foo', match => {
    return {
        getContent: getFoo,
        view: view.foo
    }
})

router.addRoute('/bar', () => {
    return {
        getContent: function getBar () {
            return new Promise((resolve, _reject) => {
                setTimeout(() => {
                    resolve('barrrrrrr')
                }, 3000)
            })
        },

        view: view.bar
    } 
        
})

router.addRoute('/baz', () => {
    return {
        getContent: function getBaz () {
            return new Promise((resolve, _reject) => {
                setTimeout(() => {
                    resolve('bazzzz')
                }, 3000)
            })
        },
        view: view.baz
    }
})

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
