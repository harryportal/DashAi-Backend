import "express-async-errors";
import express from "express";
import morgan from 'morgan';
import cors from 'cors';
import { ErrorHandler } from './common/error';
import { Application } from 'express';
import passport from "passport";
import authRouter from "./modules/auth/auth.router";
import session from "express-session"


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



app.use('*', ErrorHandler.pagenotFound());
app.use(ErrorHandler.handle());
ErrorHandler.exceptionRejectionHandler();

export default app;
