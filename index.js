import figlet from 'figlet';
import { promisify } from 'util';

/******** LOCAL DEPENDENCIES ********/
import {
  ISandbox,
  IDataAccessLayer,
  IStrategyService,
  IEvent,
} from './interfaces.js';
import { Sandbox } from './src/sandbox.js';
import { SystemEvent, Events } from './src/events.js';

import { config } from './config.js';
import { StrategyService } from './src/services/strategy/index.js';
import { UseCaseService } from './src/services/use-case/index.js';

import { DataAccessLayer } from './src/services/database.js';
import { IntentService } from './src/services/intent.js';
import { GeoLocation } from './src/services/geo.js';

/******** UTILITIES ********/
import { once } from './src/utils/once.js';
import { testIntentMessage } from './stubs/valet/template.js';

const EVENT_SOURCE = 'com.valet.backend.sandbox';
const APP_NAME = 'valet';
const APP_VERSION = '0.0.1';

const figletize = promisify(figlet);
const banner = await figletize(`${APP_NAME} v${APP_VERSION}`);

/******** MODULE REGISTRATION ********/
Sandbox.modules.of('StrategyService', StrategyService);
Sandbox.modules.of('DataAccessLayer', DataAccessLayer);
Sandbox.modules.of('IntentService', IntentService);
Sandbox.modules.of('UseCaseService', UseCaseService);

Sandbox.modules.of('GeoLocation', GeoLocation);

/**
 * @typedef {Object} DependentServices
 * @property {IDataAccessLayer} DataAccessLayer
 * @property {IStrategyService} StrategyService
 */

const mySandbox = new Sandbox(
  ['IntentService', 'DataAccessLayer', 'StrategyService', 'UseCaseService', 'GeoLocation'],
  /**
   * @param {ISandbox & { my: DependentServices }} box
   */
  async function (box) {
    const logger = box.core.logger.getLoggerInstance();
    const dbClient = box.my.DataAccessLayer.getDbClient();

    /******** EVENT REGISTRATION ********/
    box.addEventListener(Events.APP_INITIALIZED, ({ detail: event }) => once(onAppInitialization)(event));
    box.addEventListener(Events.STRATEGY_EXECUTION_STARTED, ({ detail: event }) => logger.log(event));
    box.addEventListener(
      Events.STRATEGY_EXECUTION_COMPLETED,
      ({ detail: event }) =>
        box.my.StrategyService.onStrategyExecutionCompleted(event)
    );

    /**
     * @param {IEvent<Object>} event
     */
    async function onAppInitialization(event) {
      try {
        logger.log(banner);
        //box.my.IntentService.onIntentMessageReceived(testIntentMessage);

        dbClient
          .channel(config.subscriptions.intent_messages.channel)
          .on(
            'postgres_changes',
            config.subscriptions.intent_messages,
            (payload) =>
              box.my.IntentService.onIntentMessageReceived(payload.new)
          )
          .subscribe();
      } catch (ex) {
        logger.error(ex.message);
      }
    }

    /**
     * Stub method for quick local testing
     * @param {IEvent} event
     */
    async function onIntentMessageReceived({ header, payload }) {
      const { domain, reply_id, context } = payload;
      const strategy = await box.my.StrategyService.getStrategyByDomain(domain);
      const [UseCase] = await box.my.UseCaseService.getUseCaseByDomain(domain);
      const currentUseCase = new UseCase();

      currentUseCase.setStrategy(strategy);
      const result = await currentUseCase.run(context);

      logger.log({
        name: strategy.name,
        domain,
        context,
        reply_id,
        result,
      });
    }
  }
);

mySandbox.dispatchEvent(new SystemEvent(Events.APP_INITIALIZED, {}, {}));