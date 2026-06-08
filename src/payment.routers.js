import { Router } from "express";
import { recimewebhook, paymentcontrollers} from "./controllers/payment.controllers.js";
import {createPayment} from "./controllers/stripe.controllers.js"
import path from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();


router.post("/create-order", paymentcontrollers)
router.post("/create-order/stripe", createPayment ) 
router.get("/success", (req, res)=>{res.send("success")})
router.get("/failure", (req, res)=>{res.send("failure")})
router.get("/pending", (req, res)=>{res.send("pending")})
router.post("/webhook", recimewebhook)
router.get("/buy",(req, res) => {res.sendFile(path.join(__dirname,'..', 'public', 'vta.html'));}); 


export default router;  