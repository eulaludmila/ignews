import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna"
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createdAction = false
) {
  //Buscar o usuário no banco do FaunaDB com o id customerId
  //Salvar os dados da subscription do usuário na FaunaDB
  const userRef = await fauna.query(//pegar a referência
    q.Select(
      "ref",
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'), customerId
        )
      )
    )
  )
  //pegar todos os dados da subscriptions
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  }

  if(createdAction){
    await fauna.query(
      q.Create(
        q.Collection('subscriptions'),
        {data: subscriptionData}
      )
    )
  }else{
    await fauna.query(
      //O replace - vai substituir por completo a subscription
      q.Replace(
        q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index('subscription_by_id'),
              subscriptionId
            )
          )
        ),
        {
          data: subscriptionData
        }
      )
    )
  }
}