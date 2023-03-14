import express from "express";
import { BandsController } from "../controller/BandsController";

export const bandsRouter = express.Router()
const bandsController = new BandsController();

bandsRouter.post("/register", bandsController.registerBand)