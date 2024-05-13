#!/usr/bin/env node

import { program } from 'commander';
import simpleGit from 'simple-git';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import os from 'os';

const git = simpleGit();

program
    .command('commit')
    .description('Add all changes and commit')
    .action(async () => {
        try {
            await git.add('.');
            // You can implement AI-based commit message generation here
            const { message } = await inquirer.prompt({
                type: 'input',
                name: 'message',
                message: 'Enter commit message:'
            });
            await git.commit(message);
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
            const { message } = await inquirer.prompt({
                type: 'input',
                name: 'message',
                message: 'Enter commit message:'
            });
            await git.commit(message);
            const { branch } = await inquirer.prompt({
                type: 'input',
                name: 'branch',
                message: 'Enter branch name:'
            });
            await git.push('origin', branch);
            console.log(chalk.green('Push successful!'));
        } catch (error) {
            console.error(chalk.red('An error occurred during push:', error));
        }
    });

program
    .command('config')
    .description('Setup GitNinja configuration')
    .action(async () => {
        try {
            const configPath = `${os.homedir()}/.gitninjaconfig`;
            if (fs.existsSync(configPath)) {
                console.log(chalk.yellow('GitNinja is already configured.'));
                return;
            }

            const { apiKey } = await inquirer.prompt({
                type: 'input',
                name: 'apiKey',
                message: 'Enter your Gemini API key:'
            });

            // Save the API key to the config file
            fs.writeFileSync(configPath, apiKey);
            console.log(chalk.green('Configuration saved successfully.'));
        } catch (error) {
            console.error(chalk.red('An error occurred during configuration:', error));
        }
    });

program.parse(process.argv);
