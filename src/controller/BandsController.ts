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

    public getBandInfo = async (req: Request, res: Response) => {

        try {
            
            const search = {
                name: req.body.name,
                id: req.body.id
            }

            const bandsBusiness = new BandsBusiness();
            const result = await bandsBusiness.getBandInfo(search)

            res.status(200).send({result})
        } catch (error:any) {
            res.status(400).send({ error: error.message });
        }
    }
}