import { Tickets } from "../model/Tickets";
import { BaseDatabase } from "./BaseDatabase";

export class TicketsDatabase extends BaseDatabase {

    private static TABLE_NAME = "LAMA_Tickets";

    createTicket = async (id: string, name: string, price: number, quantity: number, showId: string): Promise<void> => {
        try {
            const newTicket = {
                id: id,
                name: name,
                price: price,
                quantity: quantity,
                show_id: showId
            }
    
            await this.getConnection()
            .insert(newTicket)
            .into(TicketsDatabase.TABLE_NAME)

        } catch (error:any) {
            throw new Error(error.sqlMessage || error.message);
        }
    };

    getAllTickets = async(): Promise<Tickets[]> => {
        try {
            
            const tickets = await this.getConnection()
            .select("*")
            .from(TicketsDatabase.TABLE_NAME)

            const allTickets: Tickets[] = []

            for (let i = 0; i < tickets.length; i++) {
                const thisTicket = {
                    id: tickets[i].id,
                    name: tickets[i].name, 
                    price: tickets[i].price, 
                    quantity: tickets[i].quantity,
                    showId: tickets[i].show_id,
                    sold: tickets[i].sold
                }
                
                allTickets.push(Tickets.toTicketsModel(thisTicket))
            }

            return allTickets

        } catch (error:any) {
            throw new Error(error.sqlMessage || error.message);
        }
    };

    getTicketsByName = async(name: string): Promise<Tickets | null> => {
        try {
            
            const ticket = await this.getConnection()
            .select("*")
            .from(TicketsDatabase.TABLE_NAME)
            .where({name})

            const thisTicket = {
                id: ticket[0].id,
                name: ticket[0].name, 
                price: ticket[0].price, 
                quantity: ticket[0].quantity,
                showId: ticket[0].show_id,
                sold: ticket[0].sold
            }

            if (ticket.length < 1 ) {
                return null
            }
                
            return Tickets.toTicketsModel(thisTicket)

        } catch (error:any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    sellTicket = async(ticketsId: string, soldTicketsId: string, quantity: number, newQty: number, newSold: number): Promise<void> => {
        try {

            await this.getConnection()
            .from(TicketsDatabase.TABLE_NAME)
            .update({quantity: newQty})
            .update({sold: newSold})
            .where({id: ticketsId})

            const newTickets = {
                id: soldTicketsId,
                tickets_id: ticketsId,
                quantity: quantity
            }

            await this.getConnection()
            .insert(newTickets)
            .into("LAMA_Sold_Tickets")

        } catch (error:any) {
            throw new Error(error.sqlMessage || error.message);
        }
    };
}