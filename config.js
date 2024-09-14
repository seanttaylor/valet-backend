export const config = {
    keys: {
      SUPABASE_PUBLIC_ANON_KEY:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Y3Nua2luemJtYXhvY2FuYW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwMDE4MDgsImV4cCI6MjAzOTU3NzgwOH0.eXCbj4yKnAwyMrtWWNwiIe4XQPjjEF1r3qWipCzGYqM',
    },
    vars: {
      SUPABASE_URL: 'https://ttcsnkinzbmaxocanaoa.supabase.co',
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
  