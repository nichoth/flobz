import { render, hydrate } from 'preact'
import pkg from 'htm/preact/index.js'
const { html } = pkg
var Route = require('route-event')
var router = require('ruta3')()
import view from './view/index.js';
import shell from './view/shell';
// import path from 'path';

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


var route = Route()

// we want to listen on the route *not the first time you load the page*
// but all subsequent times
// (onRoute gets called the first time you visit the page)

var count = 0



// out here, we have just downloaded and run this js, so there is no state
// could use *hydrate*



route(function onRoute (_path) {


    // in here, you want to call *render*


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
            var el = html`<${shell} active=${_path}>
                <${view} content=${content} />
            <//>`
            hydrate(el, document.getElementById('content'))
        })
        console.log('returning')
        return
    }



    // first render without content, to update the shell
    var el = html`<${shell} active=${_path}>
        <${view} />
    <//>`
    render(el, document.getElementById('content'))

    // then get the content and render again
    getContent().then(content => {
        var _el = html`<${shell} active=${_path}>
            <${view} content=${content} />
        <//>`
        console.log('got content', content)
        render(_el, document.getElementById('content'))
    })
})
