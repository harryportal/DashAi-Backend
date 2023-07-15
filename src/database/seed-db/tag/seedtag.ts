import logger from "../../../utils/logging/winston"
import { prisma } from "../../prisma.service"
import { tags } from "./seedtag-json"

const createTag = async()=>{
    for (const tag of tags){
        await prisma.tag.create({
            data: tag
        })
    }
}

export const seedTag = async()=>{
    try{
        await createTag();
        logger.info("Successfully Added Dummy Tags to the Database");
    }catch(err:any){
        logger.error("Error adding tags to the Database", err);
    }
}

seedTag();

