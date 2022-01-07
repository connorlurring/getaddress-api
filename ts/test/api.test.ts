import GetAddress from "../Client"
import "isomorphic-fetch"; 

const apiKey:string = process.env.getaddress_apikey as string;


 test('autocomplete is success', async () => {
    let getAddress = new GetAddress(apiKey);
    let result = await getAddress.autocomplete('TR19 7AA');
    expect(result.isSuccess).toBe(true);
});


