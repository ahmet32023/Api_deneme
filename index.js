const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());

// Middleware örneği
app.use((req, res, next) => {
  console.log('Hello World');
  next();
});

// Middleware ın belli bir endpoint isteğinde çalışmasını istediğimde alttaki yapıyı kullanırım

/* const logMiddleware = (req, res, next) => {
   console.log('Hello World');
   next();
};
*/
// logMiddleware değişkenini istediğim endpointin içine eklemem lazım
// Örnek: (app.get('/products', logMiddleware, async (req, res)) bu şekide nmiddleware sadece get isteklerinde çalışır


// Ürünleri listelemek için kullanığım endpoint 
// Asenkron yazma sebebim iş bitmeden başka işe geçmesini istememem
app.get('/products', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// ID'ye göre ürün arama
app.get('/products/:id', async (req, res) => {
  const { id } = req.params; // url den ürünün id sini alıyorum
  const product = await prisma.product.findUnique({
    where: { id: Number(id) }, // veritabanında id ye göre gerekli ürünü arayan query
  });
  res.json(product);
});

// Ürün ekleme
// Burada ekleyeceğim ürünün bilgilerini göndermem gerekiyor
app.post('/products', async (req, res) => {
  const { name, description, price } = req.body;
  const newProduct = await prisma.product.create({
    data: { name, description, price },
  });
  res.json(newProduct);
});

// Ürün güncelleme
app.put('/products/:id', async (req, res) => {
  const { id } = req.params; // url den ürünün id sini alıyorum
  const { name, description, price } = req.body;
  const updatedProduct = await prisma.product.update({
    where: { id: Number(id) }, // veritabanında id ye göre gerekli ürünü arayan query
    data: { name, description, price }, // Güncellenen verileri ekleme işlemi
  });
  res.json(updatedProduct);
});

// Ürün silme
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params; // url den ürünün id sini alıyorum
  await prisma.product.delete({
    where: { id: Number(id) }, // veritabanında id ye göre gerekli ürünü arayan query
  });
  res.json({ message: 'Ürün silindi' });//nesne silindi mesajı dönüyor
});

// Burada server ı dinliyorum ve hangi portta çalıştığını konsola yazdırıyorum
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
