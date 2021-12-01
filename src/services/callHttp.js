const CallHttp = async (method, url, body, token = null) => {

    let header = {
        'Content-Type': 'application/json',
    }



    if (token) header = { ...header, 'Authorization': `Bearer ${token}` }

    try {
        let res; 
        if(method === 'GET'){
             res = await fetch(url, {
                method: method,
                headers: header
            });
        }
        else {
            res = await fetch(url, {
                method: method,
                body: JSON.stringify(body),
                headers: header
            });
        }

   

        const resJson = await res.json()

        return resJson;

    } catch (e) {
        console.log(e)
        return null
    }

}


export default CallHttp;