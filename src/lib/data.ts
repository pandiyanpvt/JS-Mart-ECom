
export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    image: string;
    description: string;
    weight: string;
    rating: number;
    reviews: number;
    badges?: string[];
}

export const categories = [
    { id: "all", name: "All Categories" },
    { id: "vegetables", name: "Vegetables" },
    { id: "fruits", name: "Fruits" },
    { id: "dairy", name: "Dairy" },
    { id: "bakery", name: "Bakery" },
    { id: "beverages", name: "Beverages" },
    { id: "snacks", name: "Snacks" },
];

export const products: Product[] = [
    {
        id: "1",
        name: "Organic Green Big Sweet Pepper",
        category: "vegetables",
        price: 24.00,
        image: "https://images.unsplash.com/photo-1601648764658-00d0246a48f4?w=500&auto=format&fit=crop&q=60",
        description: "Crisp and sweet organic green peppers.",
        weight: "1000gm",
        rating: 4.8,
        reviews: 5,
        badges: ["Best Sale", "Frozen"],
    },
    {
        id: "2",
        name: "Seoul Yopokki Spicy 4 flavors",
        category: "snacks",
        price: 0.40,
        image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500&auto=format&fit=crop&q=60",
        description: "Spicy and delicious Korean Topokki.",
        weight: "1pack",
        rating: 4.8,
        reviews: 5,
        badges: [],
    },
    {
        id: "3",
        name: "The banana cavendish fruit",
        category: "fruits",
        price: 0.40,
        image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&auto=format&fit=crop&q=60",
        description: "Sweet banana cavendish, popular in Malaysia.",
        weight: "6pcs",
        rating: 4.8,
        reviews: 5,
        badges: [],
    },
    {
        id: "4",
        name: "Organic 100% Italian hass",
        category: "fruits",
        price: 12.35,
        originalPrice: 15.60,
        image: "https://images.unsplash.com/photo-1599923831846-3b1236531382?w=500&auto=format&fit=crop&q=60",
        description: "Creamy 100% natural Italian avocados.",
        weight: "1000gm",
        rating: 4.8,
        reviews: 5,
        badges: ["20% OFF"],
    },
    {
        id: "5",
        name: "Mahin Brand, Extra Long Grain",
        category: "food_cupboard",
        price: 13.25,
        originalPrice: 14.50,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60",
        description: "Premium extra long grain basmati rice.",
        weight: "5kg",
        rating: 4.8,
        reviews: 5,
        badges: ["15% OFF"],
    },
    {
        id: "6",
        name: "Lemon Big Imported from South Africa",
        category: "fruits",
        price: 4.40,
        image: "https://images.unsplash.com/photo-1590502593747-df8f31bdce78?w=500&auto=format&fit=crop&q=60",
        description: "Zesty and fresh imported lemons.",
        weight: "1kg",
        rating: 4.8,
        reviews: 5,
        badges: [],
    },
    {
        id: "7",
        name: "Lipton Lemon Green Tea",
        category: "beverages",
        price: 2.35,
        originalPrice: 3.60,
        image: "https://images.unsplash.com/photo-1563729784474-d779b95f3ea5?w=500&auto=format&fit=crop&q=60",
        description: "Refreshing lemon green tea from China.",
        weight: "200gm",
        rating: 4.8,
        reviews: 5,
        badges: ["Organic", "20% OFF"],
    },
    {
        id: "8",
        name: "Lay's Tomato Ketchup Chips",
        category: "snacks",
        price: 4.40,
        image: "https://images.unsplash.com/photo-1566478919030-26176af463c6?w=500&auto=format&fit=crop&q=60",
        description: "Tangy tomato ketchup flavored chips.",
        weight: "12 pack",
        rating: 4.8,
        reviews: 5,
        badges: [],
    },
    {
        id: "9",
        name: "Arabian best Beef Meat Kirkland",
        category: "meats",
        price: 24.00,
        image: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=500&auto=format&fit=crop&q=60",
        description: "Signature roast beef meat.",
        weight: "1kg",
        rating: 4.8,
        reviews: 5,
        badges: ["Best Sale"],
    },
    {
        id: "10",
        name: "APILIFE - Flavorful & Nutritious",
        category: "food_cupboard",
        price: 30.25,
        image: "https://images.unsplash.com/photo-1555243896-c709bfa0b564?w=500&auto=format&fit=crop&q=60",
        description: "Black Seed Honey.",
        weight: "500g",
        rating: 4.8,
        reviews: 5,
        badges: [],
    }
];
