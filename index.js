#!/usr/bin/env node

const { program } = require('commander');
const simpleGit = require('simple-git');
const inquirer = require('inquirer');
// import inquirer from 'inquirer';
const fs = require('fs');
const os = require('os');

const git = simpleGit();

program
    .command('commit')
    .description('Add all changes and commit')
    .action(async () => {
        await git.add('.');
        // You can implement AI-based commit message generation here
        const { message } = await inquirer.prompt({
            type: 'input',
            name: 'message',
            message: 'Enter commit message:'
        });
        await git.commit(message);
    });

program
    .command('push')
    .description('Add all changes, commit, and push to a branch')
    .action(async () => {
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
    });

program
    .command('config')
    .description('Setup GitNinja configuration')
    .action(async () => {
        const configPath = `${os.homedir()}/.gitninjaconfig`;
        if (fs.existsSync(configPath)) {
            console.log('GitNinja is already configured.');
            return;
        }

        const { apiKey } = await inquirer.prompt({
            type: 'input',
            name: 'apiKey',
            message: 'Enter your Gemini API key:'
        });

        // Save the API key to the config file
        fs.writeFileSync(configPath, apiKey);
        console.log('Configuration saved successfully.');
    });

program.parse(process.argv);
