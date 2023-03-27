import { BandsDatabase } from "../data/BandsDatabase";
import { BaseDatabase } from "../data/BaseDatabase";
import { BandAlreadyRegistered, BandNotFound, InvalidMusicGenre, InvalidName, MissingData } from "../errors/BandsErrors";
import { BaseError } from "../errors/BaseError";
import { Unauthorized } from "../errors/UserErrors";
import { Band, BandInputDTO } from "../model/Bands";
import { IdGenerator } from "../services/idGenerator";

export class BandsBusiness {

    public createBand = async (role: string, band: BandInputDTO): Promise<void> => {

        try {

            if (role !== "ADMIN") {
                throw new Unauthorized();
            }

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
            const isBandAlreadyRegistered = await bandsDatabase.getBandByNameORId(band.name)
            if (isBandAlreadyRegistered !== null) {
                throw new BandAlreadyRegistered();
            }

            const idGenerator = new IdGenerator();
            const newId: string = idGenerator.generate();

            await bandsDatabase.createBand(newId, band.name, band.musicGenre, band.responsible)
    
        } catch (error:any) {
            throw new BaseError(error.statusCode, error.message)
        }
    };

    public getBandInfo = async (search: any): Promise<Band> => {

        try {

            let searchParameter: string = ""

            if (!search.name && !search.id) {
                throw new BaseError(400, "Please inform at least one parameter to continue.")
            }

            if (search.name) {
                searchParameter = search.name
            } else {
                searchParameter = search.id
            }


            const bandsDatabase = new BandsDatabase()
            const result = await bandsDatabase.getBandByNameORId(searchParameter)

            if (!result) {
                throw new BandNotFound();
            }

            return result

        } catch (error:any) {
            throw new BaseError(error.statusCode, error.message)
        }
    };
}