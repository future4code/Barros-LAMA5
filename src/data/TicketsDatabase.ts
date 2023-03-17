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
}