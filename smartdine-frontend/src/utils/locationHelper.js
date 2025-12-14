
export const restaurantAreas = {
  Coimbatore: [
    "Peelamedu", "RS Puram", "Gandhipuram", "Race Course", "Saravanampatti",
    "Town Hall", "Kavundampalayam", "Ukkadam", "Sitra", "Singanallur"
  ],
  Chennai: [
    "T Nagar", "Anna Nagar", "Velachery", "Porur", "Tambaram",
    "Adyar", "Vadapalani", "Ashok Nagar", "Pallavaram", "Guindy"
  ],
  Bangalore: [
    "Whitefield", "Indiranagar", "Koramangala", "Jayanagar", "HSR Layout",
    "JP Nagar", "Marathahalli", "Bellandur", "Malleshwaram", "Hebbal"
  ],
  Hyderabad: [
    "Hitech City", "Gachibowli", "Banjara Hills", "Ameerpet", "Secunderabad",
    "Madhapur", "Kukatpally", "Begumpet", "Koti", "Charminar"
  ],
  Mumbai: [
    "Andheri", "Bandra", "Juhu", "Powai", "Colaba",
    "Dadar", "Borivali", "Goregaon", "Malad", "Worli"
  ],
  Delhi: [
    "Connaught Place", "Saket", "Dwarka", "Karol Bagh", "Hauz Khas",
    "Rajouri Garden", "Vasant Kunj", "Janakpuri", "Lajpat Nagar", "Rohini"
  ],
  Pune: [
    "Viman Nagar", "Kothrud", "Koregaon Park", "Hinjewadi", "Wakad",
    "Baner", "Hadapsar", "Magarpatta", "Camp", "Swargate"
  ],
  Default: [
    "City Center", "Near You", "Main Road", "Food Street", "Downtown",
    "Market Area", "Bus Stand Road", "Mall Area", "Central Square",
    "Old Town", "New Colony", "Tech Park", "College Road", "Lake View",
    "Museum Road", "Theater Road", "River Side", "Fort Area"
  ]
};


export function getAreaForRestaurant(restaurantId, city) {
  const areas = restaurantAreas[city] || restaurantAreas.Default;
  return areas[(restaurantId - 1) % areas.length];
}

export function getAreasForCity(city) {
  return restaurantAreas[city] || restaurantAreas.Default;
}
