# flobz

https://flobz.netlify.app/

[![Netlify Status](https://api.netlify.com/api/v1/badges/5c0cc90e-7806-455e-9444-6fc5705baa00/deploy-status)](https://app.netlify.com/sites/flobz/deploys)

A naive client side routing example

we want to have a static website generated, but with every page having
some JS that will take over the routing & rendering

---------------------------------------

## build
```
npm run build
```


--------------------------------------

Could use the router object to pre-render every route that you add

then the `bundle.js` file would call `hydrate()` instead of `render`

--------------------------------------------

https://medium.com/@luke_schmuke/how-we-achieved-the-best-web-performance-with-partial-hydration-20fab9c808d5

This is an example of sending the same static content for all routes. Would not scale that well if there is a lot of content. However, it might work as a pwa type application, since it gets installed & cached via a service-worker

How to render each route on the server, ahead of time, then serve the right
content per route, and hydrate things once it's downloaded? Hydration is 
important, because the routes are handled client-side. Each route would
need to request its content when you load the route, so that way it saves you from downloading all content up-front.

----------------------------------------------------------------------

* [hydrate() preact docs](https://preactjs.com/guide/v10/api-reference/#hydrate)
* [htm-ssr.js](https://gist.github.com/developit/699c8d8f180a1e4eed58167f9c6711be)

---------------------------------------------------

We render all routes as static pages, and also include js code for 
browser-side routing in the application. That way it is the best of both
worlds -- fast initial page load, plus fast route changes or css
transitions on subsquent route changes.

--------------------------------

`ruta3` has a property [`.routes`](https://github.com/bevacqua/ruta3/blob/master/index.js#L66) that is the list of routes that we need.

------------------------------------------

```
node --experimental-specifier-resolution=node ./src/node-version.js 
```

We had to do some stuff to adapt this to `import` style:
```js
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
```

-------------------------------------

* https://medium.com/dev-channel/a-netflix-web-performance-case-study-c0bcde26a9d9
* [htm-ssr.js](https://gist.github.com/developit/699c8d8f180a1e4eed58167f9c6711be)
* https://preactjs.com/guide/v10/api-reference/#hydrate


----------------------------------------------


* https://preactjs.com/cli/pre-rendering/

which routes are prerendered
> Out of the box only the homepage is pre-rendered. In order to pre-render additional URLs (routes), you'll want to add a prerender-urls.json file to your project. 

Just request the *JSON data* on client-side routing event --

> When a visitor first navigates to your app, the markup will contain only pre-rendered data for that specific page to avoid unnecessary download size. When they navigate to another route via **client-side navigation**, there won't be inlined pre-render data for that page. To get the data, make a request to `/<new-route>/ preact_prerender_data.json` to get the data that route. Preact CLI enables this by generating a preact_prerender_data.json file next to each pre-rendered page at build time.

This is the same as what we have done in this example. Hydrate the first time,
download and render subsequent pages. But we are doing it ad-hoc, without a prerendering component


`@preact/prerender-data-provider` -- It either includes the inlined data, or fetches from JSON from a URL


## todo
* look at [unistore](https://github.com/developit/unistore)
* look at [stockroom](https://github.com/developit/stockroom)


----------------------------------------------

## netlify CMS

* add an `admin` folder to the site root:
```
admin
 ├ index.html
 └ config.yml
```

* setup CMS configuration
* add authentication on netlify UI
* add the netlify identity script in two places, the main index html file,
and the `admin/index.html`:

```
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```

* add a redirecting script to `index.html`:
```html
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
</script>
```

--------------------------------------------------

Be sure to use a folder that is hosted publicly for the storage of post source
content: 

```yml
collections:
  - name: "blog" # Used in routes, e.g., /admin/collections/blog
    label: "Blog" # Used in the UI
    folder: "public/_posts/blog" # The path to the folder where the documents are stored
```

We will use this `folder` path later when we fetch content

post content has a URL like this:
```
https://flobz.netlify.app/_posts/blog/2021-04-10-title-3.md
```

## TODO
* loop through the post names and create a link to each in the home page
* for browserified version, could create a JSON file with the file names, then
  require the json file in the app, and render with a link to each file
* the page for a post needs to fetch the content when the page loads
* handle routes with wildcards in them. The pages built should come from
  the CMS generated source files, not the routes added to the router.
* in the front-end version, need to request the content from the src file --
  `/_posts/post-name`

---------------------------------------------

need some kind of convention when you start a website for how the file names
/ routes will work


The filenames in `/public/_posts/blog` will be used in the actual routes,
so be sure to name the files well.

----------------------------------------------

We can't use code in both browserify and node anymore

in `src/routes.js` there are these 2 lines:
```js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
```

They make things work in node, but it breaks it for browserify

---------------------------------------------

Need to get a JSON file with a list of routes for the nav

Need to build all the pages/routes for the files





---------------------------------------------------------------


* [developit/htm-ssr.js](https://gist.github.com/developit/699c8d8f180a1e4eed58167f9c6711be)

* [Build a SSR App With Preact, Unistore, and Preact Router](https://www.digitalocean.com/community/tutorials/build-a-ssr-app-with-preact-unistore-and-preact-router)

> To summarize, the idea is to initially render the app on the server first and then render the components on the browser.


## it actually works

### the situation
So you have a website, and there is too much content to make a single page app. You want the website to be fast, and also be SEO'd. That means we can make a static website for the SEO part, and static sites are pretty fast too. 

But it would be a *little bit faster* if once you loaded the first page on the site, each subsequent page that you visited requested *just the content* for that page, instead of full markup. That way you could re-use redundant parts like navigation elements (things that appear on every page).

That's what this is. It is a real thing and it is hosted on netlify -- [https://flobz.netlify.app/](https://flobz.netlify.app/)

---------------------------------------

In netlify, create the site and [add netlify-cms](https://www.netlifycms.org/docs/add-to-your-site/). 

In the `/admin/config.yml` file, make sure that new posts are created in the `/public` folder. This is important because we want to request the `md` content whenever we navigate within the site.

```yml
  folder: "public/_posts/blog" 
```

There are two important scripts here. One is a node file that will generate a static site, and the other is the entry file for the website.

In the node file, we want to read all our content files, generate a page with them, and write the page to the right path in the site.

For every source file in the site, we match it against the router, and write the result to the filesystem

```js
import router from './routes'
var hyperstream = require('hyperstream')

fs.readdir(__dirname + '/../public/_posts/blog', (err, files) => {
  files.forEach(fileName => {
    var m = router.match('/posts/' + path.basename(fileName, '.md'))
    var { view, getContent } = m.action(m)

    getContent().then(content => {
      var el = html`<${shell} active=${path.basename(fileName, '.md')}
          links=${_files}
      >
          <${view} content=${content} />
      <//>`

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
})
```

Also during this stage, be sure to write a json file with all the routes in it. We can use that file to generate the navigation in the front end site.

```js
var _files = files.map(file => path.basename(file, '.md'))
fs.writeFileSync(__dirname + '/links.json', JSON.stringify(_files))
```

We pass in the `links` prop when rendering the preact component
```js
var el = html`<${shell} active=${path.basename(fileName, '.md')}
    links=${_files}
>
```

In the frontend JS file, we want to use the same router. We should be able to just import the same file in both places, but [a bug](https://github.com/mattdesl/esmify/issues/15) prevents this at the moment. So there is a file `routes-browser.js` that has the same routes as the backend, but we are using the `fetch` function to request the source `.md` content instead of reading from `fs`.

-----------------------------

So what happens is that the first time you load the site in a browser, it will download and display the static webpage. So you see the content asap. Then we `hydrate` the content with preact. 

Then every time you navigate via the page's links, we will request the `.md` content for that route, and re-render the site using preact. So it is as quick as possible, and also SEO.

It nice to independently come to the same conclusion as [an internet article](https://www.digitalocean.com/community/tutorials/build-a-ssr-app-with-preact-unistore-and-preact-router) --

> To summarize, the idea is to initially render the app on the server first and then render the components on the browser.


