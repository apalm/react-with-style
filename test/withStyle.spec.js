import expect from 'expect'
import { createClass, createElement } from 'react'
import { createRenderer } from 'react-addons-test-utils'
import withStyle from '../src/withStyle'

function shallowRender(node, renderer = createRenderer()) {
  renderer.render(node)
  return renderer.getRenderOutput()
}

describe('withStyle', () => {
  it('sets displayName correctly', () => {
    expect(withStyle()(
      createClass({
        displayName: 'Foo',
        render() {
          return null
        }
      })
    ).displayName).toBe('WithStyle(Foo)')

    expect(withStyle()(
      createClass({
        render() {
          return null
        }
      })
    ).displayName).toBe('WithStyle(Component)')
  })

  it('passes style to wrapped component', () => {
    const decorator = withStyle({
      background: 'khaki',
      textAlign: 'center'
    })

    const Decorated = decorator(
      createClass({
        render() {
          return createElement('div', this.props)
        }
      })
    )

    const { props: { style }} = shallowRender(createElement(Decorated))

    expect(style).toEqual({
      background: 'khaki',
      textAlign: 'center'
    })
  })

  it('merges style', () => {
    const decorator = withStyle({
      background: 'khaki',
      textAlign: 'center'
    })

    const Decorated = decorator(
      createClass({
        getDefaultProps() {
          return {
            style: {
              background: 'crimson',
              color: 'chocolate'
            }
          }
        },
        render() {
          return createElement('div', this.props)
        }
      })
    )

    const { props: { style }} = shallowRender(createElement(Decorated))

    expect(style).toEqual({
      background: 'khaki',
      textAlign: 'center',
      color: 'chocolate'
    })
  })
})
