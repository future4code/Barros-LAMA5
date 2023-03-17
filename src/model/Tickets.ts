export class Tickets {
    constructor(
    private id: string,
    private name: string,
    private price: number,
    private quantity: number,
    private showId: string,
    private sold: string
    ) {}

    getId() {
        return this.id;
    };

    getName() {
        return this.name
    };

    getPrice () {
        return this.price
    }

    getQuantity() {
        return this.quantity;
    };

    getShowId() {
        return this.showId;
    };

    getSold() {
        return this.sold
    }

    setId(id: string) {
        this.id = id;
    };

    setName(name: string) {
        this.name = name;
    };

    setPrice(price: number) {
        this.price = price
    }

    setQuantity(quantity: number) {
        this.quantity = quantity;
    };

    setShowId(showId: string) {
        this.showId = showId;
    };

    setSold(sold: string) {
        this.sold = sold
    }

    static toTicketsModel(ticket: any): Tickets {
        return new Tickets(ticket.id, ticket.name, ticket.price, ticket.quantity, ticket.showId, ticket.sold);
    };
};

export interface TicketInputDTO {
    name: string,
    price: number,
    quantity: number,
    showId: string
};

export interface TicketOutputDTO {
    id: string,
    price: number,
    bandName: string | undefined,
    musicGenre: string | undefined,
    weekDay: string,
    startTime: number,
    endTime: number
}