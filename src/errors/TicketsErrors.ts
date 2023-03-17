import { BaseError } from "./BaseError";

export class MissingData extends BaseError {
    constructor() {
        super(406, '"name", "quantity", "price" and "showId" must be provided')
    }
};

export class InvalidTicketName extends BaseError {
    constructor() {
        super(400, "Ticket name must be at least 10 characters")
    }
};

export class InvalidQuantity extends BaseError {
    constructor() {
        super(400, "Quantity must be an integer number.")
    }
};

export class InvalidPrice extends BaseError {
    constructor() {
        super(400, "Price must be a valid value.")
    }
};

export class ShowNotFound extends BaseError {
    constructor() {
        super(400, "No show was found with the informed ID.")
    }
};