class MyDate {
    constructor(dateString) {
        this.date = new Date(dateString);
    }

    getYear() {
        return this.date.getFullYear();
    }

    getMonth() {
        return ('0' + (this.date.getMonth() + 1)).slice(-2);
    }

    getDay() {
        return ('0' + this.date.getDate()).slice(-2);
    }

    getFormattedDate() {
        return `${this.getYear()}-${this.getMonth()}-${this.getDay()}`
    }
}

export default MyDate;