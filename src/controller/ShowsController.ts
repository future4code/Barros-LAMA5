import { Request, Response } from "express";
import { ShowsBusiness } from "../business/ShowsBusiness";
import { ShowInputDTO } from "../model/Show";

export class ShowsController {
    
    public addShow = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: ShowInputDTO = {
                weekDay: req.body.weekDay,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                bandId: req.body.bandId
            }

            const showsBusiness = new ShowsBusiness();
            await showsBusiness.addShow(input)

            res.status(200).send({message: "Show added successfully!"})
        } catch (error:any) {
            res.status(400).send({ error: error.message });
        }
    };

    public getShowsByDay = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: string = req.params.weekDay
            const showsBusiness = new ShowsBusiness()

            const result = await showsBusiness.getShowsByDay(input)

            res.status(200).send(result)
        } catch (error:any) {
            res.status(400).send({ error: error.message });
        }
    }
}