const DateTimeString = (date)=>{    
    var monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours();
    var mins = date.getMinutes();
    var ampm = hour >= 12 ? 'pm' : 'am';

    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    mins = (mins < 10) ? (`0${mins}`) : mins;
    var strTime = hour + ':' + mins + ' ' + ampm;

    if(!day || !monthNames[monthIndex] || !year || !hour || !mins || !ampm)
    {
        return '';
    }

    // return `${day} ${monthNames[monthIndex]} ${year} - ${hour}:${mins}${ampm}`;
    return `${DateString(date)} - ${hour}:${mins}${ampm}`
}

const DateString = (date)=>{    
    let day = date.getDate();
    let month = date.getMonth();
    let year = `${date.getFullYear()}`.substr(2);

    if(!day || !month || !year)
    {
        return '';
    }
    return `${day}/${month}/${year}`;   
}

module.exports = { DateTimeString, DateString }