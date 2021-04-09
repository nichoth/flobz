import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { render, hydrate } from 'preact'
// import { useEffect } from 'preact/hooks'
// import { html } from 'htm/preact'
import pkg from 'htm/preact/index.js'
const { html } = pkg
var Route = require('route-event')
var router = require('ruta3')()
const renderToString = require('preact-render-to-string');
import view from './view';
var mkdirp = require('mkdirp')
// var path = require('path')

// Could make a router module that works as a static page generator also

// for each route that is passed in
// create an html page from the function
//   need to use the main function to get the shell part
router.addRoute('/', () => {
    return {
        getContent: getHome,
        view: view.home
    }
})

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

// could keep the `match.action` function synchronous, returning a view,
// but the view has a `useEffect` hook
// would that work with ssr?

router.addRoute('/foo', match => {
    return {
        getContent: getFoo,
        view: view.foo
    }
})

router.addRoute('/bar', () => {
    return {
        getContent: getFoo,
        view: view.bar
    } 
        
})

router.addRoute('/baz', () => {
    return {
        getContent: getFoo,
        view: view.baz
    }
})

function isActive (href, realPath) {
    return href === realPath ? 'active' : ''
}

function shell (props) {
    var { active } = props
    return html`<div>
        <nav>
            <ul>
                <li class="${isActive('/', active)}"><a href='/'>home</a></li>
                <li class="${isActive('/foo', active)}"><a href='/foo'>foo</a></li>
                <li class="${isActive('/bar', active)}"><a href='/bar'>bar</a></li>
                <li class="${isActive('/baz', active)}"><a href='/baz'>baz</a></li>
            </ul>
        </nav>

        ${props.children}
    </div>`
}


// fake stuff
if (typeof window === 'undefined') {  // if we are in node
    var _routes = router.routes.map(obj => obj.src)

    _routes.forEach(routePath => {
        var m = router.match(routePath)
        var { view, getContent } = m.action(m)
        getContent().then(content => {
            // var el = html`<${shell} active=${path}>
            //     <${view} content=${content} />
            // <//>`
            // var _el = renderToString(el)
            // create files in the node version

            var filePath = path.join(__dirname + '/../public', routePath)
            console.log('filepath', filePath)

            // fs.writeFile(prefix + '/' + path, `<html>${_el}</html>`)
        })
    })
} else {  // we are in browser
    // do the route listener part 
    var route = Route()
    route(function onRoute (path) {
        console.log('path', path)
        var m = router.match(path)
        console.log('match', m)

        if (!m) {
            console.log('not m')
            return
        }

        var { view, getContent } = m.action(m)

        var el = html`<${shell} active=${path}>
            <${view} />
        <//>`

        render(el, document.getElementById('content'))

        getContent().then(content => {
            var _el = html`<${shell} active=${path}>
                <${view} content=${content} />
            <//>`
            render(_el, document.getElementById('content'))
        })
        
    })
}



