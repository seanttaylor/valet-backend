import { createClient } from '@supabase/supabase-js';
import { promisify } from 'util';

/******** LOCAL DEPENDENCIES ********/
import { StrategyService } from './src/services/strategy/index.js';
import { UseCaseService } from './src/services/use-case/index.js';
import { IIntentMessageContext } from './interfaces/intent-message-payload.js';

/******** UTILITIES ********/
import { once } from './src/utils/once.js';
import { EventEmitter } from './event-emitter.js';
import { testIntentMessage } from './template.js';

const SUPABASE_PUBLIC_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Y3Nua2luemJtYXhvY2FuYW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwMDE4MDgsImV4cCI6MjAzOTU3NzgwOH0.eXCbj4yKnAwyMrtWWNwiIe4XQPjjEF1r3qWipCzGYqM';
const SUPABASE_URL = 'https://ttcsnkinzbmaxocanaoa.supabase.co';
const EVENT_SOURCE = 'com.valet.backend';
const APP_NAME = 'valet';
const APP_VERSION = '0.0.1';

const figletize = promisify(figlet);
const banner = await figletize(`${APP_NAME} v${APP_VERSION}`);

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
  'evt.use_cases.strategy_execution_started',
  (event) => {
    console.log(event);
  },
  { subscriber: SUBSCRIBER_ID }
);

eventEmitter.on(
  'evt.use_cases.strategy_execution_completed',
  onStrategyExecutionCompleted,
  { subscriber: SUBSCRIBER_ID }
);

/**
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
    'evt.use_cases.strategy_execution_completed',
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
