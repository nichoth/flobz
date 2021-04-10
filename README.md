# flobz

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

We rendeer all routes as static pages, and also include js code for 
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


`@preact/prerender-data-provider`
It either includes the inlined data, or fetches from JSON from a URL


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


