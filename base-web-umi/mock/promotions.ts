let promotions = [
  {
    id: 1,
    name: 'Summer Sale',

    productName:
      'CC+ Cream Illumination SPF 50+',

    productImage:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',

    discountPrice: 400000,

    startDate: '01/05/2026',

    endDate: '31/05/2026',

    status: 'active',
  },

  {
    id: 2,
    name: 'Flash Sale',

    productName:
      'Skin Perfecting Foundation',

    productImage:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be',

    discountPrice: 350000,

    startDate: '10/06/2026',

    endDate: '20/06/2026',

    status: 'upcoming',
  },

  {
    id: 3,
    name: 'Special Offer',

    productName: 'Hydrating Cleanser',

    productImage:
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883',

    discountPrice: 250000,

    startDate: '01/04/2026',

    endDate: '15/04/2026',

    status: 'expired',
  },
];

export default {
  // =========================
  // GET ALL
  // =========================

  'GET /api/promotions': (
    req: any,
    res: any,
  ) => {
    res.send(promotions);
  },

  // =========================
  // CREATE
  // =========================

  'POST /api/promotions': (
    req: any,
    res: any,
  ) => {
    const body = req.body;

    const newPromotion = {
      id: Date.now(),

      ...body,
    };

    promotions.unshift(newPromotion);

    res.send({
      success: true,
      data: newPromotion,
    });
  },

  // =========================
  // UPDATE
  // =========================

  'PUT /api/promotions/:id': (
    req: any,
    res: any,
  ) => {
    const { id } = req.params;

    const body = req.body;

    promotions = promotions.map((item) => {
      if (item.id === Number(id)) {
        return {
          ...item,
          ...body,
        };
      }

      return item;
    });

    res.send({
      success: true,
    });
  },

  // =========================
  // DELETE
  // =========================

  'DELETE /api/promotions/:id': (
    req: any,
    res: any,
  ) => {
    const { id } = req.params;

    promotions = promotions.filter(
      (item) => item.id !== Number(id),
    );

    res.send({
      success: true,
    });
  },
};