import { giftsJson } from "./seedgifts-json";
import { prisma } from "../../prisma.service";
import logger from "../../../utils/logging/winston";

const addGift = async()=>{
    for(const gift of giftsJson){
        const {curatedListId, tagsId, ...giftData} = gift
        await prisma.gift.create({
            data:{ ...giftData, 
                curatedgifts:{connect: {id:curatedListId}},
                tags: {connect:tagsId}
        }})
    }
} 

const seedGifts = async()=>{
    try{
        await addGift();
        logger.info("Successfully added Dummy gifts to database")
    }catch(err:any){
        logger.error("Error adding dummy gifts to database", err)
    }
}

seedGifts();