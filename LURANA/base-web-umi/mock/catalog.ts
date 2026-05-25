import type {
  ProductType,
} from '../src/types/catalog';

// =========================
// MOCK PRODUCTS
// =========================

export const MOCK_PRODUCTS: ProductType[] =
  [
    {
      id: 1,

      name:
        'Kem dưỡng ẩm Ceramide',

      weight: 300,

      importPrice: 250000,

      price: 450000,

      stock: 25,

      images: [
        'https://picsum.photos/300/300?random=1',
        ],

      active: true,

      variants: [
        {
          weight: 200,

          importPrice: 180000,

          price: 320000,

          stock: 10,
        },

        {
          weight: 500,

          importPrice: 250000,

          price: 620000,

          stock: 15,
        },
      ],
    },

    {
      id: 2,

      name:
        'Serum Vitamin C Brightening',

      weight: 30,

      importPrice: 250000,

      price: 450000,

      stock: 18,

      images: [
        'https://picsum.photos/300/300?random=1',
      ],

      active: true,

      variants: [
        {
          weight: 15,

          importPrice: 180000,

          price: 280000,

          stock: 10,
        },

        {
          weight: 50,

          importPrice: 320000,

          price: 650000,

          stock: 8,
        },
      ],
    },

    {
      id: 3,

      name:
        'Sữa rửa mặt trà xanh',


      weight: 30,

      importPrice: 250000,

      price: 180000,

      stock: 40,

      images: [
        'https://picsum.photos/300/300?random=1',
        ],

      active: false,

      variants: [],
    },

    {
      id: 4,

      name:
        'Toner cấp ẩm Hyaluronic',

      weight: 300,


      importPrice: 150000,
      
      price: 260000,

      stock: 12,

      images: [
        'https://picsum.photos/300/300?random=1',
        ],

      active: true,

      variants: [
        {
          weight: 150,

          importPrice: 140000,

          price: 260000,

          stock: 12,
        },
      ],
    },

    {
      id: 5,

      name:
        'Kem chống nắng SPF50+',

      weight: 30,

      importPrice: 120000,
      
      price: 390000,

      stock: 30,

      images: [
        'https://picsum.photos/300/300?random=1',
        ],

      active: true,

      variants: [
        {
          weight: 50,

          importPrice: 220000,

          price: 390000,

          stock: 20,
        },

        {
          weight: 100,

          importPrice: 340000,

          price: 590000,

          stock: 10,
        },
      ],
    },
  ];

// =========================
// INIT LOCAL STORAGE
// =========================

const PRODUCT_KEY = 'products';

export function initMockProducts() {
  const storedProducts =
    localStorage.getItem(
      PRODUCT_KEY,
    );

  if (!storedProducts) {
    localStorage.setItem(
      PRODUCT_KEY,
      JSON.stringify(
        MOCK_PRODUCTS,
      ),
    );
  }
}


export const MOCK_CATEGORIES = [
  {
    id: 1,

    code: 'KCN',

    name: 'Kem chống nắng',

    description: 'Bảo vệ da khỏi tia UV',

    active: true,
  },

  {
    id: 2,

    code: 'SRM',

    name: 'Sữa rửa mặt',

    description: 'Làm sạch da',

    active: true,
  },

  {
    id: 3,

    code: 'SERUM',

    name: 'Serum',

    description: 'Tinh chất dưỡng da',

    active: true,
  },
];