import { useEffect } from 'react';
import { GetStaticProps, GetStaticPaths } from "next"
import { useSession } from 'next-auth/client';
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../../services/prismic";
import Head from 'next/head';
import styles from '../post.module.scss'
import Link from "next/link";
import { useRouter } from 'next/router';

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    updatedAt: string;
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // Passar um slug específico para buldar 
    /* { params: 
         {slug: 'substituindo-a-instrucao-switch-por-object-literal'}
     } */ 
    paths: [], //deixar vazio faz com que todos os posts sejam buildados
    fallback: 'blocking' 
    /*
    true - causa layout shift, e é ruim para SEO, pois não aparecer o post de primeira --> pouco usado
    false - se o post não foi gerado ainda, gera 404 --> mais usados
    blocking - se não tiver conteudo gerado de forma static, ele vai carregar a camada do next --> mais usado
    */
  }
}

export default function PostPreview({ post }: PostPreviewProps) {

  const [session] = useSession();

  const router = useRouter();
  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session])

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a href="">Subscribe now</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});
  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),//Pegar os primeiros três blocos de conteudo
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  };

  return {
    props: {
      post,
    },
    //Ao utilizar o getStaticProps, é importante colocar de quanto em quanto o conteudo deve ser atualizado
    redirect: 60 * 30, //30 minutos - 1 vez a cada 30 minutos
  }
}