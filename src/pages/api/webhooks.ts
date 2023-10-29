import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream'
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

//Função pronta - ela percorre o valor que recebe da requisição e concatena no final
async function buffer(readable: Readable){
  const chunks = [];

  for await (const chunk of readable){
    chunks.push(
      typeof chunk === 'string' ? Buffer.from(chunk) : chunk
    )
  }

  return Buffer.concat(chunks);
}

/*
config - o next acha que toda requisição vem como json, mas nesse caso vem como 
readable e para retirar o padrão usa essa config abaixo
*/
export const config = {
  api: {
    bodyParser: false
  }
}

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export default async function (req: NextApiRequest, res: NextApiResponse){

  //Metodo sempre post
  if(req.method === "POST"){
    //Ler a requisição usando o readable
    const buf = await buffer(req);
    //Pegar o header da requisição
    const secret = req.headers['stripe-signature'];

    //Criar variável de evento
    let event: Stripe.Event;

    try {
      //Construindo o objeto de evento
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      return res.status(400).send(`webhook error: ${error.message}`);
    }

    const { type } = event
    //Verificaremos se o evento é o que precisamos
    if(relevantEvents.has(type)){
      try {
        switch(type){
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':

            const subscription = event.data.object as Stripe.Subscription;
            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false
            )
            break;
          case 'checkout.session.completed':
          //tipar ela para sabeer o que tem dentro dela
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            )

            break;
          default:
            throw new Error('Unhandled event.')
        }
      } catch (error) {
        //Erro de desenvolvimento, não pode mostrar o status error
        return res.json({error : 'webhook handler failed'})
      }
      
    }
    res.status(200).json({received: true})

  }else {
    res.setHeader('Allow', 'POST'); //Retornar no HEADER que é permitido só POST
    res.status(405).end('Method not allowed');
  }
}