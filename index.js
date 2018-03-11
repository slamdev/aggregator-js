#!/usr/bin/env node

const parseArgs = require('./lib/argsParser');
const readSensors = require('./lib/sensorReader');
const aggregateMetrics = require('./lib/metricAggregator');
const writeMetrics = require('./lib/metricWriter');

parseArgs
    .then(readSensors)
    .then(aggregateMetrics)
    .then(metrics => writeMetrics(process.stdout, metrics))
    .catch(e => console.error(e.message));
