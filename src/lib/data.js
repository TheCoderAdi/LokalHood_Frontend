export const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

export const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

export const fakeVendors = [
  {
    name: "Vendor 1",
    profilePhoto:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    latitude: 20.2961,
    longitude: 85.8245,
    role: "Grocery",
    phoneNumber: "1234567890",
  },
  {
    name: "Vendor 2",
    profilePhoto:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    latitude: 20.3,
    longitude: 85.82,
    role: "Chemist",
    phoneNumber: "1234567890",
  },
  {
    name: "Vendor 3",
    profilePhoto:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    latitude: 20.31,
    longitude: 85.83,
    role: "Restaurant",
    phoneNumber: "1234567890",
  },
];

export const vendorRoles = ["grocery", "chemist"];
