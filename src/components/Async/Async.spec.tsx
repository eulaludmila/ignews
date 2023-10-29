import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { Async } from '.'

test('it renders correctly', async () => {
  render(<Async/>)

  expect(screen.getByText('Hello World!')).toBeInTheDocument()

  /*
    await screen and waitFor have been padronization 1000s timeout
  */
  // expect(await screen.findByText('Button', {}, {timeout: 3000})).toBeInTheDocument()
  // await waitFor(() => {
  //   return expect(screen.getByText('Button')).toBeInTheDocument()
  // })

  await waitForElementToBeRemoved(screen.queryByText('Button2'))

  /** 
  * get -> procura elemento de forma assincrona, no entanto se caso não encontrar retorna erro
  * query -> procura ele elemento de forma assincrona, no entanto se caso não encontrar não retorna erro
  * find -> fica monitorando parra quando o elemento der erro, no entanto se não encontrar retorna erro 
  */
})