// Number.toFixed(2) doesn't work properly: 3.775 => 3.77
const round = value => Math.round(value * 100) / 100;

const groupBy = (list, keyGetter) => {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (collection) {
            collection.push(item);
        } else {
            map.set(key, [item]);
        }
    });
    return map;
};

const calculateAverage = (values) => {
    const sum = values.reduce((a, b) => a + b, 0);
    const average = sum / values.length;
    return round(average);
};

const calculateMedian = (values) => {
    let median;
    const middle = Math.floor(values.length / 2);
    if (values.length % 2 === 0) {
        median = calculateAverage([values[middle - 1], values[middle]]);
    } else {
        median = values[middle];
    }
    return round(median);
};

const calculateMode = (values) => {
    const countFrequencies = values.reduce(
        (acc, val) => acc.set(val, 1 + (acc.get(val) || 0)),
        new Map()
    );
    const frequencies = Array.from(countFrequencies.values());
    if ([...new Set(frequencies)].length === 1) {
        return [];
    }
    frequencies.sort((v1, v2) => v2 > v1);
    const maxFrequency = frequencies[0];
    const mode = [];
    countFrequencies.forEach((frequency, value) => {
        if (frequency === maxFrequency) {
            mode.push(round(value));
        }
    });
    mode.sort();
    return mode;
};

const calculateMetric = (sensors) => {
    const temperatures = sensors
        .map(s => s.temperature)
        .sort();
    return {
        id: sensors[0].id,
        average: calculateAverage(temperatures),
        median: calculateMedian(temperatures),
        mode: calculateMode(temperatures)
    };
};

const aggregate = (sensors) => {
    const temperatures = groupBy(sensors, sensor => sensor.id);
    return Array.from(temperatures.entries())
        .map(([id, values]) => calculateMetric(values))
        .sort((sensor1, sensor2) => sensor1.average > sensor2.average);
};


module.exports = sensors => aggregate(sensors);
