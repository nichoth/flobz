import { render } from 'preact'
import { html } from 'htm/preact'
var route = require('route-event')()
var router = require('ruta3')()

// Could make a router module that works as a static page generator also

// for each route that is passed in
// create an html page from the function
//   need to use the main function to get the shell part

router.addRoute('/foo', route => {
    console.log('route', route)
    return function fooRoute () {
        return html`<h1>fooooo</h1>`
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

route(function onRoute (path) {
    console.log('path', path)
    var m = router.match(path)
    console.log('match', m)
    var view = m ? m.action(m) : null
    
    var el = html`<${shell} active=${path}>
        ${view ? html`<${view}><//>` : null}
    <//>`

    render(el, document.getElementById('content'))
})


// route.generate
// routes.forEach
//    if (node) ssRender(mainFn(route))
//    mainFn(route)



