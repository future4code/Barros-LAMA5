import { BaseError } from "./BaseError";

export class MissingData extends BaseError {
    constructor() {
        super(406, '"weekDay", "startTime", "endTime" and "bandId" must be provided')
    }
};

export class InvalidWeekDay extends BaseError {
    constructor() {
        super(400, "WeekDay must be either 'FRIDAY', 'SATURDAY' or 'SUNDAY'.")
    }
};

export class InvalidStartTime extends BaseError {
    constructor() {
        super(400, "Start time must be an integer number between 8 and 22.")
    }
};

export class InvalidEndTime extends BaseError {
    constructor() {
        super(400, "End time must be an integer number between 9 and 23.")
    }
};

export class BandNotFound extends BaseError {
    constructor() {
        super(400, "No band was found with the informed ID.")
    }
};