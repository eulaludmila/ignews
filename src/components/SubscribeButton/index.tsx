import { useSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss'

export function SubscribeButton(){
  const [session] = useSession();
  const router = useRouter();

  async function handleSubscribe(){
    
    if(!session){
      signIn('github');
      return;
    }
    
    //Verificar se já existe um usuário inscrito
    if(session.activeSubscription){
      router.push('/posts');
      return;
    }
    
    //criação do checkout session - documentação do stripe
    try {
    const res = await api.post('/subscribe')
    
    const {sessionId} = res.data;
    const stripe = await getStripeJs()

    await stripe.redirectToCheckout({sessionId});
  } catch (err) {
    alert(err.message);
  }
    
}
  return (
    <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
      Subscribe now
    </button>
  )
}