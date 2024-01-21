const config = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github',
    [
      '@sematic-release/git',
      {
        assets: ['dist/*'],
        message: 'chore(release): ${nextRelease.version} [skip ci] \n\n${nextRelease.notes}',
      },
    ],
  ],
};

module.exports = config;
