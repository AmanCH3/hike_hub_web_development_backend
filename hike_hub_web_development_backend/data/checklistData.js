const checklistData = {
  // Base items everyone needs
  base: {
    essentials: [
      { id: 1, text: 'Water Bottle(s)', checked: false },
      { id: 2, text: 'First-Aid Kit', checked: false },
      { id: 3, text: 'Snacks/Energy Bars', checked: false },
      { id: 4, text: 'Trail Map', checked: false },
      { id: 5, text: 'Flashlight/Headlamp', checked: false },
    ],
    clothing: [
      { id: 6, text: 'Hiking Boots/Shoes', checked: false },
      { id: 7, text: 'Extra Layers', checked: false },
    ],
    gear: [
      { id: 8, text: 'Hiking Backpack', checked: false },
      { id: 9, text: 'Sunscreen', checked: false },
    ],
  },
  // Add-ons based on filters
  experience: {
    new: [
      { category: 'essentials', item: { id: 10, text: 'Printed Directions', checked: false } },
    ],
    experienced: [
      { category: 'gear', item: { id: 11, text: 'GPS Device/App', checked: false } },
    ],
  },
  duration: {
    'full-day': [
      { category: 'essentials', item: { id: 12, text: 'Packed Lunch', checked: false } },
    ],
    'multi-day': [
      { category: 'essentials', item: { id: 12, text: 'Packed Lunch', checked: false } },
      { category: 'gear', item: { id: 13, text: 'Tent & Sleeping Bag', checked: false } },
      { category: 'gear', item: { id: 14, text: 'Cooking Gear', checked: false } },
    ],
  },
  weather: {
    hot: [
      { category: 'clothing', item: { id: 15, text: 'Hat/Cap for Sun Protection', checked: false } },
    ],
    cold: [
       { category: 'clothing', item: { id: 16, text: 'Winter Hat & Gloves', checked: false } },
    ],
    rainy: [
      { category: 'clothing', item: { id: 17, text: 'Rain Gear', checked: false } },
      { category: 'gear', item: { id: 18, text: 'Waterproof Pack Cover', checked: false } },
    ],
  },
};

module.exports = checklistData;