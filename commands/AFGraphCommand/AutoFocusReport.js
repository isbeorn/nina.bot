const _ = require('lodash');

const { Fitting } = require('./Fitting');
const { MeasurePoint } = require('./MeasurePoint');

class AutoFocusReport {
    /**
     *
     * @param {object} data json data according to AFGraphSchema
     */
    constructor(data) {
        const points = [];

        data.MeasurePoints.forEach((p) => {
            points.push(new MeasurePoint(p));
        });

        points.sort((a, b) => {
            if (a.Position < b.Position) return -1;
            if (a.Position > b.Position) return 1;
            return 0;
        });

        this.measurePoints = _.uniqBy(points, (x) => x.Position);

        this.stepSize =
            this.measurePoints[1].Position - this.measurePoints[0].Position;
        this.minimumStep = _.minBy(points, (x) => x.Position).Position;
        this.maximumStep = _.maxBy(points, (x) => x.Position).Position;

        if (data.Temperature !== 'NaN') {
            this.temperature = data.Temperature.toFixed(2);
        } else {
            this.temperature = Number.NaN;
        }

        this.method = data.Method;
        this.fitting = data.Fitting;
        this.focusPoint = new MeasurePoint(data.CalculatedFocusPoint);

        this.filter = data.Filter || 'n.A.';

        this.quadraticFitting = new Fitting(
            _.get(data, 'Fittings.Quadratic'),
            data.Intersections.QuadraticMinimum
        );
        this.hyperbolicFitting = new Fitting(
            _.get(data, 'Fittings.Hyperbolic'),
            data.Intersections.HyperbolicMinimum
        );
        this.gaussianFitting = new Fitting(
            _.get(data, 'Fittings.Gaussian'),
            data.Intersections.GaussianMaximum
        );
        this.leftTrendFitting = new Fitting(
            _.get(data, 'Fittings.LeftTrend'),
            data.Intersections.TrendLineIntersection
        );
        this.rightTrendFitting = new Fitting(
            _.get(data, 'Fittings.RightTrend'),
            data.Intersections.TrendLineIntersection
        );
    }

    get MinimumStep() {
        return this.minimumStep;
    }

    get MaximumStep() {
        return this.maximumStep;
    }

    get StepSize() {
        return this.stepSize;
    }

    get FocusPoint() {
        return this.focusPoint;
    }

    get Method() {
        return this.method;
    }

    get Fitting() {
        return this.fitting;
    }

    get Temperature() {
        return this.temperature;
    }

    get Filter() {
        return this.filter;
    }

    get MeasurePoints() {
        return this.measurePoints;
    }

    get QuadraticFitting() {
        return this.quadraticFitting;
    }

    get HyperbolicFitting() {
        return this.hyperbolicFitting;
    }

    get GaussianFitting() {
        return this.gaussianFitting;
    }

    get LeftTrendFitting() {
        return this.leftTrendFitting;
    }

    get RightTrendFitting() {
        return this.rightTrendFitting;
    }
}

module.exports.AutoFocusReport = AutoFocusReport;
