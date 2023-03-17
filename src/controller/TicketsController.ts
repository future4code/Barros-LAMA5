import { Request, Response } from "express";
import { TicketsBusiness } from "../business/TicketsBusiness";
import { TicketInputDTO } from "../model/Tickets";
import { Authenticator } from "../services/Authenticator";

export class TicketsController {

    public registerTickets = async (req: Request, res: Response) => {
        try {
            const userToken = req.headers.authorization as string

            const input: TicketInputDTO = {
                name: req.body.name,
                price: req.body.price,
                quantity: req.body.quantity,
                showId: req.body.showId
            }

            const authenticator = new Authenticator()
            const user = authenticator.getData(userToken)

            const ticketsBusiness = new TicketsBusiness();
            await ticketsBusiness.createTickets(user.role, input)

            res.status(200).send({ message: "Tickets registered!" });

        } catch (error:any) {
            res.status(400).send({ error: error.message });
        }
    };

    public getAllTickets = async (req: Request, res: Response) => {
        try {
            const ticketsBusiness = new TicketsBusiness();
            const result = await ticketsBusiness.getAllTickets()

            res.status(200).send({result})
        } catch (error:any) {
            res.status(400).send({ error: error.message });
        }
    };

    public purchaseTicket = async (req: Request, res: Response) => {
        try {

            const eventName = req.body.eventName
            const quantity = req.body.quantity

            const ticketsBusiness = new TicketsBusiness();
            await ticketsBusiness.purchaseTicket(eventName, quantity)

            res.status(200).send({message: "Tickets purchased!"})

        } catch (error:any) {
           res.status(400).send({ error: error.message });  
        }
    }
};