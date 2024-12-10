const express = require('express');
const app = express();
const fs = require('fs');
const ExpressError = require('./expressError');

const { 
  convertAndValidateNumsArray, 
  findMode, 
  findMean, 
  findMedian 
} = require('./helpers');

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get('/mean', function(req, res, next) {
  if (!req.query.nums) {
    throw new ExpressError('You must pass a query key of nums with a comma-separated list of numbers.', 400);
  }

  let numsAsStrings = req.query.nums.split(',');
  let nums = convertAndValidateNumsArray(numsAsStrings);
  if (nums instanceof Error) {
    throw new ExpressError(nums.message, 400);
  }

  let mean = findMean(nums);

  if (req.query.round === 'true') {
    mean = Math.round(mean);
  }

  return res.json({
    operation: "mean",
    input: nums,
    result: mean
  });
});

app.get('/median', function(req, res, next) {
  if (!req.query.nums) {
    throw new ExpressError('You must pass a query key of nums with a comma-separated list of numbers.', 400);
  }

  let numsAsStrings = req.query.nums.split(',');
  let nums = convertAndValidateNumsArray(numsAsStrings);
  if (nums instanceof Error) {
    throw new ExpressError(nums.message, 400);
  }

  return res.json({
    operation: "median",
    input: nums,
    result: findMedian(nums)
  });
});

app.get('/mode', function(req, res, next) {
  if (!req.query.nums) {
    throw new ExpressError('You must pass a query key of nums with a comma-separated list of numbers.', 400);
  }

  let numsAsStrings = req.query.nums.split(',');
  let nums = convertAndValidateNumsArray(numsAsStrings);
  if (nums instanceof Error) {
    throw new ExpressError(nums.message, 400);
  }

  return res.json({
    operation: "mode",
    input: nums,
    result: findMode(nums)
  });
});

app.get('/range', function(req, res, next) {
  if (!req.query.nums) {
    throw new ExpressError('You must pass a query key of nums with a comma-separated list of numbers.', 400);
  }

  let numsAsStrings = req.query.nums.split(',');
  let nums = convertAndValidateNumsArray(numsAsStrings);
  if (nums instanceof Error) {
    throw new ExpressError(nums.message, 400);
  }

  const range = Math.max(...nums) - Math.min(...nums);

  return res.json({
    operation: "range",
    input: nums,
    result: range
  });
});

app.get('/all', function(req, res, next) {
  if (!req.query.nums) {
    throw new ExpressError('You must pass a query key of nums with a comma-separated list of numbers.', 400);
  }

  let numsAsStrings = req.query.nums.split(',');
  let nums = convertAndValidateNumsArray(numsAsStrings);
  if (nums instanceof Error) {
    throw new ExpressError(nums.message, 400);
  }

  const result = {
    operation: "all",
    input: nums,
    mean: findMean(nums),
    median: findMedian(nums),
    mode: findMode(nums),
    timestamp: new Date().toISOString()
  };

  if (req.query.save === 'true') {
    fs.writeFileSync('results.json', JSON.stringify(result, null, 2));
  }

  return res.json(result);
});

/** General error handler */
app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

app.listen(3000, function() {
  console.log(`Server starting on port 3000`);
});
