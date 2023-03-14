import { BandsDatabase } from "../data/BandsDatabase";
import { BandAlreadyRegistered, InvalidMusicGenre, InvalidName, MissingData } from "../errors/BandsErrors";
import { BaseError } from "../errors/BaseError";
import { BandInputDTO } from "../model/Bands";
import { IdGenerator } from "../services/idGenerator";

export class BandsBusiness {

    public createBand = async (band: BandInputDTO): Promise<void> => {

        try {

            if (!band.name && !band.musicGenre && !band.responsible) {
                throw new MissingData()
            };

            if (!band.name || band.name.length < 2) {
                throw new InvalidName()
            };

            if (!band.musicGenre || band.musicGenre.length < 3) {
                throw new InvalidMusicGenre()
            }

            const bandsDatabase = new BandsDatabase()
            const isBandAlreadyRegistered = await bandsDatabase.getBandByName(band.name)
            if (isBandAlreadyRegistered !== null) {
                throw new BandAlreadyRegistered();
            }

            const idGenerator = new IdGenerator();
            const newId: string = idGenerator.generate();

            await bandsDatabase.createBand(newId, band.name, band.musicGenre, band.responsible)
    
        } catch (error:any) {
            throw new BaseError(error.statusCode, error.message)
        }
    }
}