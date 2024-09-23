import { Router } from "express";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { CartService } from "../services/cart.services";

const router = Router();
const client = new MercadoPagoConfig({
  accessToken:
    "APP_USR-3493305980897305-080811-d5235d475648fb7da1bf1a84039e280c-1938376502",
  options: { timeout: 5000, idempotencyKey: "abc" },
});

router.post("/pay", async (req: any, res) => {
  try {
    const cartID: string = req.device;
    const cart: any = await CartService.findOne(cartID);
    // Prepare items array for MercadoPago preference
    const items = cart.items.map((item: any) => ({
      title: item.product.title,
      quantity: item.quantity,
      unit_price: item.product.price,
      id: item.product._id,
    }));

    // Obtener información adicional del cliente
    const {
      phone,
      street,
      street_number,
      zip_code,
      dni,
      firstName,
      lastName,
    } = req.body;

    const preference: any = await new Preference(client).create({
      body: {
        items: items,
        payer: {
          name: firstName, // Nombre del cliente
          surname: lastName, // Apellido del cliente
          phone: {
            area_code: "11",
            number: phone, // Número de teléfono
          },
          address: {
            street_name: street,
            street_number: street_number,
            zip_code: zip_code,
          },
          identification: {
            type: "DNI",
            number: dni, // DNI
          },
        },
        back_urls: {
          success: "http://localhost:5173/success-pay",
          failure: "http://localhost:5173/failue-pay",
          pending: "http://localhost:5173/pending-pay",
        },
        notification_url:
          "https://cj-predicted-jonathan-analyst.trycloudflare.com/payment/noti",
      },
    });

    // Enviar la URL de init_point al cliente
    res.json({ redirectUrl: preference.init_point });
  } catch (error) {
    console.error("Error creating preference:", error);
    res.status(500).send("Error creating preference");
  }
});

router.post("/noti", async (req, res) => {
  try {
    const notificacion: any = req.query;
    console.log("Received notification:", notificacion);

    if (notificacion.type === "payment") {
      const paymentId = notificacion["data.id"];
      console.log("Payment ID received:", paymentId);

      const payment = await new Payment(client).get({ id: paymentId });
      console.log("Payment received:", payment);
    }

    res.json({ status: "success", notificacion });
  } catch (error) {
    console.error("Error processing notification:", error);
    res.status(500).json({ error: "Error processing notification" });
  }
});

export default router;
