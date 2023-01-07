import { synthSnapshot } from 'projen/lib/util/synth';
import { PoetryPythonProject } from '../src';

function getTestProject(options?: any) {
  return new PoetryPythonProject({
    moduleName: 'test',
    name: 'test',
    authorName: 'Zaphod Beeblebrox',
    authorEmail: 'zaphod@beeblebrox.universe',
    version: '0.0.0',
    ...options,
  });
};

describe('snapshots', () => {
  const project = getTestProject();
  const snap = synthSnapshot(project);

  test('Overall snapshot', () => {
    expect(snap).toMatchSnapshot();
  });

  test('precommit file exists', () => {
    expect(snap['.pre-commit-config.yaml']).toBeDefined();
  });

  test('pyproject.toml exists', () => {
    expect(snap['pyproject.toml']).toBeDefined();
  });

  test('ci workflow exists', () => {
    expect(snap['.github/workflows/ci.yml']).toBeDefined();
  });

  test('dev dependencies are set', () => {
    expect(JSON.stringify(snap['.projen/deps.json'])).toMatch('black');
    expect(JSON.stringify(snap['.projen/deps.json'])).toMatch('pylint');
    expect(JSON.stringify(snap['.projen/deps.json'])).toMatch('flake8');
    expect(JSON.stringify(snap['.projen/deps.json'])).toMatch('pycodestyle');
    expect(JSON.stringify(snap['.projen/deps.json'])).toMatch('pydocstyle');
    expect(JSON.stringify(snap['.projen/deps.json'])).toMatch('mypy');
    expect(JSON.stringify(snap['.projen/deps.json'])).toMatch('bandit');
  });

});
