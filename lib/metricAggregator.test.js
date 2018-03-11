const aggregate = require('./metricAggregator');

const newSensor = (id, timestamp, temperature) => ({
    id, timestamp, temperature
});

const newMetric = (id, average, median, mode) => ({
    id, average, median, mode
});

test('should return empty list for empty sensors', () => {
    const metrics = aggregate([]);
    expect(metrics).toEqual([]);
});

test('should return single metric with same id and temperature for single sensor', () => {
    const id = 'id';
    const temperature = 1.0;
    const sensor = newSensor(id, 1, temperature);
    const metrics = aggregate([sensor]);
    const metric = newMetric(id, temperature, temperature, []);
    expect(metrics).toEqual([metric]);
});

test('should group sensors by id', () => {
    const id1 = 'id1';
    const id2 = 'id2';
    const metrics = aggregate([
        newSensor(id1, 0, 0),
        newSensor(id2, 1, 1),
        newSensor(id1, 2, 2)
    ]);
    expect(metrics).toHaveLength(2);
    expect(metrics[0].id).toEqual(id1);
    expect(metrics[1].id).toEqual(id2);
});

test('should order sensors by average', () => {
    const id1 = 'id1';
    const id2 = 'id2';
    const id3 = 'id3';
    const metrics = aggregate([
        newSensor(id1, 3, 3),
        newSensor(id2, 1, 1),
        newSensor(id3, 2, 2)
    ]);
    expect(metrics).toHaveLength(3);
    expect(metrics[0].id).toEqual(id2);
    expect(metrics[1].id).toEqual(id3);
    expect(metrics[2].id).toEqual(id1);
});

test('should count average metric for non zero temperature', () => {
    const metrics = aggregate([
        newSensor('id', 1, 1),
        newSensor('id', 1, 2),
        newSensor('id', 1, 3)
    ]);
    expect(metrics).toHaveLength(1);
    expect(metrics[0].average).toEqual(2.0);
});

test('should count average metric for zero temperature', () => {
    const metrics = aggregate([
        newSensor('id', 1, 0),
        newSensor('id', 1, 0),
        newSensor('id', 1, 0)
    ]);
    expect(metrics).toHaveLength(1);
    expect(metrics[0].average).toEqual(0.0);
});

test('should count median metric for non zero odd temperature', () => {
    const metrics = aggregate([
        newSensor('id', 1, 1),
        newSensor('id', 1, 2),
        newSensor('id', 1, 3)
    ]);
    expect(metrics).toHaveLength(1);
    expect(metrics[0].average).toEqual(2.0);
});

test('should count median metric for non zero even temperature', () => {
    const metrics = aggregate([
        newSensor('id', 1, 1),
        newSensor('id', 1, 2),
        newSensor('id', 1, 3),
        newSensor('id', 1, 4)
    ]);
    expect(metrics).toHaveLength(1);
    expect(metrics[0].median).toEqual(2.5);
});

test('should count median metric for zero temperature', () => {
    const metrics = aggregate([
        newSensor('id', 1, 0),
        newSensor('id', 1, 0),
        newSensor('id', 1, 0)
    ]);
    expect(metrics).toHaveLength(1);
    expect(metrics[0].median).toEqual(0.0);
});

test('should count mode metric for non zero non repeat temperature', () => {
    const metrics = aggregate([
        newSensor('id', 1, 1),
        newSensor('id', 1, 2),
        newSensor('id', 1, 3)
    ]);
    expect(metrics).toHaveLength(1);
    expect(metrics[0].mode).toEqual([]);
});

test('should count mode metric for non zero single repeat temperature', () => {
    const metrics = aggregate([
        newSensor('id', 1, 1),
        newSensor('id', 1, 2),
        newSensor('id', 1, 2)
    ]);
    expect(metrics).toHaveLength(1);
    expect(metrics[0].mode).toEqual([2.0]);
});

test('should count mode metric for non zero multi repeat temperature', () => {
    const metrics = aggregate([
        newSensor('id', 1, 1),
        newSensor('id', 1, 1),
        newSensor('id', 1, 2),
        newSensor('id', 1, 2),
        newSensor('id', 1, 3)
    ]);
    expect(metrics).toHaveLength(1);
    expect(metrics[0].mode).toEqual([1.0, 2.0]);
});

test('should order mode metric', () => {
    const metrics = aggregate([
        newSensor('id', 1, 2),
        newSensor('id', 1, 1),
        newSensor('id', 1, 2),
        newSensor('id', 1, 1),
        newSensor('id', 1, 3)
    ]);
    expect(metrics).toHaveLength(1);
    expect(metrics[0].mode).toEqual([1.0, 2.0]);
});

test('should count mode metric for zero temperature', () => {
    const metrics = aggregate([
        newSensor('id', 1, 0),
        newSensor('id', 1, 0),
        newSensor('id', 1, 0)
    ]);
    expect(metrics).toHaveLength(1);
    expect(metrics[0].mode).toEqual([]);
});

test('should round metrics to 2 decimal points', () => {
    const metrics = aggregate([
        newSensor('id', 1, 1.155),
        newSensor('id', 1, 1.155)
    ]);
    const expected = 1.16;
    expect(metrics).toHaveLength(1);
    expect(metrics[0].average).toEqual(expected);
    expect(metrics[0].median).toEqual(expected);
});
