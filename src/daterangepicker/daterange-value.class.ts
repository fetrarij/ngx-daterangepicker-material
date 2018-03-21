export class DaterangeValue {
    startDate: object|string;
    endDate: object|string;
    constructor(startDate?, endDate?) {
        if (startDate) {
            this.startDate = startDate;
        }
        if (endDate) {
            this.endDate = endDate;
        }
    }
}