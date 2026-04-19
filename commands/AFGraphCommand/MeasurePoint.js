class MeasurePoint {
    constructor(point) {
        this.position = point.Position;
        this.value = point.Value;
        this.error = point.Error;
    }

    get Position() {
        return this.position;
    }

    get Value() {
        return this.value;
    }

    get Error() {
        return this.error;
    }
}

module.exports.MeasurePoint = MeasurePoint;
