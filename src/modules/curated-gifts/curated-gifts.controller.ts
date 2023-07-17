import { inject, injectable } from "inversify";
import { ICuratedGiftsService, Types } from "./curated-gifts.interface";
import { Response } from "express";
import { AuthRequest } from "../auth/auth.interface";


@injectable()
export default  class CuratedGiftsController {
    constructor(@inject(Types.ICuratedGiftsService)private readonly service: ICuratedGiftsService){}

    getCuratedGifts = async(req:AuthRequest, res:Response)=>{
        const id = req.params.id;
        const curatedGifts = await this.service.getCuratedGifts(id);
        return res.status(200).json({success:true, data:curatedGifts});
    }

    getAllCuratedGifts = async(req:AuthRequest, res:Response)=>{
        const curatedGifts  = await this.service.getallCuratedGifts();
        return res.status(200).json({success:true, data:curatedGifts});
    }
}