import { GetStaticProps } from 'next';
import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import styles from './home.module.scss';

//Formas de fazer chamadas de API
//Client-side - Não precisa de indexação, quando a info é carregada através da ação do usuário ou quando não precisa ser carregado de início
// Server-side - Precisa da indexação e dados dinâmicos, dados em tempo rela
// Static Site Generation - Usa para casos de criar um HTML que todas as pessoas acessarão (Home, Blog, página de um produto)

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  }
}
export default function Home({product}: HomeProps) {


  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>Get access to all the publications <br/>
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

//Função para realizar requisição na camada do servidor Next SSR
export const getStaticProps:GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1JUAjWHzEWGa9YyBPthBIjli', {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format( price.unit_amount / 100), // O valor do preço vem em centavos e vamos manipular
  }
  
  return {
    props:{
      product
    },
    //quanto tempo em segundos eu quero que essa página seja revalidada(construída) novamente
    revalidate: 60 * 60 * 24, //24 horas
  }
}
