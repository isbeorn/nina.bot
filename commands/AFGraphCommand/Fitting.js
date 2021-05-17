const mathjs = require('mathjs');

class Fitting {
    constructor(formula, pointOfInterest, measurePoints) {
        this.pointOfInterest = pointOfInterest;

        if (formula) {
            this.formula = formula;
            this.fn = mathjs.compile(formula);

            const actualXs = measurePoints.map((x) => x.Position);
            const actualYs = measurePoints.map((x) => x.Value);

            this.coefficient = this.getRSquared(actualXs, actualYs).rSquared;
        }
    }

    /**
     *
     * @param {Array} data
     * @returns {Object}
     */
    getRSquared(dataX, dataY) {
        var yAxis = dataY;
        var rPrediction = [];

        var meanValue = 0; // MEAN VALUE
        var SStot = 0; // THE TOTAL SUM OF THE SQUARES
        var SSres = 0; // RESIDUAL SUM OF SQUARES
        var rSquared = 0;

        // SUM ALL VALUES
        for (let n in yAxis) {
            meanValue += yAxis[n];
        }

        // GET MEAN VALUE
        meanValue = meanValue / yAxis.length;
        for (let n = 0; n < dataX.length; n++) {
            //for (var n in yAxis) {
            // CALCULATE THE SSTOTAL
            SStot += Math.pow(yAxis[n] - meanValue, 2);
            // REGRESSION PREDICTION
            rPrediction.push(this.f(dataX[n]));
            // CALCULATE THE SSRES
            SSres += Math.pow(rPrediction[n] - yAxis[n], 2);
        }

        // R SQUARED
        rSquared = 1 - SSres / SStot;

        return {
            meanValue: meanValue,
            SStot: SStot,
            SSres: SSres,
            rSquared: rSquared
        };
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

    get CorrelationCoefficient() {
        return Math.round(this.coefficient * 100) / 100;
    }
}

module.exports.Fitting = Fitting;
