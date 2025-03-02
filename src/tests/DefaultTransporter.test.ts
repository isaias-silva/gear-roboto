import { DefaultTransporter } from "../core/transporters/DefaultTransporter"

describe("test default transporter",()=>{
    let transporter:DefaultTransporter
    beforeEach(()=>{
        transporter= new DefaultTransporter()
    })

    test("defined",()=>{
        expect(transporter).toBeDefined()
    })
})