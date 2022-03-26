const mathjs = require('mathjs');

class Fitting {
    constructor(formula, pointOfInterest, measurePoints, rSquare) {
        this.pointOfInterest = pointOfInterest;

        if (formula) {
            this.formula = formula;
            this.fn = mathjs.compile(formula.replace(/²/g, '^2').replace(/³/g, '^3'));

            const actualXs = measurePoints.map((x) => x.Position);
            const actualYs = measurePoints.map((x) => x.Value);

            if(rSquare) {
                this.coefficient = rSquare;
            } else {
                this.coefficient = this.getRSquared(actualXs, actualYs);
            }            
        }
    }

    /**
     *
     * @param {Array} data
     * @returns {Object}
     */
    getRSquared(dataX, yAxis) {
        if (yAxis.length > 0) {
            const meanValue = mathjs.mean(yAxis);

            let SStot = 0; // total sum of squares
            let SSres = 0; // residual sum of squares
            for (let n = 0; n < dataX.length; n++) {
                const actualY = yAxis[n];
                SStot += Math.pow(actualY - meanValue, 2);

                const x = dataX[n];
                const prediction = this.f(x);

                SSres += Math.pow(prediction - actualY, 2);
            }

            // R²
            let rSquared = 1 - SSres / SStot;
            if(rSquared > 1) { rSquared = NaN; }
            return rSquared;
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

    get RSquared() {
        return Math.round(this.coefficient * 100) / 100;
    }
}

module.exports.Fitting = Fitting;
