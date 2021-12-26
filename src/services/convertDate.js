const ConvertDate =  (date) => {
    const MonthArr = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    const dateString = date.toString()
    const year = dateString.substring(0, 4);
    const monthStr = dateString.substring(5, 7);
    const month = MonthArr[parseInt(monthStr)-1]
    const day = dateString.substring(8, 10);
    const hour = dateString.substring(11, 13);
    const minute = dateString.substring(14, 16);
    const second = dateString.substring(17, 19);

    return `${day} ${month} ${year} ${hour}:${minute}:${second}`

}


export default ConvertDate;