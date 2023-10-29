import { render, screen } from '@testing-library/react'
import { Header } from '.'

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

jest.mock('next-auth/client', () => {
  return{
    useSession() {
      return[null, false]
    }
  }
})

describe('Header component', () => {
  //it --> referencia o texto do describe
  it('renders correctly', () => {
    render(
      <Header />
    )

    //retorna uma url ue simula informações da página e como pegar informações em tela
    screen.logTestingPlaygroundURL()

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Posts')).toBeInTheDocument()
  })
})