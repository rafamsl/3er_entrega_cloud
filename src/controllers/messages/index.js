import { MessagesDao } from "../../dao/index.js"

async function saveMsg(msg){
    await MessagesDao.save(msg)
}

async function getAll(){
    const allMsg = await MessagesDao.getAll()
    return allMsg
}

export const MessageController = {saveMsg, getAll}