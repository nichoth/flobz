import { createRequire } from 'module';
const require = createRequire(import.meta.url);
var router = require('ruta3')()
import view from './view/index.js';
var fs = require('fs')

router.addRoute('/', () => {
    return {
        getContent: function getHome () {
            return new Promise((resolve, _reject) => {
                setTimeout(() => {
                    resolve('homeeeee')
                }, 3000)
            })
        },

        view: view.home
    }
})

router.addRoute('/posts/:slug', ({ params }) => {
    var { slug } = params

    return {
        getContent: () => {
            if (typeof window === 'undefined') {
                return new Promise((resolve, reject) => {
                    fs.readFile('...', (err, content) => {
                        if (err) return reject(err)
                        resolve(content)
                    })
                })
            }

            return fetch('/_posts/blog/' + slug)
        },

        view: view.home  // change the view
    }
})

router.addRoute('/foo', () => {
    return {
        getContent: function getFoo () {
            return new Promise((resolve, _reject) => {
                setTimeout(() => {
                    resolve('fooooooo')
                }, 3000)
            })
        },

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

export default router
