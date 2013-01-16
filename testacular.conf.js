reporters = ['coverage', 'progress', 'junit'];

files = [
  JASMINE,
  JASMINE_ADAPTER,
  '**/src/scoped-event.js',
  '**/src-test/jasmine-matchers-1.0.js',
  '**/src-test/scoped-event.test.js'
];

preprocessors = {
  '**/src/scoped-event.js': 'coverage'
};

coverageReporter = {
  type : 'html',
  dir : 'src-test/coverage/'
};

browsers = ['PhantomJS'];

// run on save
autoWatch = false;
singleRun = true;

// system
port = 7357;
runnerPort = 9100;
captureTimeout = 5000;

// stdout
logLevel = LOG_INFO;
colors = true;

junitReporter = {
  outputFile: 'src-test/test-results.xml'
};
