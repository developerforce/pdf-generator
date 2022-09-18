'use strict';

const shortcutsListener = require('./shortcuts');
const eventsListener = require('./events');
const actionListener = require('./actions');
const commandListener = require('./commands');
const viewsListener = require('./views');

module.exports.registerListeners = (app) => {
    shortcutsListener.register(app);
    eventsListener.register(app);
    actionListener.register(app);
    commandListener.register(app);
    viewsListener.register(app);
};
