import { DATE_UTILS } from "../../utils/date-utils.js";

const user = {email:"123", password:123, date: '1990-04-03T00:00:00.000Z'}

const filteredUser = Object.fromEntries(Object.entries(user).filter(([key]) => key !== "password"));
filteredUser.date = DATE_UTILS.formatTimestamp(filteredUser.date)

console.log(filteredUser)