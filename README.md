# Valet

Valet is a protoype mobile app for a general purpose AI agent. This repository is helpful for understanding our streamlined approach to developing agentic applications. We avoid the need to vectorize massive datasets in what has become the industry standard in favor of a blend of elementary prompt engineering and traditional RESTful APIs. 

## Use Cases

The idea of use cases is the centerpiece of our design approach. For a general purpose AI agent to be "good enough" we "only" need to address a number of major use cases. 

In the same way that most people use the same handful apps on their phone the overwhelming majority of time, an AI agent really only needs to satisfy a limited number of _types_ of use case. This number may indeed be large--but it isn't even close to infinite.

The beauty of use cases is that an AI agent can be extended by making it aware of a new use case. For us, a use case is a defined task or set of tasks an agent can accomplish on behalf of its user. Our demo app features a single use case: getting a ride estimate for an Uber. 

## Architectural Notes

Since our framework of choice [Expo Snack](https://snack.expo.dev/) does not permit sharing projects directly from the platform the mobile frontend code is housed in /dist/valet.zip. It cannot be run in this form but it does offer insight into how the frontend is put together.

### Database as Message Bus
In the interest of saving time during development we chose to use our Supabase database as a message bus to eliminate the need for an API interface for our mobile frontend. 

Supabase provides a client-side SDK for interacting with the database as well as a publish/subscribe mechanism for listening to changes on specified database tables. 

Our backend subscribes to inserts on a table designated for incoming request messages and then processes requests accordingly, in essentially the manner an API route handler would in an Express or Fastify app. 

Likewise our client listens for inserts on table designated for outgoing reply messages. 

You can read more about our implementation of message busses [here](https://dev.to/agustus_gloop/bussin-database-as-a-message-bus-454p). For some insight on how clients of asynchronous message systems reliably receive responses to their outgoing messages checkout this primer on the [Selective Consumer Pattern](https://www.enterpriseintegrationpatterns.com/patterns/messaging/MessageSelector.html).

### Expo for Native Mobile Frontend Development
We used Expo's [Snack](https://snack.expo.dev/) framework to quickly scaffold a native iOS frontend. For our demo app we make use of the device microphone, speaker and geolocation capabilities.

### System Overview
The diagram of our application is below. You can find a detailed discussion of this approach to designing agentic apps [here](https://dev.to/agustus_gloop/stop-hallucinating-apis-are-the-missing-link-for-reliable-agentic-applications-243e-temp-slug-5190313?preview=428626963d5b19e8dea28779b785bb6372bec2fde7144f22aa780ffd3900f1829b3e5a7c7932d78d301950b35e269e57ad0f9e3fec7cbc488b4d4b98).

![The demo app diagram](https://github.com/seanttaylor/valet-backend/blob/master/docs/img/valet-system-diagram.png?raw=true)

#### Demo tldr;
We stitch a structured API payload from a natural language query from the ChatGPT API, which we enrich with gelocation and user data from our demo app. 

Using prompt engineering we trained ChatGPT produce what we call **intent specifications** from a natural language request which we generate via speech-to-text. An intent specification looks like this: 
```javascript
{
    context: {
      location: {
        current: {
          address: null,
          bookmarked: false,
          lat: '37.7752315',
          lng: '-122.418075',
          name: null,
        },
        destination: {
          address: null,
          bookmarked: false,
          lat: '<LAT>',
          lng: '<LNG>',
          name: 'AMC Empire 25',
        },
      },
      user: {
        displayName: 'Augustus',
        id: 'dd495dbb-5a2f-46ed-8009-ad2bf0b85fcc',
      },
    },
    domain: 'app.intents.mobility.get_ride',
    reply_id: '903496b2-b3f2-4f70-8574-16ae38403550',
  }
```

The intent specification is a structured representation of the action the user wants the AI agent to accomplish on their behalf. 

We send the intent specification to our backend which identifies the strategy for the appropriate [use case](#use-cases) and executes an API request accordingly. 

Our demo app implements requesting a ride from Uber.

Once the Uber API responds to our request, we create a reply message for the frontend, that message is interpreted by ChatGPT and transformed into natural language. The natural language response is threaded through a text-to-speech module and the audio is played the demo device's speaker. 






