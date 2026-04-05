import { Type } from "@google/genai";

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  type: 'stay' | 'stop' | 'highlight' | 'hidden-gem';
  tips?: string[];
  stayDuration?: string;
  distanceFromPrevious?: string;
  images?: string[];
}

export interface ItinerarySegment {
  id: string;
  dates: string;
  title: string;
  routeInfo?: string;
  distance?: string;
  strategy?: string;
  locations: Location[];
  notes?: string[];
  routeImages?: string[];
}

export const itineraryData: ItinerarySegment[] = [
  {
    id: "day1",
    dates: "April 17",
    title: "Arrival → Lisbon (via Coimbra)",
    routeInfo: "A1 motorway south",
    distance: "315 km",
    strategy: "Don’t treat this as a rush-to-Lisbon drive. Treat it as your 'soft landing + culture day'.",
    routeImages: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Aeroporto_Francisco_S%C3%A1_Carneiro_%28Porto%29.jpg/800px-Aeroporto_Francisco_S%C3%A1_Carneiro_%28Porto%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Coimbra_-_Portugal_%2826868661603%29.jpg/800px-Coimbra_-_Portugal_%2826868661603%29.jpg"
    ],
    locations: [
      {
        id: "porto-airport",
        name: "Porto Airport (OPO)",
        lat: 41.2421,
        lng: -8.6786,
        type: "stop",
        description: "Arrival point. Pick up your rental car and head south.",
        tips: ["Pick up rental car", "Head south on A1"],
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Aeroporto_Francisco_S%C3%A1_Carneiro_%28Porto%29.jpg/800px-Aeroporto_Francisco_S%C3%A1_Carneiro_%28Porto%29.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/3/30/Aeroporto_Porto_04.jpg"
        ]
      },
      {
        id: "coimbra",
        name: "Coimbra",
        lat: 40.2033,
        lng: -8.4103,
        type: "stop",
        distanceFromPrevious: "120 km",
        description: "Old university town with an intellectual and historic vibe. Less touristy than Lisbon/Porto.",
        tips: [
          "Walk up to University of Coimbra",
          "Quick wander in old town alleys",
          "Lunch: simple grilled fish or pork sandwich"
        ],
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Coimbra_-_Portugal_%2826868661603%29.jpg/800px-Coimbra_-_Portugal_%2826868661603%29.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Universidade_de_Coimbra_-_Portugal_%2827404494161%29.jpg/800px-Universidade_de_Coimbra_-_Portugal_%2827404494161%29.jpg"
        ]
      },
      {
        id: "conimbriga",
        name: "Conímbriga",
        lat: 40.0994,
        lng: -8.4894,
        type: "hidden-gem",
        distanceFromPrevious: "15 km",
        description: "Seriously underrated Roman ruins, very atmospheric micro-detour.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Conimbriga_%2813249222603%29.jpg/800px-Conimbriga_%2813249222603%29.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/f/f4/Conimbriga_%2813248745525%29.jpg"
        ]
      }
    ]
  },
  {
    id: "lisbon-stay",
    dates: "April 17–21",
    title: "Lisbon & Sintra",
    notes: ["4 nights in Lisbon"],
    routeImages: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Lisbon_alfalma.jpg/800px-Lisbon_alfalma.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Sintra_Portugal_Pal%C3%A1cio_da_Pena-01.jpg/800px-Sintra_Portugal_Pal%C3%A1cio_da_Pena-01.jpg"
    ],
    locations: [
      {
        id: "lisbon",
        name: "Lisbon",
        lat: 38.7223,
        lng: -9.1393,
        type: "stay",
        stayDuration: "4 Nights",
        distanceFromPrevious: "200 km",
        description: "The vibrant capital. Focus on Alfama at night and LX Factory for creative energy.",
        tips: [
          "Alfama at night for the best vibe",
          "LX Factory for design energy",
          "Miradouro da Senhora do Monte for the best views"
        ],
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Lisbon_alfalma.jpg/800px-Lisbon_alfalma.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Pra%C3%A7a_do_Com%C3%A9rcio_-_Lisboa_-_Portugal_%2848972559556%29.jpg/800px-Pra%C3%A7a_do_Com%C3%A9rcio_-_Lisboa_-_Portugal_%2848972559556%29.jpg"
        ]
      },
      {
        id: "sintra",
        name: "Sintra",
        lat: 38.8029,
        lng: -9.3817,
        type: "highlight",
        distanceFromPrevious: "30 km",
        description: "Fairytale town with palaces and moorish castles. Go early to beat the crowds.",
        tips: [
          "Pena Palace",
          "Quinta da Regaleira",
          "Skip trying to do everything to avoid burnout"
        ],
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Sintra_Portugal_Pal%C3%A1cio_da_Pena-01.jpg/800px-Sintra_Portugal_Pal%C3%A1cio_da_Pena-01.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Quinta_da_Regaleira%2C_Sintra%2C_Portugal%2C_2019-05-25%2C_DD_56.jpg/800px-Quinta_da_Regaleira%2C_Sintra%2C_Portugal%2C_2019-05-25%2C_DD_56.jpg"
        ]
      }
    ]
  },
  {
    id: "lisbon-to-algarve",
    dates: "April 21",
    title: "Lisbon → Algarve (via Évora)",
    routeInfo: "A2 → detour to Évora → IP2 → A2",
    distance: "300 km",
    routeImages: [
      "https://upload.wikimedia.org/wikipedia/commons/7/74/Evora_roman-temple_panoramic-view_cropped.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Montado_Alentejano.jpg/800px-Montado_Alentejano.jpg"
    ],
    locations: [
      {
        id: "evora",
        name: "Évora",
        lat: 38.5714,
        lng: -7.9135,
        type: "stop",
        distanceFromPrevious: "130 km",
        description: "A time capsule town with whitewashed buildings and Roman/medieval layers.",
        tips: [
          "Roman Temple of Évora",
          "Chapel of Bones (unforgettable)"
        ],
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/7/74/Evora_roman-temple_panoramic-view_cropped.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Capilla_de_los_huesos%2C_%C3%89vora.jpg/800px-Capilla_de_los_huesos%2C_%C3%89vora.jpg"
        ]
      },
      {
        id: "alentejo",
        name: "Alentejo Countryside",
        lat: 38.4225,
        lng: -7.8125,
        type: "hidden-gem",
        distanceFromPrevious: "20 km",
        description: "Real Portugal: cork trees, rolling golden fields, and almost no tourists.",
        tips: ["Drive randomly for 20–30 mins outside Évora"],
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Montado_Alentejano.jpg/800px-Montado_Alentejano.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/2/24/Alentejo_September_2013-1.jpg"
        ]
      }
    ]
  },
  {
    id: "algarve-stay",
    dates: "April 21–25",
    title: "Algarve",
    notes: ["4 nights", "Base: Lagos or Carvoeiro"],
    routeImages: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ponta_da_Piedade_aerial_view.jpg/800px-Ponta_da_Piedade_aerial_view.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Algar_de_Benagil_%281%29.jpg/800px-Algar_de_Benagil_%281%29.jpg"
    ],
    locations: [
      {
        id: "lagos",
        name: "Lagos",
        lat: 37.1028,
        lng: -8.6730,
        type: "stay",
        stayDuration: "4 Nights",
        distanceFromPrevious: "200 km",
        description: "Base with dramatic cliffs and vibrant atmosphere.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ponta_da_Piedade_aerial_view.jpg/800px-Ponta_da_Piedade_aerial_view.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/b/b4/Algarve_Bucht_Lagos_%2827637090891%29.jpg"
        ]
      },
      {
        id: "ponta-piedade",
        name: "Ponta da Piedade",
        lat: 37.0809,
        lng: -8.6695,
        type: "highlight",
        distanceFromPrevious: "3 km",
        description: "Insane cliff formations and crystal clear water.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ponta_da_Piedade_aerial_view.jpg/800px-Ponta_da_Piedade_aerial_view.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/4/4b/Ponta_da_Piedade_pano.jpg"
        ]
      },
      {
        id: "benagil",
        name: "Benagil Cave",
        lat: 37.0872,
        lng: -8.4238,
        type: "highlight",
        distanceFromPrevious: "30 km",
        description: "Famous sea cave. Go early!",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Algar_de_Benagil_%281%29.jpg/800px-Algar_de_Benagil_%281%29.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/a/a4/Praia_de_Benagil_-_Portugal_%F0%9F%87%B5%F0%9F%87%B9_%2853650893917%29.jpg"
        ]
      },
      {
        id: "praia-marinha",
        name: "Praia da Marinha",
        lat: 37.0898,
        lng: -8.4128,
        type: "highlight",
        distanceFromPrevious: "5 km",
        description: "One of Europe's best beaches.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Praia_da_Marinha_%282012-09-27%29%2C_by_Klugschnacker_in_Wikipedia_%2886%29.JPG/800px-Praia_da_Marinha_%282012-09-27%29%2C_by_Klugschnacker_in_Wikipedia_%2886%29.JPG",
          "https://upload.wikimedia.org/wikipedia/commons/8/84/Praia_da_Marinha_%282012-09-27%29%2C_by_Klugschnacker_in_Wikipedia_%2826%29.JPG"
        ]
      },
      {
        id: "praia-figueira",
        name: "Praia da Figueira",
        lat: 37.0655,
        lng: -8.8455,
        type: "hidden-gem",
        distanceFromPrevious: "20 km",
        description: "Requires a short hike, meaning way fewer people.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Praia_da_Figueira_01.jpg/800px-Praia_da_Figueira_01.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/6/6e/Praia_de_Benagil_-_Portugal_%F0%9F%87%B5%F0%9F%87%B9_%2853651979938%29.jpg"
        ]
      }
    ]
  },
  {
    id: "algarve-to-nazare",
    dates: "April 25",
    title: "Algarve → Nazaré (via Óbidos)",
    routeInfo: "A2 → A8",
    distance: "420 km",
    strategy: "This is your long drive day—make it a highlight.",
    routeImages: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Setubal_III_%28cropped%29.jpg/800px-Setubal_III_%28cropped%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Castle_of_%C3%93bidos.jpg/800px-Castle_of_%C3%93bidos.jpg"
    ],
    locations: [
      {
        id: "setubal",
        name: "Setúbal",
        lat: 38.5244,
        lng: -8.8931,
        type: "stop",
        distanceFromPrevious: "230 km",
        description: "Great lunch stop known for seafood.",
        tips: ["Try grilled cuttlefish"],
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Setubal_III_%28cropped%29.jpg/800px-Setubal_III_%28cropped%29.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/e/e2/Castillo_de_San_Felipe%2C_Set%C3%BAbal%2C_Portugal%2C_2020-07-19%2C_DD_02.jpg"
        ]
      },
      {
        id: "arrabida",
        name: "Arrábida Natural Park",
        lat: 38.4800,
        lng: -8.9800,
        type: "highlight",
        distanceFromPrevious: "15 km",
        description: "Coastal mountain roads with stunning blue water views.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Parque_Natural_da_Arr%C3%A1bia.jpg/800px-Parque_Natural_da_Arr%C3%A1bia.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/8/8b/Brecha_arrabida.JPG"
        ]
      },
      {
        id: "obidos",
        name: "Óbidos",
        lat: 39.3610,
        lng: -9.1570,
        type: "stop",
        distanceFromPrevious: "120 km",
        description: "Medieval walled town.",
        tips: ["Walk the walls quickly", "Try cherry liquor (ginjinha)"],
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Castle_of_%C3%93bidos.jpg/800px-Castle_of_%C3%93bidos.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/a/a7/Obidos_April_2009-4b.jpg"
        ]
      }
    ]
  },
  {
    id: "nazare-stay",
    dates: "April 25–26",
    title: "Nazaré",
    notes: ["1 night"],
    routeImages: ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/La_grande_plage_de_Nazar%C3%A9_-_panoramio_%2820%29.jpg/800px-La_grande_plage_de_Nazar%C3%A9_-_panoramio_%2820%29.jpg"],
    locations: [
      {
        id: "nazare",
        name: "Nazaré",
        lat: 39.6012,
        lng: -9.0701,
        type: "stay",
        stayDuration: "1 Night",
        distanceFromPrevious: "40 km",
        description: "Famous big-wave surfing spot with incredible ocean views.",
        tips: ["Go up to Sítio da Nazaré for the best views"],
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/La_grande_plage_de_Nazar%C3%A9_-_panoramio_%2820%29.jpg/800px-La_grande_plage_de_Nazar%C3%A9_-_panoramio_%2820%29.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/6/60/Can_you_see_the_surfer%3F_%2833988985575%29.jpg"
        ]
      }
    ]
  },
  {
    id: "nazare-to-porto",
    dates: "April 26",
    title: "Nazaré → Porto (via Aveiro)",
    routeInfo: "A8 → A17 → A29/A1",
    distance: "215 km",
    routeImages: ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Aveiro_Canal_Central.jpg/800px-Aveiro_Canal_Central.jpg"],
    locations: [
      {
        id: "aveiro",
        name: "Aveiro",
        lat: 40.6405,
        lng: -8.6538,
        type: "stop",
        distanceFromPrevious: "130 km",
        description: "The 'Venice of Portugal'—colorful, relaxed, and chill.",
        tips: ["Spend ~1.5–2 hrs max"],
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Aveiro_Canal_Central.jpg/800px-Aveiro_Canal_Central.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/3/38/Art_Nouveau_buildings_in_Aveiro_C5749.jpg"
        ]
      }
    ]
  },
  {
    id: "porto-stay",
    dates: "April 26–29",
    title: "Porto",
    notes: ["3 nights"],
    routeImages: ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Ribeira_%28Porto%29_-_Portugal_%2826868661603%29.jpg/800px-Ribeira_%28Porto%29_-_Portugal_%2826868661603%29.jpg"],
    locations: [
      {
        id: "porto",
        name: "Porto",
        lat: 41.1579,
        lng: -8.6291,
        type: "stay",
        stayDuration: "3 Nights",
        distanceFromPrevious: "75 km",
        description: "Historic city on the Douro river. Famous for Port wine and food.",
        tips: [
          "Ribeira at sunset",
          "Cross to Gaia for wine cellars",
          "Book a proper dinner"
        ],
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Ribeira_%28Porto%29_-_Portugal_%2826868661603%29.jpg/800px-Ribeira_%28Porto%29_-_Portugal_%2826868661603%29.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Ponte_Dom_Lu%C3%ADs_I_-_Porto_-_Portugal_%2826868661603%29.jpg/800px-Ponte_Dom_Lu%C3%ADs_I_-_Porto_-_Portugal_%2826868661603%29.jpg"
        ]
      }
    ]
  },
  {
    id: "departures",
    dates: "April 29 – May 2",
    title: "Departures",
    notes: [
      "April 29: Porto → Paris (7:00 AM flight is brutal)",
      "May 2: Paris departure",
      "Consider staying near the airport for early flights"
    ],
    locations: []
  }
];
