const { cdk } = require('projen');

const project = new cdk.JsiiProject({
  author: 'Mike Gray',
  authorAddress: 'mike@graywind.org',
  defaultReleaseBranch: 'main',
  name: '@mikejgray/projen-python-base',
  repositoryUrl: 'https://github.com/mikejgray/projen-python-base.git',
  repository: 'https://github.com/mikejgray/projen-python-base.git',
  npmRegistryUrl: 'https://npm.pkg.github.com',

  peerDeps: ['projen@^0.66.7'],
  devDeps: ['projen@0.66.7'],
  description: 'A bit more refined basic Python project',
  jestOptions: { updateSnapshot: false },
  githubOptions: { mergify: true },
  workflowNodeVersion: '16',
});
project.compileTask.exec('cp src/pre-commit-config.yaml lib/pre-commit-config.yaml');

project.addFields({
  main: 'lib/index.js',
  types: 'lib/index.d.ts',
  public: true,
});

project.synth();
