# GitNinja

GitNinja is a command-line tool that enhances your Git workflow with powerful techniques. It provides simplified commands and automations to make your Git experience more efficient and enjoyable.

## Installation

You can install GitNinja globally using npm:

```sh
npm install -g git-ninja
```

## Usage

### Configuration
Before using GitNinja, you need to configure it with your Gemini API key:

```sh
npx git-ninja config
```
Follow the on-screen instructions to enter your Gemini API key. The key will be stored securely on your machine.

### Committing Changes
To add all changes and commit:

```sh
npx git-ninja commit
```

You will be prompted to enter a commit message. If you leave it empty, GitNinja will use the Gemini AI to generate a commit message based on the changes.


### Pushing Changes
To add all changes, commit, and push to a branch:

```sh
npx git-ninja push
```

You will be prompted to enter a commit message and select the branch to push to.

