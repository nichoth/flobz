import pkg from 'htm/preact/index.js'
const { html } = pkg
// import * as links from '../links.json'
// var links = require('../links.json')

function isActive (href, realPath) {
    return href === realPath ? 'active' : ''
}

function shell (props) {
    var { active, links } = props

    console.log('liniks', links)
    console.log('active', active)

    return html`<div>
        <nav>
            <ul>
                <li class="${isActive('/', active)}"><a href='/'>home</a></li>
                <li class="${isActive('/foo', active)}"><a href='/foo'>foo</a></li>
                <li class="${isActive('/bar', active)}"><a href='/bar'>bar</a></li>
                <li class="${isActive('/baz', active)}"><a href='/baz'>baz</a></li>
            </ul>

            <h2>posts</h2>
            <ul>
                ${links.map(function (link) {
                    return html`<li class="${isActive(link, active)}">
                        <a href="/posts/${link}">${link}</a>
                    </li>`
                })}
            </ul>
        </nav>

        ${props.children}
    </div>`
}

export default shell
