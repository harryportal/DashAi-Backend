import { curatedgiftsJson } from "./seedcuratedgifts-json";
import { prisma } from "../../prisma";
import logger from "../../../logging/winston";

const addGifts = async()=>{
    for(const gift of curatedgiftsJson){
        await prisma.curatedGift.create({
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