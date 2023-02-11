const { cdk } = require('projen');
const { GithubCredentials } = require('projen/lib/github');
const { NpmAccess } = require('projen/lib/javascript');

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
  npmAccess: NpmAccess.PUBLIC,
  depsUpgradeOptions: {
    workflowOptions: {
      projenCredentials:
        GithubCredentials.fromPersonalAccessToken('GITHUB_TOKEN'),
    },
  },
  autoApproveUpgrades: true,
  autoApproveOptions: { allowedUsernames: ['github-actions'] },
});
project.compileTask.exec(
  'cp src/pre-commit-config.yaml lib/pre-commit-config.yaml',
);

const upgradeMain = project.tryFindObjectFile('.github/workflows/upgrade-main.yml');
upgradeMain.addOverride('jobs.pr.steps.4.with.token', '${{ secrets.GITHUB_TOKEN }}');
upgradeMain.addOverride('jobs.pr.permissions.pull-requests', 'write');
upgradeMain.addOverride('jobs.pr.permissions.contents', 'write');

project.addFields({
  main: 'lib/index.js',
  types: 'lib/index.d.ts',
});

project.synth();
