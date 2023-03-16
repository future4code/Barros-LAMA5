import { Show, ShowDayOutputDTO } from "../model/Show";
import { BandsDatabase } from "./BandsDatabase";
import { BaseDatabase } from "./BaseDatabase";

export class ShowsDatabase extends BaseDatabase {

    private static TABLE_NAME = "LAMA_Shows";

    public addShow = async (id: string, weekDay: string, startTime: number, endTime: number, bandId: string): Promise<void> => {

        const newShow = {
            id: id,
            week_day: weekDay,
            start_time: startTime,
            end_time: endTime,
            band_id: bandId
        }

        try {

            await this.getConnection()
            .insert(newShow)
            .into(ShowsDatabase.TABLE_NAME)
            
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    };

    public getAllShows = async (): Promise<Show[]> => {
        try {
            
            const shows = await this.getConnection()
            .select("*")
            .from(ShowsDatabase.TABLE_NAME)

            const allShows: Show[] = []

            for (let i = 0; i < shows.length; i++) {
                const thisShow = {
                    id: shows[i].id,
                    weekDay: shows[i].week_day, 
                    startTime: shows[i].start_time, 
                    endTime: shows[i].end_time, 
                    bandId: shows[i].band_id

                }
                
                allShows.push(...allShows, Show.toShowsModel(thisShow))
            }

            return allShows

        } catch (error:any) {
            throw new Error(error.sqlMessage || error.message);
        }
    };

    public getShowsByDay = async (input: string): Promise<ShowDayOutputDTO> => {
        try {
            const showsByDay = await this.getConnection()
            .select("*")
            .from(ShowsDatabase.TABLE_NAME)
            .where({week_day: input})
            .orderBy("LAMA_Shows.start_time")

            const bandsList: ShowDayOutputDTO = {
                weekDay: input.toUpperCase(),
                shows: []
            }

            const bandsDatabase = new BandsDatabase()

            for (let i = 0; i < showsByDay.length; i++) {
                const band = await bandsDatabase.getBandByNameORId(showsByDay[i].band_id)
                bandsList.shows.push({
                    bandName: band?.getName(),
                    musicGenre: band?.getMusicGenre(),
                    startTime: showsByDay[i].start_time,
                    endTime: showsByDay[i].end_time
                })
            }

            return bandsList
            
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }    
}