import { render, screen, fireEvent } from '@testing-library/react'
import { useSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { SubscribeButton } from '.'


jest.mock('next-auth/client')

jest.mock('next/router')

describe('SubscribeButton component', () => {
  //it --> referencia o texto do describe
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(
      <SubscribeButton />
    )
    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('redirects user to sign in when not autheticated', () => {
    const signInMocked = jest.mocked(signIn)

    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SubscribeButton/>)
    const subscribeButton = screen.getByText('Subscribe now');
    //dispara evento
    fireEvent.click(subscribeButton)

    //'espionar' se a função signIn foi chamada quando o usuário não estive logado
    expect(signInMocked).toHaveBeenCalled()
  })

  it('redirects to posts when user already has a subscription', () => {
    const useRouterMocked = jest.mocked(useRouter)
    const useSessionMocked = jest.mocked(useSession)
    const pushMock = jest.fn() //forma de observar se uma função está sendo chamada ou não

    useSessionMocked.mockReturnValueOnce([
      { 
        user: { name: "John Doe", email: "john.doe@example.com" }, 
        expires: "fake-expires" ,
        activeSubscription: 'fake-active-subscription',
      },
      false
    ])

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<SubscribeButton/>)

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton)

    //verificar se a função foi chamada com o parâmetro '/posts'
    expect(pushMock).toHaveBeenCalledWith('/posts')
  })

})