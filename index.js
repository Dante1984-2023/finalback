const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const authenticateToken = require("./auth/authenticateToken");
const log = require("./lib/trace");
//require("dotenv").config();




/// middleware
const corsOptions = {
  origin: "http://localhost:3000" // frontend URI (ReactJS)
}

app.use(cors(corsOptions));


const dotenv = require( 'dotenv').config();
const PORT = process.env.PORT;
require('./conexion/conexion.tsx');
const Producto = require('./model/userModels.tsx');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





main().catch((err) => console.log(err));
  
async function main() {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);

  console.log("Conectado a la base de datos Atlas");
}

app.use("/api/signup", require("./routes/signup"));
app.use("/api/login", require("./routes/login"));
app.use("/api/signout", require("./routes/logout"));

// Ruta para renovar el token de acceso utilizando el token de actualización
app.use("/api/refresh-token", require("./routes/refreshToken"));

app.use("/api/posts", authenticateToken, require("./routes/posts"));
// Ruta protegida que requiere autenticación
/* app.get("/api/posts", authenticateToken, (req, res) => {
  res.json(posts);

}); */
/* app.post("/api/posts", authenticateToken, (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const post = {
    id: posts.length + 1,
    title: req.body.title,
    completed: false,
  };

  posts.push(post);

  res.json(post);
}); */

app.use("/api/user", authenticateToken, require("./routes/user"));





app.get('/', (req, res) => {
    res.send(`<h1>Soy el Back del CARRITO3</h1>`)
});

app.post('/productocarrito', async (req, res) => {
    console.log(req.body);
    const { id, nombre, urlimagen, precio } = req.body;

    console.log(`Mi id es ${id}, mi nombre es ${nombre}, mi url es ${urlimagen} y el precio ${precio}`);

       //4. si no Existe, creamos un nuevo usuario
    const nuevoProducto = new Producto(req.body);

    console.log(`1. Nuevo Usuario a guardar: ${nuevoProducto}`);

    await nuevoProducto.save();


});

app.get('/Mostrarproducto', async (req, res) =>{
    const productonuevo = await Producto.find({},
        {
            "id": 1,
            "nombre": 1,
           "urlimagen": 1,
           "precio":1,
           "timestamp": 1
        });

       let miDia= new Date();

        console.log(productonuevo);
        res.json({ 
          productonuevo
        })
})

/* Eliminamos los datos */
app.delete('/Mostrarproducto/:id', async (req, res)=>{
    const id = req.params.id;
    console.log(id);

    try {
        const deleteProductoE = await Producto.findByIdAndDelete(id);
         console.log(deleteProductoE);
         if(!deleteProductoE){
            return res.status(404).send();
         }else{
            console.log('Producto Eliminado');
            return res.status(200).send();
         }
    }catch(error){

    }
})


/* Actualizamos los datos del Producto */

app.put('/Mostrarproducto/:id', async (req, res)=>{
    const id = req.params.id;
    console.log(id);


    const data ={
        nombre: req.body.nombre,
        urlimagen:req.body.urlimagen,
        precio:req.body.precio,
      
    }
     console.log(data);
     console.log(id);
   
       try {
        const updateProductoA = await Producto.findByIdAndUpdate(id, data);
         console.log(updateProductoA);
         if(updateProductoA){
            console.log('Producto Actualizado');
            return res.status(200).send();
         }else{
           
            return res.status(404).send();
         }
    }catch(error){
          console.log(error);
    }
})


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el Puerto ${PORT}`);
})




module.exports = app;