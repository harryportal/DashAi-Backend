import "express-async-errors";
import express from "express";
import morgan from 'morgan';
import cors from 'cors';
import session from "express-session"
import passport from "passport";
import { ErrorHandler } from './common/error';
import { Application } from 'express';
import { router as curatedGiftsRouter } from "./modules/curated-gifts/curated-gifts.router";
import {router as authRouter} from "./modules/auth/auth.router";
import {router as userRouter} from "./modules/user/user.router";
import { router as wishlistRouter } from "./modules/wishlist/wishlist.router";


const app: Application = express();

const CLIENT_SECRET = process.env.CLIENT_SECRET as string;

app.use(
    session({
      secret: CLIENT_SECRET,
      resave: false,
      saveUninitialized: false,
    })
);

app.use(cors());
app.use(morgan('dev'));
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/wishlist", wishlistRouter)
app.use("/api/v1/curated-gifts", curatedGiftsRouter);



app.use('*', ErrorHandler.pagenotFound());
app.use(ErrorHandler.handle());
ErrorHandler.exceptionRejectionHandler();

export default app;
