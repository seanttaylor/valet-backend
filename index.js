import { createClient } from '@supabase/supabase-js';

/******** LOCAL DEPENDENCIES ********/
import { StrategyService } from './src/services/strategy/index.js';
import { UseCaseService } from './src/services/use-case/index.js';
import { IIntentMessageContext } from './interfaces/intent-message-payload.js';

/******** UTILITIES ********/
import { once } from './src/utils/once.js';
import { EventEmitter, Events } from './event-emitter.js';
import { testIntentMessage } from './template.js';

const SUPABASE_PUBLIC_ANON_KEY = process.env.SUPABASE_PUBLIC_ANON_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const EVENT_SOURCE = 'com.valet.backend';

/**
 * Configuration for subscriptions to realtime table updates via Supabase
 */
const SUBSCRIPTION_CONFIG = {
  intent_messages: {
    event: 'INSERT',
    schema: 'public',
    table: 'intent_messages',
    channel: 'inbound_intent_messages',
  },
  completed_strategy_executions: {
    event: 'INSERT',
    schema: 'public',
    table: 'completed_strategy_executions',
    channel: 'outbound_intent_reply_messages',
  },
};

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_ANON_KEY);
const strategyService = new StrategyService();
const eventEmitter = new EventEmitter();
const useCaseService = new UseCaseService(eventEmitter);

eventEmitter.on(
  Events.EXECUTION_STARTED,
  (event) => {
    console.log(event);
  },
  { subscriber: EVENT_SOURCE }
);

eventEmitter.on(
  Events.EXECUTION_COMPLETED,
  onStrategyExecutionCompleted,
  { subscriber: EVENT_SOURCE }
);

/**
 * Fires on completed execution of a strategy; logs the details of
 * the execution to the database
 * @param {Object} event
 * @param {Object} event.header
 * @param {Object} event.paylaod
 * @returns {Result}
 */
async function onStrategyExecutionCompleted({ header, payload }) {
  console.log('strategy execution completed', { header, payload });
  const { data, error } = await supabase
    .from('completed_strategy_executions')
    .insert({
      reply_id: payload.reply_id,
      payload,
    });

  if (error) {
    console.error(error.message);
    return;
  }
}

/**
 * @param {Object} payload
 */
async function onIntentReplyMessageReceived(payload) {
  console.log('intent reply message received', payload);
}

/**
 * Fires when an intent message has been inserted into the database; bootstraps
 * the strategy execution process after a domain and use case is identified
 * @param {Object} message
 * @param {Object} message.header
 * @param {Object} message.payload
 * @param {IIntentMessageContext} message.payload.context
 * @param {String} message.payload.domain
 */
async function onIntentMessageReceived({ header, payload }) {
  const { domain, reply_id, context } = payload;
  const strategy = await strategyService.getStrategyByDomain(domain);
  const [UseCase] = await useCaseService.getUseCaseByDomain(domain);
  const currentUseCase = new UseCase(eventEmitter);

  currentUseCase.setStrategy(strategy);
  const result = await currentUseCase.run(context);

  eventEmitter.emit(
    Events.EXECUTION_COMPLETED,
    {
      name: strategy.name,
      domain,
      context,
      reply_id,
      result,
    },
    { source: EVENT_SOURCE }
  );
}

/**
 * The subscription to the `intent_messages` table below bootstraps the
 * appplication; the listener can be triggered by entering a new row into
 * the `intent_messages` table via the Supabase SDK or via the Supabase
 * REST API
 */
(async (client) => {
  try {
    once(() => {
      //await onIntentMessageReceived(testIntentMessage);
      client
        .channel(SUBSCRIPTION_CONFIG.intent_messages.channel)
        .on(
          'postgres_changes',
          SUBSCRIPTION_CONFIG.intent_messages,
          (payload) => onIntentMessageReceived(payload.new)
        )
        .subscribe();
    })();
  } catch (ex) {
    console.error(ex.message);
  }
})(supabase);
