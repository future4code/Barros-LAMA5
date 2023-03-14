import { Request, Response } from "express";
import { BandsBusiness } from "../business/BandsBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { BandInputDTO } from "../model/Bands";

export class BandsController {
   public registerBand = async (req: Request, res: Response) => {
        try {

            const input: BandInputDTO = {
                name: req.body.name,
                musicGenre: req.body.musicGenre,
                responsible: req.body.responsible
            }

            const bandsBusiness = new BandsBusiness();
            await bandsBusiness.createBand(input)

            res.status(200).send({ message: "Band registered!" });

        } catch (error:any) {
            res.status(400).send({ error: error.message });
        }

        await BaseDatabase.destroyConnection();
    };
}