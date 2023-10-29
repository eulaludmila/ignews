import Stripe from 'stripe';
import {version} from '../../package.json'

/*Configurando Stripe com a secret key, 
e informações obrigatórias , como a versão do stripe
 e appInfos que não são tão relevantes que é o metadados*/
export const stripe = new Stripe(
  process.env.STRIPE_API_KEY,
  {
    apiVersion: '2020-08-27',
    appInfo: {
      name: 'Ignews',
      version
    }
  }
)
