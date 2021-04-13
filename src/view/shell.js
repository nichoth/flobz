import pkg from 'htm/preact/index.js'
const { html } = pkg

function isActive (href, active) {
    return active.includes(href) ? 'active' : ''
}

function shell (props) {
    var { active, links } = props

    console.log('liniks', links)
    console.log('active', active)
    // liniks (4) ["2021-04-10-title-3", "aaaaa", "bbbbb", "title-4"]
    // active /posts/title-4

    return html`<div>
        <nav>
            <ul>
                <li class="${active === '/' ? 'active' : ''}"><a href='/'>home</a></li>
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
