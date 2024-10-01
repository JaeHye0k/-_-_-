import express from "express";
import usersRouter from "./routes/users.js";
import booksRouter from "./routes/books.js";
import likesRouter from "./routes/likes.js";
import cartsRouter from "./routes/carts.js";
import ordersRouter from "./routes/orders.js";

const app = express();
app.listen(process.env.PORT);
app.use(express.json());
app.use("/users", usersRouter);
app.use("/books", booksRouter);
app.use("/likes", likesRouter);
app.use("/carts", cartsRouter);
app.use("/orders", ordersRouter);
