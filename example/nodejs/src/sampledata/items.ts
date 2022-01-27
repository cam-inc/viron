export const list = [
  {
    name: 'item1',
    description: 'item1 description.',
    sellingPrice: 550,
    imageUrl: 'https://example.com/item1.png',
    detail: {
      type: 'realGoods' as const,
      productCode: 't-shirt-001',
      manufacturer: 'example maker',
      manufacturingCost: 200,
    },
  },
  {
    name: 'item2',
    description: 'item2 description.',
    sellingPrice: 1000,
    imageUrl: 'https://example.com/item2.png',
    detail: {
      type: 'digitalContents' as const,
      downloadUrl: 'https://example.com/item2-orig.png',
    },
  },
];
