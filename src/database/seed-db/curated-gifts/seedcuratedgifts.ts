import { curatedgiftsJson } from "./seedcuratedgifts-json";
import { prisma } from "../../prisma.service";
import logger from "../../../utils/logging/winston";

const addGifts = async()=>{
    for(const gift of curatedgiftsJson){
        await prisma.curatedGifts.create({
            data:gift
        })
    }
} 

const seedCuratedGifts = async()=>{
    try{
        await addGifts();
        logger.info("Successfully added Dummy gifts to database")
    }catch(err:any){
        logger.error("Error adding dummy gifts to database", err)
    }
}

seedCuratedGifts();