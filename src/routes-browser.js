// this is copied from `routes.js`. it's bad but we need browserify to work

// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
var router = require('ruta3')()
import view from './view/index.js';

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
            return fetch('/_posts/blog/' + slug)
                .then(res => {
                    res.text().then(text => console.log('textttt', text))
                    return res.text()
                })
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
