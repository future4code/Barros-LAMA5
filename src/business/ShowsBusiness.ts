import { BandsDatabase } from "../data/BandsDatabase";
import { ShowsDatabase } from "../data/ShowsDatabase";
import { BaseError } from "../errors/BaseError";
import { BandNotFound, InvalidEndTime, InvalidStartTime, InvalidWeekDay, MissingData } from "../errors/ShowsErrors";
import { Unauthorized } from "../errors/UserErrors";
import { Show, ShowDayOutputDTO, ShowInputDTO } from "../model/Show";
import { IdGenerator } from "../services/idGenerator";

export class ShowsBusiness {

    public addShow = async(role: string, show: ShowInputDTO): Promise<void> => {
        try {

            if (role !== "ADMIN") {
                throw new Unauthorized();
            }

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
            const showsList = await showsDatabase.getAllShows()

            for (let i = 0; i < showsList.length; i++) {
                if (showsList[i].getWeekDay() === show.weekDay.toUpperCase() && showsList[i].getStartTime() === show.startTime) {
                    throw new BaseError(400, "There is already a booked show for this time on this day.")
                }

                if (showsList[i].getWeekDay() === show.weekDay.toUpperCase() && showsList[i].getEndTime() === show.endTime) {
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
    };

    public getShowsByDay = async (input: string): Promise<ShowDayOutputDTO> => {
        try {

            if (!input || input === ":weekDay" || (input.toUpperCase() !== "FRIDAY" 
            && input.toUpperCase() !== "SATURDAY" 
            && input.toUpperCase() !== "SUNDAY")) {
                throw new InvalidWeekDay();
            }

            const showsDatabase = new ShowsDatabase()
            const result = await showsDatabase.getShowsByDay(input)

            if (result.shows.length < 1) {
                throw new BaseError(400, "No shows confirmed for this day yet.")
            }

            return result
        } catch (error:any) {
            throw new BaseError(error.statusCode, error.message)
        }
    };

    getAllShows = async(): Promise<Show[]> => {
        try {
            const showsDatabase = new ShowsDatabase();
            const result = await showsDatabase.getAllShows()

            return result
        } catch (error:any) {
            throw new BaseError(error.statusCode, error.message)
        }
    }
}