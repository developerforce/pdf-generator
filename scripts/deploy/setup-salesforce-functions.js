'use strict';
const sh = require('shelljs');
const chalk = require('chalk');
const log = console.log;

const setupSalesforceFunctions = async () => {
    log('');
    log(
        `${chalk.bold('*** Setting up Salesforce Functions')} ${chalk.dim(
            '(step 3 of 3)'
        )}`
    );

    // Check user is correctly logged into sf functions
    const whoAmI = sh.exec('sf whoami functions', { silent: true });
    if (whoAmI.stderr && whoAmI.stderr.includes('Error: Request failed')) {
        throw new Error(
            'Not logged into Functions. Run "sf login functions" to authenticate yourself.'
        );
    }

    log(`*** Deploying Function ${chalk.bold(sh.env.SF_SCRATCH_ORG)}`);

    const compute = sh.exec(
        `sf env create compute --connected-org=${sh.env.SF_SCRATCH_ORG} --alias=${sh.env.SF_SCRATCH_ORG}env`,
        { silent: true }
    );

    if (compute.stderr && compute.stderr.includes('Error: Request failed')) {
        throw new Error(
            'An error has ocurred when creating the compute environment.\n' + compute.stderr
        );
    }

    const deploy = sh.exec(
        `sf deploy functions --force --connected-org=${sh.env.SF_SCRATCH_ORG} --branch ${sh.env.CURRENT_BRANCH}`
    );

    if (deploy.stderr && deploy.stderr.includes('Error: Request failed')) {
        throw new Error(
            'An error has ocurred when deploying function.\n' + deploy.stderr
        );
    }

    log(
        chalk.green(
            `*** ✔ Done deploying Functions ${chalk.bold(sh.env.SF_SCRATCH_ORG)}`
        )
    );
};

module.exports = { setupSalesforceFunctions };
