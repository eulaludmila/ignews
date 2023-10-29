import { render } from '@testing-library/react'
import { ActiveLink } from '.'

//Sempre que usar alguma função, usamos o mock para fazer um fake da informação
jest.mock("next/dist/client/router", () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

describe('ActiveLink component', () => {
  //it --> referencia o texto do describe
  it('renders correctly', () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    )
    expect(getByText('Home')).toBeInTheDocument()
  })

  it('adds active class if the link as currently active', () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    )
    expect(getByText('Home')).toHaveClass('active')
  })

})