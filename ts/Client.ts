import {GetFailed, Result,AutocompleteOptions, Suggestion,
    AutocompleteSuccess, AutocompleteAddress,GetSuccess, AutocompleteFailed,FindAddresses,FindSuccess,FindFailed} from "./Types"
    


class Client
{
    
    constructor(readonly api_key:string, 
        readonly autocomplete_url:string = "https://api.getaddress.io/autocomplete/{query}",
        readonly get_url:string = "https://api.getaddress.io/get/{id}")
    {
       

    }

    async autocomplete(query:string, options:AutocompleteOptions = AutocompleteOptions.Default()):Promise<Result<AutocompleteSuccess,AutocompleteFailed>> 
    {
        try{
            
            let url = this.autocomplete_url.replace(/{query}/i,query);

            if(this.api_key){
                if(url.includes('?')){
                    url = url+ '&api-key='+ this.api_key;
                }
                else{
                    url = url+ '?api-key='+ this.api_key;
                }
            }

            const response = await fetch(url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(options, (key, value) => {
                    if (value)
                        return value;
                })
            });
    
            if(response.status == 200){
                const json:any = await response.json();
                const suggestions =  json.suggestions as Suggestion[];
                return new AutocompleteSuccess(suggestions);
            }
 
            const json:any = await response.json();
            return new AutocompleteFailed(response.status,json.Message);
         }
         catch(err:unknown)
         {
            if(err instanceof Error)
            {
                return new AutocompleteFailed(401,err.message);
            }

            return new AutocompleteFailed(401,'Unauthorised');
         }
    }

    
    async get(id:string):Promise<Result<GetSuccess,GetFailed>> 
    {
        try{
            
            let url = this.get_url.replace(/{id}/i,id);
            
            if(this.api_key){
                if(url.includes('?')){
                    url = url+ '&api-key='+ this.api_key;
                }
                else{
                    url = url+ '?api-key='+ this.api_key;
                }
            }

            const response = await fetch(url,{
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if(response.status == 200){
                const json:any = await response.json();
                const address =  json as AutocompleteAddress;
                return new GetSuccess(address);
            }
 
            const json:any = await response.json();
            return new GetFailed(response.status,json.Message);
         }
         catch(err:unknown)
         {
            if(err instanceof Error)
            {
                return new GetFailed(401,err.message);
            }

            return new GetFailed(401,'Unauthorised');
         }
    }

    async find(postcode:string):Promise<Result<FindSuccess,FindFailed>> 
    {
        try{
            
            const response = await fetch(`https://api.getaddress.io/find/${postcode}?api-key=${this.api_key}&expand=true`);
    
            if(response.status == 200){
                const json:any = await response.json();
                const addresses =  json as FindAddresses;
                return new FindSuccess(addresses);
            }
 
            const json:any = await response.json();
            return new FindFailed(response.status,json.Message);
         }
         catch(err:unknown)
         {
            if(err instanceof Error)
            {
                return new FindFailed(401,err.message);
            }

            return new FindFailed(401,'Unauthorised');
         }
    }
}



export {Client as default,GetFailed, Result,AutocompleteOptions, Suggestion,
    AutocompleteSuccess, AutocompleteAddress,GetSuccess, AutocompleteFailed,FindAddresses,FindSuccess,FindFailed }
