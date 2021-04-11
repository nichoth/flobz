import { render, hydrate } from 'preact'
import { html } from 'htm/preact'
var Route = require('route-event')
var router = require('ruta3')()
import shell from './view/shell';
import router from './routes'

// TODO
// var links = require('./links.json')
var links = {}

var route = Route()

// we want to listen on the route *not the first time you load the page*
// but all subsequent times
// (onRoute gets called the first time you visit the page)

var count = 0

route(function onRoute (_path) {
    count++
    var m = router.match(_path)
    console.log('match', m)
    var { view, getContent } = m ? m.action(m) : {}
    console.log('path', _path)

    // would want a 404 page here
    if (!m) {
        console.log('not m')
        return
    }

    // if this were a purely static site, not a single page app,
    // we would want to *only hydrate*. There would be no route-event
    // listener, each page would be downloaded then hydrated

    // what if we requested *only some text or json* on each route change?
    // how to do that with netlify CMS?

    if (!(count - 1)) {  // if this is the first page load
        getContent().then(content => {
            console.log('hydrating in here')
            var el = html`<${shell} active=${_path} links=${links}>
                <${view} content=${content} />
            <//>`
            hydrate(el, document.getElementById('content'))
        })
        console.log('returning')
        return
    }


    // first render without content, to update the shell
    var el = html`<${shell} active=${_path} links=${links}>
        <${view} />
    <//>`
    render(el, document.getElementById('content'))

    // then get the content and render again
    getContent().then(content => {
        var _el = html`<${shell} active=${_path} links=${links}>
            <${view} content=${content} />
        <//>`
        console.log('got content', content)
        render(_el, document.getElementById('content'))
    })
})
