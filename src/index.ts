import { join } from 'path';
import { SampleFile } from 'projen';
import { GitHub, GithubWorkflow } from 'projen/lib/github';
import { JobPermission, JobStep } from 'projen/lib/github/workflows-model';
import { PythonProject, PythonProjectOptions } from 'projen/lib/python';

export const codeCheckout: JobStep = {
  name: 'Checkout',
  id: 'checkout',
  uses: 'actions/checkout@v3',
};

export const precommitCi: JobStep = {
  name: 'Pre-Commit CI',
  id: 'ci',
  run: 'pip install pre-commit\npre-commit run -a',
};

export class PythonPrecommitCI extends GithubWorkflow {
  constructor(github: GitHub) {
    super(github, 'ci');
    this.on({
      pullRequest: {
        types: ['labeled', 'opened', 'synchronize', 'reopened'],
      },
    });

    this.addJob('CI', {
      runsOn: ['ubuntu-latest'],
      name: 'CI',
      steps: [
        codeCheckout,
        precommitCi,
      ],
      permissions: { contents: JobPermission.READ },
      defaults: { run: { shell: 'bash' } },
    });
  }
};

export interface PoetryPythonProjectOptions extends PythonProjectOptions {};

export class PoetryPythonProject extends PythonProject {
  constructor(options: PoetryPythonProjectOptions) {
    let devDeps = ['pylint', 'flake8', 'pydocstyle', 'pycodestyle', 'black', 'mypy', 'bandit'];
    if (options.devDeps) {
      devDeps = [...devDeps, ...options.devDeps];
    }

    super({
      ...options,
      pip: false,
      venv: false,
      setuptools: false,
      poetry: true,
      devDeps: devDeps,
    });

    this.gitignore.addPatterns('.DS_Store');
    new SampleFile(this, '.pre-commit-config.yaml', { sourcePath: join(__dirname, 'files', '.pre-commit-config.yaml') });
    new PythonPrecommitCI(this.github!);

  };
}
