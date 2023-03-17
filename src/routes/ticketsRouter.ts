import express from "express";
import { TicketsController } from "../controller/TicketsController";


export const ticketsRouter = express.Router()
const ticketsController = new TicketsController();

ticketsRouter.post("/register", ticketsController.registerTickets)
ticketsRouter.get("/", ticketsController.getAllTickets)