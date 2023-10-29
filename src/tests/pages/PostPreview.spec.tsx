import { render, screen } from '@testing-library/react'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getPrismicClient } from '../../services/prismic'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'

const posts =
{
  slug: 'my-new-post',
  title: 'My New Post',
  excerpt: 'Post excerpt',
  content: '<p>Post excerpt</p>',
  updatedAt: '10 de Abril',
}

jest.mock('next/dist/client/router')
jest.mock('next-auth/client')
jest.mock('../../services/prismic')

describe('Post preview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])
    render(<Post post={posts} />)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(screen.getByText('Post excerpt')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects user to full post when user is subscribe', async () => {
    const useSessionMocked = jest.mocked(useSession)
    const useRouterMocked = jest.mocked(useRouter)
    const pushMocked = jest.fn()
    useSessionMocked.mockReturnValueOnce([{
      activeSubscription: 'fake-active-subscription'
    }, false])

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked
    } as any)

    render(<Post post={posts} />)

    expect(pushMocked).toHaveBeenCalledWith('/posts/my-new-post')
  })

  it('loads initial data', async () => {
    const getPrimiscClientMocked = jest.mocked(getPrismicClient)

    const response = await getStaticProps({params: {slug: 'my-new-post'}})

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