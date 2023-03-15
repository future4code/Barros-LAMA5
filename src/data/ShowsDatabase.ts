import { Show } from "../model/Show";
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

    public getShowsList = async (input: string): Promise<Show[]> => {
        try {
            
            const shows = await this.getConnection()
            .select("*")
            .from(ShowsDatabase.TABLE_NAME)
            .where({week_day: input})

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
    }
    
}