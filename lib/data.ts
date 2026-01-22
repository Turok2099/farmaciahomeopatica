export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    category: string;
    image: string;
    inStock: boolean;
}

export const products: Product[] = [
    {
        id: "1",
        name: "Arnica Montana 30C",
        slug: "arnica-montana-30c",
        description: "Ayuda a aliviar dolores musculares, moretones e hinchazón.",
        price: 150.00,
        category: "Dolor",
        image: "/placeholder-arnica.jpg", // We would replace this with real images later
        inStock: true,
    },
    {
        id: "2",
        name: "Belladonna 6C",
        slug: "belladonna-6c",
        description: "Útil para fiebres repentinas e inflamaciones.",
        price: 145.00,
        category: "Fiebre",
        image: "/placeholder-belladonna.jpg",
        inStock: true,
    },
    {
        id: "3",
        name: "Nux Vomica 30C",
        slug: "nux-vomica-30c",
        description: "Alivio para indigestión y malestares estomacales.",
        price: 160.00,
        category: "Digestivo",
        image: "/placeholder-nux.jpg",
        inStock: true,
    },
    {
        id: "4",
        name: "Oscillococcinum",
        slug: "oscillococcinum",
        description: "Para síntomas similares a la gripe.",
        price: 350.00,
        category: "Gripe",
        image: "/placeholder-oscillo.jpg",
        inStock: true,
    },
    {
        id: "5",
        name: "Ignatia Amara 30C",
        slug: "ignatia-amara-30c",
        description: "Ayuda con el estrés emocional y la ansiedad.",
        price: 155.00,
        category: "Emocional",
        image: "/placeholder-ignatia.jpg",
        inStock: true,
    },
];
