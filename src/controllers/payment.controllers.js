import { MercadoPagoConfig, Preference } from 'mercadopago';
import nodemailer from "nodemailer";
import axios from 'axios';

export const paymentcontrollers = async (req, res) => {
const client = new MercadoPagoConfig({ accessToken: process.env.MPTOKEN });    
  console.log("BODY RECIBIDO:", req.body);
  console.log("TOKEN:", process.env.MPTOKEN);
  try {
  const {items, cliente} = req.body
  console.log( "loba",  items, cliente)
  

    const body = {
    items: items.map(item => {
        const precioLimpio = item.precio.replace("$", "").replace(/\./g, "");
        
        return {
            title: item.titulo, 
            unit_price: Number(precioLimpio), 
            quantity: Number(item.cantidad),
            currency_id: "ARS"
        };
    }),
    metadata: {
        nombre: cliente.name,
        autorizados: cliente.nameAut  ,
        contacto: cliente.nContact,
        localidad: cliente.lcda,
        direccion: cliente.dc,
        etcalles: cliente.etcalle
    },
    notification_url: "https://overlying-cost-jab.ngrok-free.dev/webhook",
    back_urls: {
        success: "https://overlying-cost-jab.ngrok-free.dev/success",
        failure: "https://overlying-cost-jab.ngrok-free.dev/failure",
        pending: "https://overlying-cost-jab.ngrok-free.dev/pending"
    },
    auto_return: "approved",
};
          
          
const preference = new Preference(client);
const result = await preference.create({ body })

// console.log(result)
// res.send(result)


console.log("Link de pago generado:", result.init_point);
res.json({ init_point: result.init_point });

}catch (error){
       console.error("Error en el servidor:", error);
        res.status(500).json({ error: error.message });
}
}



// export const recimewebhook = (req, res)=>{
//   console.log(req.query);
//   res.send("webhook");




// }

export const recimewebhook = async (req, res) => {
  const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
    user: "emanuelcasella70@gmail.com",
    pass: process.env.PASSWORD
  }
});

  try {

    console.log("QUERY:", req.query);

    const paymentId = req.query["data.id"];

    if (!paymentId) {
      return res.sendStatus(400);
    }

    // CONSULTAR EL PAGO A MERCADO PAGO
    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MPTOKEN}`
        }
      }
    );

    const payment = response.data;

    console.log("PAGO:", payment);

    // SI EL PAGO FUE APROBADO
    if (payment.status === "approved") {

      console.log("PAGO APROBADO");

      const metadata = payment.metadata;

      // ENVIAR MAIL
      await transporter.sendMail({
        from: "emanuelcasella70@gmail.com",
        to: "emanuelcasella70@gmail.com",
        subject: "Nueva compra aprobada",
        html: `
          <h1>Compra aprobada</h1>

          <h2>Datos del cliente</h2>

          <p><strong>Nombre:</strong> ${metadata.nombre}</p>
          <p><strong>Contacto:</strong> ${metadata.contacto}</p>
          <p><strong>Localidad:</strong> ${metadata.localidad}</p>
          <p><strong>Dirección:</strong> ${metadata.direccion}</p>
          <p><strong>Entre Calles:</strong> ${metadata.etcalles}</p>
        `
      });

      console.log("MAIL ENVIADO");
    }

    res.sendStatus(200);

  } catch (error) {

  console.error("ERROR WEBHOOK:", error);

  console.error(error.message);

  res.sendStatus(500);

  }
};

// console.log(allProducts)