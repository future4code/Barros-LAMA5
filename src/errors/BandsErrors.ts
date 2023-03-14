import { BaseError } from "./BaseError";

export class MissingData extends BaseError {
    constructor() {
        super(406, '"name", "musicGenre" and "responsible" must be provided')
    }
};

export class InvalidName extends BaseError {
    constructor() {
        super(400, "Name must be at least 2 characters.")
    }
};

export class InvalidMusicGenre extends BaseError {
    constructor() {
        super(400, "Music Genre must be at least 3 characters.")
    }
};

export class BandAlreadyRegistered extends BaseError {
    constructor() {
        super(400, "The informed Band name is already registered.")
    }
};

export class BandNotFound extends BaseError {
    constructor() {
        super(400, "No band was found with the informed parameter.")
    }
}