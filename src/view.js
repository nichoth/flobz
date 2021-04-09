import pkg from 'htm/preact/index.js'
const { html } = pkg

export default {
    home: function homeView (props) {
        return html`<div>
            <h1>home</h1>
            <p>${props.content}</p>
        </div>`
    },

    foo: function fooView (props) {
        return html`<div>
            <h1>foo</h1>
            <p>${props.content}</p>
        </div>`
    },

    bar: function (props) {
        return html`<div>
            <h1>barrrrrr</h1>
            <p>${props.content}</p>
        </div>`
    },

    baz: function (props) {
        return html`<div>
            <h1>bazzzzzzzzzz</h1>
            <p>${props.content}</p>
        </div>`
    }

}
