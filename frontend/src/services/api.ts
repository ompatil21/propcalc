// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createProperty(propertyData: any) {
    const res = await fetch('http://localhost:5000/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData),
    })
  
    if (!res.ok) {
      throw new Error('Failed to create property')
    }
  
    return res.json()
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function simulateProperty(data: any) {
  const res = await fetch('http://localhost:5000/api/simulation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch simulation results');
  }

  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function calculateTax(data: any) {
  const res = await fetch('http://localhost:5000/api/tax-calc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to calculate tax');
  }

  return res.json();
}

// OPTIONAL: Portfolio Overview
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getPortfolioOverview(data: any) {
  const res = await fetch('http://localhost:5000/api/portfolio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch portfolio overview');
  }

  return res.json();
}
