import {render, screen} from '@testing-library/react'
import { stripe } from '../../services/stripe'
import Home, { getStaticProps } from '../../pages'

jest.mock('next/router')
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false] 
  }
})

jest.mock('../../services/stripe')

describe('Home page', () => {
  it('renders correctly', () => {
    render(<Home product={{priceId: 'fake-price-id', amount: 'R$10,00'}}/>)

    expect(screen.getByText('for R$10,00 month')).toBeInTheDocument()
  })

  it('loads intial data', async () => {
    const retriveStripePricesMocked = jest.mocked(stripe.prices.retrieve)

    //mockResolvedValueOnce quando a função for promise
    retriveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000
    } as any)

    const response = await getStaticProps({})

    //espera que a resposta se igual 
    //usar só toEqual verifica se é exatamente igual
    expect(response).toEqual(
     // a um objeto contendo as informações esperadas (aqui ele valida se as informações que quero estão no objeto)
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  })
})