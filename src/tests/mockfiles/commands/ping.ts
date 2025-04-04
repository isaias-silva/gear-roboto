import { CommanderFunction } from "../../../interfaces";

const ping: CommanderFunction = async (engine, author, args) => {

    console.log("pong")

}

export default ping;