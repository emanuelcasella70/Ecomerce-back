import Stripe from "stripe";
import nodemailer from "nodemailer";



export const createPayment = async(req, res) => {
    try{
    const stripe = new Stripe(process.env.STRIPE_KEY)
    console.log(req.body)
    const {items, cliente} = req.body

    const line_items = items.map(item =>{
        const precioLimpio = item.precio.replace("$", "").replace(/\./g, "");
        
        return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.titulo, 
                        description: "Artículo de la tienda",
                    },
                    unit_amount: Number(precioLimpio) * 100, 
                },
                quantity: Number(item.cantidad) 
            };
            
    });

    const session = await stripe.checkout.sessions.create({
            line_items: line_items, 
            mode: "payment",
            success_url: "http://localhost:3000/success",
            metadata: {
            nombre: cliente.name,
            autorizados: cliente.nameAut  ,
            contacto: cliente.nContact,
            localidad: cliente.lcda,
            direccion: cliente.dc,
            etcalles: cliente.etcalle
            },
            cancel_url: "http://localhost:3000/cancel"
        });

        return res.json(session);
}catch(error){
    console.error(error)

}    

}

export const recibeWebhookStripe = ()=>{

}