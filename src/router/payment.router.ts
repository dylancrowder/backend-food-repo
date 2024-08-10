import { Router } from "express";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { CartService } from "../services/cart.services";

const router = Router();
const client = new MercadoPagoConfig({
  accessToken:
    "TEST-5722182540761857-080718-61e8711ceee9c161a7b034ffbf8e6d66-150714867",
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

    const preference: any = await new Preference(client).create({
      body: {
        items: items,
        back_urls: {
          success: "http://localhost:5173/success-pay",
          failure: "http://localhost:5173/failue-pay",
          pending: "http://localhost:5173/pending-pay",
        },
        notification_url:
          "https://tournament-sent-nebraska-alpine.trycloudflare.com/payment/noti",
      },
    });

    console.log("esta es kla preference" , preference);
    
    // Send the init_point URL to the client
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
