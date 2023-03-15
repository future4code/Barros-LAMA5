import { BandsDatabase } from "../data/BandsDatabase";
import { ShowsDatabase } from "../data/ShowsDatabase";
import { BaseError } from "../errors/BaseError";
import { BandNotFound, InvalidEndTime, InvalidStartTime, InvalidWeekDay, MissingData } from "../errors/ShowsErrors";
import { ShowInputDTO } from "../model/Show";
import { IdGenerator } from "../services/idGenerator";

export class ShowsBusiness {

    public addShow = async(show: ShowInputDTO): Promise<void> => {
        try {

            if (!show.weekDay && !show.startTime && !show.endTime && !show.bandId) {
                throw new MissingData();
            }

            if (!show.weekDay || (show.weekDay.toUpperCase() !== "FRIDAY" 
            && show.weekDay.toUpperCase() !== "SATURDAY" 
            && show.weekDay.toUpperCase() !== "SUNDAY")) {
                throw new InvalidWeekDay();
            };

            if (isNaN(show.startTime) || !Number.isInteger(show.startTime) || (show.startTime < 8 || show.startTime > 22)) {
                throw new InvalidStartTime();
            }

            if (isNaN(show.endTime) || !Number.isInteger(show.endTime) || (show.endTime < 9 || show.endTime > 23)) {
                throw new InvalidEndTime();
            }

            if (show.endTime <= show.startTime) {
                throw new BaseError(400, "End Time cannot be equal or before Start Time.")
            }

            const showsDatabase = new ShowsDatabase();
            const showsList = await showsDatabase.getShowsList(show.weekDay)

            for (let i = 0; i < showsList.length; i++) {
                if (showsList[i].getStartTime() === show.startTime) {
                    throw new BaseError(400, "There is already a booked show for this time on this day.")
                }

                if (showsList[i].getEndTime() === show.endTime) {
                    throw new BaseError(400, "There is already a booked show for this time on this day.")
                }
            }

            const bandsDatabase = new BandsDatabase()
            const isBandIdValid = await bandsDatabase.getBandByNameORId(show.bandId)
            if (!isBandIdValid) {
                throw new BandNotFound();
            }

            const idGenerator = new IdGenerator();
            const id = idGenerator.generate()

            await showsDatabase.addShow(id, show.weekDay, show.startTime, show.endTime, show.bandId)

        } catch (error:any) {
            throw new BaseError(error.statusCode, error.message)
        }
    }
}