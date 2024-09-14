export const config = {
    keys: {
      SUPABASE_PUBLIC_ANON_KEY: process.env.SUPABASE_PUBLIC_ANON_KEY,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
    },
    vars: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      UBER_API_URL: process.env.UBER_API_URL
    },
    subscriptions: {
      completed_strategy_executions: {
        event: 'INSERT',
        schema: 'public',
        table: 'completed_strategy_executions',
        channel: 'outbound_intent_reply_messages',
      },
      intent_messages: {
        event: 'INSERT',
        schema: 'public',
        table: 'intent_messages',
        channel: 'inbound_intent_messages',
      },
    },
    misc: {},
  };
  