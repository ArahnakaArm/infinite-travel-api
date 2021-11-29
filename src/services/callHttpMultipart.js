const CallHttpMultipart = async (method, url, body, token = null) => {

    let header = {}

    if (token) header = { ...header, 'Authorization': `Bearer ${token}` }

    try {
        const res = await fetch(url, {
            method: method,
            body: body,
            headers: header
        });

        const resJson = await res.json()

        return resJson;

    } catch (e) {
        return null
    }

}


export default CallHttpMultipart;