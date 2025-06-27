"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const LogMessage_1 = require("../../../src/common/logs/LogMessage");
const LogMessageType_1 = require("../../../src/common/logs/LogMessageType");
describe('LogMessage', () => {
    it('does not store playerId when undefined on object', () => {
        const noPlayerLog = new LogMessage_1.LogMessage(LogMessageType_1.LogMessageType.DEFAULT, 'foobar', []);
        (0, chai_1.expect)(noPlayerLog.hasOwnProperty('playerId')).to.be.false;
        const playerLog = new LogMessage_1.LogMessage(LogMessageType_1.LogMessageType.DEFAULT, 'foobar', [], 'playerId');
        (0, chai_1.expect)(playerLog.hasOwnProperty('playerId')).to.be.true;
        (0, chai_1.expect)(playerLog.playerId).to.eql('playerId');
    });
    it('does not store type when LogMessageType.DEFAULT', () => {
        const defaultLog = new LogMessage_1.LogMessage(LogMessageType_1.LogMessageType.DEFAULT, 'foobar', []);
        (0, chai_1.expect)(defaultLog.hasOwnProperty('type')).to.be.false;
        const newGenerationLog = new LogMessage_1.LogMessage(LogMessageType_1.LogMessageType.NEW_GENERATION, 'foobar', []);
        (0, chai_1.expect)(newGenerationLog.type).to.eql(LogMessageType_1.LogMessageType.NEW_GENERATION);
    });
});
