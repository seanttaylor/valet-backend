import {
    IEvent,
    IIntentSpecification,
    ISandbox,
    IStrategyService,
    IUseCaseService,
  } from '../../interfaces/local.js';
  import { SystemEvent, Events } from '../events.js';
  
  /**
   * @typedef {Object} DependentServices
   * @property {IStrategyService} StrategyService - Service to manage strategies
   * @property {IUseCaseService} UseCaseService - Service to manage use cases
   */
  
  export class IntentService {
    #EVENT_SOURCE = 'com.valet.backend.services.intent';
    #sandbox;
    #logger;
  
    /**
     * @param {ISandbox & {my: DependentServices }} sandbox
     */
    constructor(sandbox) {
      this.#sandbox = sandbox;
      this.#logger = sandbox.core.logger.getLoggerInstance();
    }
  
    /**
     * Consumes an event whose payload is a intent specification containing
     * all relevant data to satisfy a use case
     * @param {IEvent<IIntentSpecification>} event
     */
    async onIntentMessageReceived(event) {
      try {
        const { domain, reply_id, context } = event.payload;
  
        this.#sandbox.my.StrategyService;
  
        const strategy =
          await this.#sandbox.my.StrategyService.getStrategyByDomain(domain);
        const [UseCase] =
          await this.#sandbox.my.UseCaseService.getUseCaseByDomain(domain);
        const currentUseCase = new UseCase();
  
        currentUseCase.setStrategy(strategy);
  
        const strategyStarted = new SystemEvent(
          Events.STRATEGY_EXECUTION_STARTED,
          { name: strategy.name },
          { source: this.#EVENT_SOURCE }
        );
  
        this.#sandbox.dispatchEvent(strategyStarted);
  
        const result = await currentUseCase.run(context);
  
        const strategyCompleted = new SystemEvent(
          Events.STRATEGY_EXECUTION_COMPLETED,
          {
            name: strategy.name,
            domain,
            context,
            reply_id,
            result,
          },
          { source: this.#EVENT_SOURCE }
        );
  
        this.#sandbox.dispatchEvent(strategyCompleted);
      } catch (ex) {
        this.#logger.error(
          `INTERNAL_ERROR (${
            this.#EVENT_SOURCE
          }) Exception during strategy execution. See details ->`,
          ex.message
        );
      }
    }
  }
  