require("dotenv").config()
const express = require("express"); 
const axios = require("axios");

const {
    getPrimitiveRoot,
    powerMod 
} = require("./methods"); 


const app = express();
app.use(express.json());

const clientName = process.env.CLIENT_NAME; 
const  publicKey = process.env.COMMON_PUBLIC_KEY; // P
let primitiveRoot = getPrimitiveRoot(publicKey); // G 
let privateKey = process.env.CLIENT_PRIVATE_KEY; //a 
let commonSecretKey = null; 

console.log("Chosen common prime public key : ", publicKey); 
console.log(`${clientName} private key : ${privateKey} `); 
console.log("Generating key to exchange......")
let keyToExchange = powerMod( primitiveRoot, privateKey, publicKey);
console.log(`Key to exchange ${keyToExchange}, sending to listening party in 5 secs`); 


setTimeout (async()=>{ 
    console.log(`Sending exchange key to other party : ${keyToExchange}`);
    try { 
        let res = await axios.post(`${process.env.MITM_URI}/exchangeKey`,{
            key : keyToExchange,
            senderName : clientName
        });
        res = res.data; 
        console.log(`Reply : ${res.message}`); 
    }  catch(err) {
        console.log(err); 
    }
}, 8000); // exchange this key after bob is  available 


app.post("/exchangeKey",(req,res) => {
    const key = req.body.key; 
    const senderName = req.body.senderName
    console.log(`Received exchange key from ${senderName}`, key); 

    commonSecretKey = powerMod(key, privateKey, publicKey);
    console.log(`Common secret key with ${senderName}:`,commonSecretKey);

    return res.status(200).json({
        message : `I am ${clientName}, I have received the key`
    })
})

app.listen(process.env.CLIENT_PORT,()=>{
    console.log(`${process.env.CLIENT_NAME} listening on port ${process.env.CLIENT_PORT}`)
})

