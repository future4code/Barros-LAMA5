import { BaseError } from "./BaseError";

export class MissingData extends BaseError {
    constructor() {
        super(406, '"name", "email, "password" and "role" must be provided')
    }
};

export class InvalidName extends BaseError {
    constructor() {
        super(400, "Name must be at least 2 characters.")
    }
};

export class InvalidEmail extends BaseError {
    constructor() {
        super(400, "E-mail not valid.")
    }
};

export class InvalidPassword extends BaseError {
    constructor() {
        super(400, "Password must be at least 6 characters.")
    }
};

export class RoleNotFound extends BaseError {
    constructor() {
        super(400, "'Role' must be 'ADMIN' or 'NORMAL'.")
    }
};

export class EmailInUse extends BaseError {
    constructor() {
        super(400, "The informed e-mail address is already in use.")
    }
};

export class UserNotFound extends BaseError {
    constructor() {
        super(400, "User not found on database.")
    }
};

export class MissingCredentials extends BaseError {
    constructor() {
        super(400, "You must provide 'email' and 'password' to continue.")
    }
};

export class WrongPassword extends BaseError {
    constructor() {
        super(400, "Wrong password.")
    }
};

export class Unauthorized extends BaseError {
    constructor() {
        super(404, "Inform a valid token to continue.")
    }
};