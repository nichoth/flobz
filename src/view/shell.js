import pkg from 'htm/preact/index.js'
const { html } = pkg

function isActive (href, realPath) {
    return href === realPath ? 'active' : ''
}

function shell (props) {
    var { active } = props
    console.log('active', active)
    // console.log('isActive', isActive('/foo', active))
    return html`<div>
        <nav>
            <ul>
                <li class="${isActive('/', active)}"><a href='/'>home</a></li>
                <li class="${isActive('/foo', active)}"><a href='/foo'>foo</a></li>
                <li class="${isActive('/bar', active)}"><a href='/bar'>bar</a></li>
                <li class="${isActive('/baz', active)}"><a href='/baz'>baz</a></li>
            </ul>
        </nav>

        ${props.children}
    </div>`
}

export default shell
