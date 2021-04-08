import { render, hydrate } from 'preact'
// import { useEffect } from 'preact/hooks'
import { html } from 'htm/preact'
var route = require('route-event')()
var router = require('ruta3')()
const renderToString = require('preact-render-to-string');

// Could make a router module that works as a static page generator also

// for each route that is passed in
// create an html page from the function
//   need to use the main function to get the shell part
router.addRoute('/', route => {
    console.log('route', route)

    return Promise.resolve({
        data: '',
        view: html`<h1>home</h1>`
    })

    // this is synchronous
    // return function fooRoute () {
    //     return html`<h1>home</h1>`
    // }
})

function getFoo () {
    return new Promise((resolve, _reject) => {
        setTimeout(() => {
            resolve('fooooooo')
        }, 3000)
    })
}

// could keep the `match.action` function synchronous, returning a view,
// but the view has a `useEffect` hook
// would that work with ssr?

// does ssr work if we use `useEffect` here?

router.addRoute('/foo', match => {
    console.log('route', match)

    // in here, would want to fetch the content,
    // can return a promise or something
    return getFoo()
        .then(res => {
            return { data: res, view: html`<h1>${res}</h1>` }
        })

    // return function fooRoute (props) {
    //     return html`<h1>${props.foo || null}</h1>`
    // }

    // return function fooRoute () {
    //     // in here, would need to request the content
    //     return html`<h1>fooooo</h1>`
    // }
})

router.addRoute('/bar', () => {
    return function () {
        return html`<h1>barrrrr</h1>`
    }
})

router.addRoute('/baz', () => {
    return function () {
        return html`<h1>bazzzzz</h1>`
    }
})

// active(href, realPath)

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
                <li><a href='/bar'>bar</a></li>
                <li><a href='/baz'>baz</a></li>
            </ul>
        </nav>

        ${props.children}
    </div>`
}



// fake stuff
routes.forEach(path => {
    var m = router.match(path)
    m.action(m)
        .then(res => {
            var { view } = res
            var el = html`<${shell} active=${path}>
                ${view || null}
            <//>`
            var content = renderToString(el)
            // create files in the node version
            fs.writeFile(prefix + '/' + path, `<html>${content}</html>`)
        })
})




route(function onRoute (path) {
    console.log('path', path)
    var m = router.match(path)
    console.log('match', m)

    if (m) {

        // var view = m.action(m)
        // var el = html`<${shell} active=${path}>
        //     ${view || null}
        // <//>`
        // render(el, document.getElementById('content'))
        
        m.action(m)
            .then(res => {
                var { view } = res
                var el = html`<${shell} active=${path}>
                    ${view || null}
                <//>`
                render(el, document.getElementById('content'))
            })
    }
})
