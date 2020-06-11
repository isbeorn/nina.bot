const mathjs = require('mathjs');

class Fitting {
    constructor(formula, pointOfInterest) {
        this.pointOfInterest = pointOfInterest;

        if (formula) {
            this.formula = formula;
            this.fn = mathjs.compile(formula);
        }
    }

    getPoints(min, max) {
        const data = [];
        if (this.Formula) {
            const step = (max - min) / 100;
            for (let x = min; x <= max; x += step) {
                data.push({
                    x: x,
                    y: this.f(x)
                });
            }
        } else {
            data.push({
                x: this.PointOfInterest.Position,
                y: this.PointOfInterest.Value
            });
        }
        return data;
    }

    f(x) {
        return this.fn.evaluate({ x });
    }

    get Formula() {
        return this.formula;
    }

    get PointOfInterest() {
        return this.pointOfInterest;
    }
}

module.exports.Fitting = Fitting;
