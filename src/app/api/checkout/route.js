import { useUserStore } from "@/store/UserStorage";
import paypal from "@paypal/checkout-server-sdk";
import { NextResponse } from "next/server";

const clientId = process.env.PAYPAL_CLIENT_ID
const clientSecret = process.env.PAYPAL_CLIENT_SECRET

const environment= new paypal.core.SandboxEnvironment(clientId,clientSecret)
const client = new paypal.core.PayPalHttpClient(environment)


export async function POST(request) {
  const { amount } = await request.json(); // Obtén el amount del cuerpo de la solicitud

  console.log(amount);

  // Create a new PayPal order request
  const requestBody = new paypal.orders.OrdersCreateRequest();

  requestBody.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: amount.toString(),
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: amount.toString(),
            },
          },
        },
        items: [
          {
            name: "Parking",
            quantity: "1",
            description: "Payment Parking",
            unit_amount: {
              currency_code: "USD",
              value: amount.toString(),
            },
          },
        ],
        description: "Pago de Parking",
      },
    ],
  });

  try {
    const response = await client.execute(requestBody);
    console.log(response);

    return NextResponse.json({
      id: response.result.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
