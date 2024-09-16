module.exports = {
  '**/*.(md|json)': (filenames) => [
    `npx prettier --write ${filenames.join(' ')}`,
  ],
  '**/*.(ts|tsx)': () => ['npx tsc --noEmit'],
  'src/**/*.(ts|tsx|js|jsx)': (filenames) => [
    `npx eslint --fix ${filenames.map((filename) => `${filename}`).join(' ')}`,
    `npx prettier --write ${filenames
      .map((filename) => `${filename}`)
      .join(' ')}`,
  ],
};
