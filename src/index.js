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

    return {
        getContent: getHome,
        view: view
    }

    function view (props) {
        return html`<div>
            <h1>home</h1>
            <p>${props.res}</p>
        </div>`
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
    console.log('route', match)

    return {
        getContent: getFoo,
        view: fooView
    }

    function fooView (props) {
        return html`<div>
            <h1>foooooooo</h1>
            <p>${props.res}</p>
        </div>`
    }
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
if (window === undefined) {  // if we are in node
    routes.forEach(path => {
        var m = router.match(path)
        var { view, getContent } = m.action(m)
        getContent().then(res => {
            var el = html`<${shell} active=${path}>
                <${view} res=${res} />
            <//>`
            var _el = renderToString(el)
            // create files in the node version
            fs.writeFile(prefix + '/' + path, `<html>${_el}</html>`)
        })
    })
} else {  // we are in browser
    // do the route listener part 
}




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

    getContent().then(res => {
        var _el = html`<${shell} active=${path}>
            <${view} res=${res} />
        <//>`
        render(_el, document.getElementById('content'))
    })
    
})
