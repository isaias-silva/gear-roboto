import { CommanderFunction } from "../../../interfaces";

const hello: CommanderFunction = async (engine, author, args) => {

    console.log("hello world")

}

export default hello;