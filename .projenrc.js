const { cdk } = require('projen');
const project = new cdk.JsiiProject({
  author: 'Mike Gray',
  authorAddress: 'mike@graywind.org',
  defaultReleaseBranch: 'main',
  name: 'projen-python-base',
  repositoryUrl: 'https://github.com/mike/projen-python-base.git',

  deps: ['projen'],
  description: 'A bit more refined basic Python project',
  jestOptions: { updateSnapshot: false },
  githubOptions: { mergify: true },
});

project.synth();
