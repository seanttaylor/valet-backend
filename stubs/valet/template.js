export const testIntentMessage = {
    created_at: '2024-08-22T02:24:16.723558+00:00',
    header: {
      id: '7124b2f0-b41c-46f4-98ae-a2107af104cc',
      name: 'evt.intents.specification_generated',
      timestamp: '2024-08-17T20:01:58.832Z',
      version: '0.0.1',
    },
    id: '4a16ccce-f232-432f-9521-93dadcf27f87',
    payload: {
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
    },
};
  
export const testGeoCodeResponse = {
  results: [
    {
      address_components: [
        {
          long_name: '1600',
          short_name: '1600',
          types: ['street_number'],
        },
        {
          long_name: 'Amphitheatre Parkway',
          short_name: 'Amphitheatre Pkwy',
          types: ['route'],
        },
        {
          long_name: 'Mountain View',
          short_name: 'Mountain View',
          types: ['locality', 'political'],
        },
        {
          long_name: 'Santa Clara County',
          short_name: 'Santa Clara County',
          types: ['administrative_area_level_2', 'political'],
        },
        {
          long_name: 'California',
          short_name: 'CA',
          types: ['administrative_area_level_1', 'political'],
        },
        {
          long_name: 'United States',
          short_name: 'US',
          types: ['country', 'political'],
        },
        {
          long_name: '94043',
          short_name: '94043',
          types: ['postal_code'],
        },
        {
          long_name: '1351',
          short_name: '1351',
          types: ['postal_code_suffix'],
        },
      ],
      formatted_address: '1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA',
      geometry: {
        location: {
          lat: 42.0000,
          lng: 73.0000
        },
        location_type: 'ROOFTOP',
        viewport: {
          northeast: {
            lat: 37.4237349802915,
            lng: -122.083183169709,
          },
          southwest: {
            lat: 37.4210370197085,
            lng: -122.085881130292,
          },
        },
      },
      place_id: 'ChIJRxcAvRO7j4AR6hm6tys8yA8',
      plus_code: {
        compound_code: 'CWC8+W7 Mountain View, CA',
        global_code: '849VCWC8+W7',
      },
      types: ['street_address'],
    },
  ],
  status: 'OK',
};
