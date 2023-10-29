import { render, screen } from '@testing-library/react'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'
import { getSession } from 'next-auth/client'

const posts =
{
  slug: 'my-new-post',
  title: 'My New Post',
  excerpt: 'Post excerpt',
  content: '<p>Post excerpt</p>',
  updatedAt: '10 de Abril',
}

jest.mock('next-auth/client')
jest.mock('../../services/prismic')

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={posts} />)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(screen.getByText('Post excerpt')).toBeInTheDocument()
  })

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = jest.mocked(getSession)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null
    })

    const response = await getServerSideProps({
      params: {
        slug: 'my-new-post'
      },
    } as any)

    //espera que a resposta se igual 
    //usar só toEqual verifica se é exatamente igual
    expect(response).toEqual(
      // a um objeto contendo as informações esperadas (aqui ele valida se as informações que quero estão no objeto)
      expect.objectContaining({
        redirect: expect.objectContaining(
          {
            destination: `/posts/preview/my-new-post`,
          })
      })
    )
  })

  it('loads initial data', async () => {
    const getSessionMocked = jest.mocked(getSession)
    const getPrimiscClientMocked = jest.mocked(getPrismicClient)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    })

    const response = await getServerSideProps({
      params: {
        slug: 'my-new-post'
      },
    } as any)

    getPrimiscClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {
              type: 'heading', 'text': 'My new post'
            }
          ],
          content: [
            {
              type: 'paragraph',
              text: 'Post content'
            }
          ],
          last_publication_date: '04-01-2021'
        }
      })
    } as any)

    //espera que a resposta se igual 
    //usar só toEqual verifica se é exatamente igual
    expect(response).toEqual(
      // a um objeto contendo as informações esperadas (aqui ele valida se as informações que quero estão no objeto)
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post content</p>',
            excerpt: 'Post excerpt',
            updatedAt: '01 de abril de 2021',
          }
        }
      })
    )

  })
})