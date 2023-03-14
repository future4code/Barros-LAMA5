import { Band } from "../model/Bands";
import { BaseDatabase } from "./BaseDatabase";

export class BandsDatabase extends BaseDatabase {

    private static TABLE_NAME = "LAMA_Bands";

    public createBand = async (id: string, name: string, musicGenre: string, responsible: string): Promise<void> => {

        const newBand = {
            id: id,
            name: name,
            music_genre: musicGenre,
            responsible: responsible
        }

        try {
            await this.getConnection().insert(newBand).into(BandsDatabase.TABLE_NAME)
        } catch (error:any) {
            throw new Error(error.sqlMessage || error.message);
        }
    };

    public getBandByNameORId = async (info: string): Promise<Band | null> => {

        try {

            const result = await this.getConnection()
            .select("*")
            .from(BandsDatabase.TABLE_NAME)
            .where({name: info})
            .orWhere({id: info})

            if (result.length < 1) {
                return null
            }

            return Band.toBandModel(result[0]);

        } catch (error:any) {
            throw new Error(error.sqlMessage || error.message);
        }

    };

}