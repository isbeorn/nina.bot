class MeasurePoint {
    constructor(point, order) {
        this.position = point.Position;
        this.value = point.Value;
        this.error = point.Error;
        this.order = order;
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

    get Order() {
        return this.order;
    }
}

module.exports.MeasurePoint = MeasurePoint;
