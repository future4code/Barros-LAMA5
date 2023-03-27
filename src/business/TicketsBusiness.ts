import { ShowsDatabase } from "../data/ShowsDatabase";
import { TicketsDatabase } from "../data/TicketsDatabase";
import { BaseError } from "../errors/BaseError";
import { InvalidPrice, InvalidQuantity, InvalidTicketName, MissingData, ShowNotFound } from "../errors/TicketsErrors";
import { Unauthorized } from "../errors/UserErrors";
import { TicketInputDTO, Tickets } from "../model/Tickets";
import { IdGenerator } from "../services/idGenerator";

export class TicketsBusiness {

    createTickets = async (role: string, input: TicketInputDTO): Promise<void> => {

        try {

            if (role !== 'ADMIN') {
                throw new Unauthorized();
            }

            if (!input.name && !input.price && !input.quantity && !input.showId) {
                throw new MissingData();
            }

            if (!input.name || input.name.length < 10) {
                throw new InvalidTicketName();
            }

            if (isNaN(input.price)) {
                throw new InvalidPrice();
            }

            if (isNaN(input.quantity) || !Number.isInteger(input.quantity)) {
                throw new InvalidQuantity();
            }

            const showDatabase = new ShowsDatabase();
            const getShow = showDatabase.getShowByID(input.showId)

            const ticketsDatabase = new TicketsDatabase();
            const getTickets = await ticketsDatabase.getAllTickets();
            for (let i = 0; i < getTickets.length; i++) {
                if (getTickets[i].getShowId() === input.showId) {
                    throw new BaseError(400, "There are already registered tickets for this event.")
                }
            }


            if (getShow === null) {
                throw new ShowNotFound();
            }

            const idGenerator = new IdGenerator()
            const newId = idGenerator.generate()

            await ticketsDatabase.createTicket(newId, input.name, input.price, input.quantity, input.showId)

         } catch (error:any) {
            throw new BaseError(error.statusCode, error.message)
        }
    };

    getAllTickets = async(): Promise<Tickets[]> => {
        try {
            const ticketsDatabase = new TicketsDatabase();
            const result = await ticketsDatabase.getAllTickets()

            return result
        } catch (error:any) {
            throw new BaseError(error.statusCode, error.message)
        };
    };

    purchaseTicket = async(event: string, quantity: number): Promise<void> => {
        try {
            if (!event) {
                throw new BaseError(400, "Please inform the event.")
            }

            if (isNaN(quantity) || !Number.isInteger(quantity)) {
                throw new InvalidQuantity();
            }

            const ticketsDatabase = new TicketsDatabase();
            const getEvent = await ticketsDatabase.getTicketsByName(event)

            if (getEvent === null) {
                throw new BaseError(400, 'No tickets found for this event.')
            }

            if (getEvent.getQuantity() < quantity) {
                throw new BaseError(400, 'Purchase exceeds the quantity available..')
            }

            const newQty: number = getEvent.getQuantity() - quantity
            const newSold: number = getEvent.getSold() + quantity

            const idGenerator = new IdGenerator();
            const soldTicketsId = idGenerator.generate()

            await ticketsDatabase.sellTicket(getEvent.getId(), soldTicketsId, quantity, newQty, newSold)

        } catch (error:any) {
            throw new BaseError(error.statusCode, error.message)
        }
    }
}