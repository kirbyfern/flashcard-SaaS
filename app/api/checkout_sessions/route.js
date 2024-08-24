import { NextResponse } from 'next/server'
import Strip, { Stripe } from 'stripe'

// strip checkout process
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
})

export async function POST(req) {
    try {
        //implement the checkout session creation here
        const params = {
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: 'Pro subscription',
                  },
                  unit_amount: 1000, // $10.00 in cents
                  recurring: {
                    interval: 'month',
                    interval_count: 1,
                  },
                },
                quantity: 1,
              },
            ],
            success_url: `${req.headers.get(
              'Referer',
            )}result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get(
              'Referer',
            )}result?session_id={CHECKOUT_SESSION_ID}`,
          }
          
          const checkoutSession = await stripe.checkout.sessions.create(params)
          
          return NextResponse.json(checkoutSession, {
            status: 200,
          })

    } catch (error) {
        console.error('Error creating checkout_session:', error)
        return new NextResponse(JSON.stringify({ error: { message: error.message } }), {
            status: 500,
        })
    }
}

// 1. It extracts the `session_id` from the query parameters of the request.
// 2. If no `session_id` is provided, it throws an error.
// 3. It uses the Stripe API to retrieve the checkout session details.
// 4. It returns the session details as a JSON response.
// 5. If an error occurs, it returns a 500 status code with the error message.
export async function GET(req) {
    const searchParams = req.nextUrl.searchParams
    const session_id = searchParams.get('session_id')
  
    try {
      if (!session_id) {
        throw new Error('Session ID is required')
      }
  
      const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)
  
      return NextResponse.json(checkoutSession)
    } catch (error) {
      console.error('Error retrieving checkout session:', error)
      return NextResponse.json({ error: { message: error.message } }, { status: 500 })
    }
  }