# flobz

A naive client side routing example

we want to have a static website generated, but with every page having
some JS that will take over the routing & rendering

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
