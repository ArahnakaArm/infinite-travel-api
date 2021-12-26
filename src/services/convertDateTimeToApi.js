const ConvertDateTimeToApi =  (datetime) => {
    let newDate = datetime.replace("T", " ");
    newDate = newDate + ":00.000"
    return newDate
}

export default ConvertDateTimeToApi;