#!/usr/bin/env node

import { program } from 'commander';
import simpleGit from 'simple-git';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import os from 'os';
import { generateCommitMessage } from './ai.js';

const git = simpleGit();

program
    .command('config')
    .description('Setup GitNinja configuration')
    .action(async () => {
        try {
            const configPath = `${os.homedir()}/.gitninjaconfig`;
            if (fs.existsSync(configPath)) {
                console.log(chalk.yellow('Configuration already exists. Overwriting will delete the existing configuration.'));
                const { overwrite } = await inquirer.prompt({
                    type: 'confirm',
                    name: 'overwrite',
                    message: 'Do you want to overwrite the existing configuration?'
                });

                if (!overwrite) {
                    console.log(chalk.yellow('Exiting configuration...'));
                    return;
                }
            }

            const { apiKey } = await inquirer.prompt({
                type: 'input',
                name: 'apiKey',
                message: 'Enter your Gemini API key:'
            });

            // Save the API key to the config file
            fs.writeFileSync(configPath, `GEMINI_API_KEY=${apiKey}`, 'utf-8');
            console.log(chalk.green('Configuration saved successfully.'));
        } catch (error) {
            console.error(chalk.red('An error occurred during configuration:', error));
        }
    });

program
    .command('commit')
    .description('Add all changes and commit')
    .action(async () => {
        try {
            await git.add('.');
            let commitMessage = '';

            // Ask the user for a commit message
            const { message: userMessage } = await inquirer.prompt({
                type: 'input',
                name: 'message',
                message: 'Enter commit message (leave empty to generate from AI):'
            });

            if (userMessage.trim() === '') {
                // Use Gemini API to generate commit message
                const diff = await git.diff(['HEAD']);
                commitMessage = await generateCommitMessage(diff);
            } else {
                commitMessage = userMessage;
            }

            await git.commit(commitMessage);
            console.log(chalk.green('Commit successful!'));
        } catch (error) {
            console.error(chalk.red('An error occurred during commit:', error));
        }
    });

program
    .command('push')
    .description('Add all changes, commit, and push to a branch')
    .action(async () => {
        try {
            await git.add('.');
            let commitMessage = '';

            // Ask the user for a commit message
            const { message: userMessage } = await inquirer.prompt({
                type: 'input',
                name: 'message',
                message: 'Enter commit message (leave empty to generate from AI):'
            });

            if (userMessage.trim() === '') {
                // Use Gemini API to generate commit message
                const diff = await git.diff(['HEAD']);
                commitMessage = await generateCommitMessage(diff);
            } else {
                commitMessage = userMessage;
            }

            await git.commit(commitMessage);

            // Get list of local branches
            const branchList = await git.branchLocal();
            const branches = branchList.all;

            // Ask user to select a branch
            const { branch: selectedBranch } = await inquirer.prompt({
                type: 'list',
                name: 'branch',
                message: 'Select a branch to push to:',
                choices: branches
            });

            await git.push('origin', selectedBranch);
            console.log(chalk.green('Push successful!'));
        } catch (error) {
            console.error(chalk.red('An error occurred during push:', error));
        }
    });




program.parse(process.argv);
