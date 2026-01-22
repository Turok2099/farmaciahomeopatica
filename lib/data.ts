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
        name: "ACEITE DE ÁRNICA",
        slug: "aceite-de-arnica",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 170,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046012/1_x62eo0.png",
        inStock: true
    },
    {
        id: "2",
        name: "ACEITE DE CALÉNDULA",
        slug: "aceite-de-calendula",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 170,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046012/2_hhejjq.png",
        inStock: true
    },
    {
        id: "3",
        name: "ACEITE DE HIERBA SANTA",
        slug: "aceite-de-hierba-santa",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 350,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046011/3_jbshre.png",
        inStock: true
    },
    {
        id: "4",
        name: "ACEITE DE VERBASCUM",
        slug: "aceite-de-verbascum",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 350,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046012/4_dmdcb2.png",
        inStock: true
    },
    {
        id: "5",
        name: "ARGENTUM 250 ML",
        slug: "argentum-250-ml",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 860,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046012/5_xngxil.png",
        inStock: true
    },
    {
        id: "6",
        name: "ARGENTUM LITRO",
        slug: "argentum-litro",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 2800,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046013/6_zfchnn.png",
        inStock: true
    },
    {
        id: "7",
        name: "BOTIQUÍN VIAJE",
        slug: "botiquin-viaje",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 1200,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046012/7_klwebm.png",
        inStock: true
    },
    {
        id: "8",
        name: "COLÁGENO HIDROLIZADO",
        slug: "colageno-hidrolizado",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 1000,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046014/8_hh4vvn.png",
        inStock: true
    },
    {
        id: "9",
        name: "GEL ÁRNICA",
        slug: "gel-arnica",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 190,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046014/9_xvgvff.png",
        inStock: true
    },
    {
        id: "10",
        name: "GEL CALÉNDULA",
        slug: "gel-calendula",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 190,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046014/10_d2df72.png",
        inStock: true
    },
    {
        id: "11",
        name: "GEL FOCUS",
        slug: "gel-focus",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 300,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046013/11_jmcajy.png",
        inStock: true
    },
    {
        id: "12",
        name: "GEL HAMAMELIS",
        slug: "gel-hamamelis",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 190,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046015/12_jcdkwb.png",
        inStock: true
    },
    {
        id: "13",
        name: "JARABE DE DROSERA",
        slug: "jarabe-de-drosera",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 185,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046015/12_jcdkwb.png",
        inStock: true
    },
    {
        id: "14",
        name: "KIT SCHUSSLER FIT",
        slug: "kit-schussler-fit",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 1265,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046015/14_hooitx.png",
        inStock: true
    },
    {
        id: "15",
        name: "MAGNESIUM 250 ML",
        slug: "magnesium-250-ml",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 860,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046017/15_hask5j.png",
        inStock: true
    },
    {
        id: "16",
        name: "MAGNESIUM LITRO",
        slug: "magnesium-litro",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 2800,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046016/16_bpbasg.png",
        inStock: true
    },
    {
        id: "17",
        name: "NATRUM CARB. 250 ML",
        slug: "natrum-carb-250-ml",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 860,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046017/17_ixoseu.png",
        inStock: true
    },
    {
        id: "18",
        name: "NATRUM CARB. LITRO",
        slug: "natrum-carb-litro",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 2800,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046018/18_gc3yab.png",
        inStock: true
    },
    {
        id: "19",
        name: "POLVO ECHINACEA CHICO",
        slug: "polvo-echinacea-chico",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 180,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046017/19_yhzlcr.png",
        inStock: true
    },
    {
        id: "20",
        name: "POLVO ECHINACEA GRANDE",
        slug: "polvo-echinacea-grande",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 500,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046017/20_bibppz.png",
        inStock: true
    },
    {
        id: "21",
        name: "REGENERADOR ORGÁNICO II",
        slug: "regenerador-organico-ii",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 880,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046017/20_bibppz.png",
        inStock: true
    },
    {
        id: "22",
        name: "SALES DE SCHUSSLER",
        slug: "sales-de-schussler",
        description: "Producto de alta calidad de la categoría VARIOS.",
        price: 185,
        category: "VARIOS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046018/22_diagt4.png",
        inStock: true
    },
    {
        id: "23",
        name: "ÁRNICA MONTANA",
        slug: "arnica-montana-pomadas",
        description: "Producto de la categoría POMADAS.",
        price: 200,
        category: "POMADAS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046018/23_fyibne.png",
        inStock: true
    },
    {
        id: "24",
        name: "BELLADONA",
        slug: "belladona-pomadas",
        description: "Producto de la categoría POMADAS.",
        price: 200,
        category: "POMADAS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046018/24_c5iazi.png",
        inStock: true
    },
    {
        id: "25",
        name: "CALÉNDULA",
        slug: "calendula-pomadas",
        description: "Producto de la categoría POMADAS.",
        price: 200,
        category: "POMADAS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046019/25_d3qxko.png",
        inStock: true
    },
    {
        id: "26",
        name: "HAMAMELIS",
        slug: "hamamelis-pomadas",
        description: "Producto de la categoría POMADAS.",
        price: 200,
        category: "POMADAS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046019/26_j13e96.png",
        inStock: true
    },
    {
        id: "27",
        name: "SCHUSSLER",
        slug: "schussler-pomadas",
        description: "Producto de la categoría POMADAS.",
        price: 200,
        category: "POMADAS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046019/27_mux5gj.png",
        inStock: true
    },
    {
        id: "28",
        name: "COLESTEROL TRIGLICÉRIDOS",
        slug: "colesterol-trigliceridos",
        description: "Producto de la categoría TINTURAS.",
        price: 380,
        category: "TINTURAS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046019/28_xtbk5f.png",
        inStock: true
    },
    {
        id: "29",
        name: "DIABETES PLUS",
        slug: "diabetes-plus",
        description: "Producto de la categoría TINTURAS.",
        price: 380,
        category: "TINTURAS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046019/29_vgk52b.png",
        inStock: true
    },
    {
        id: "30",
        name: "INMUNE PLUS",
        slug: "inmune-plus",
        description: "Producto de la categoría TINTURAS.",
        price: 410,
        category: "TINTURAS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046020/30_rt91an.png",
        inStock: true
    },
    {
        id: "31",
        name: "MICOSIS",
        slug: "micosis",
        description: "Producto de la categoría TINTURAS.",
        price: 170,
        category: "TINTURAS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046020/31_j20fsm.png",
        inStock: true
    },
    {
        id: "32",
        name: "MEMORIA",
        slug: "memoria",
        description: "Producto de la categoría TINTURAS.",
        price: 385,
        category: "TINTURAS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046020/32_q1mpns.png",
        inStock: true
    },
    {
        id: "33",
        name: "VERRUGAZ MEZQUINOS",
        slug: "verrugaz-mezquinos",
        description: "Producto de la categoría TINTURAS.",
        price: 200,
        category: "TINTURAS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046020/33_whvadx.png",
        inStock: true
    },
    {
        id: "34",
        name: "YUMEL",
        slug: "yumel",
        description: "Producto de la categoría TINTURAS.",
        price: 200,
        category: "TINTURAS",
        image: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1769046020/34_ee2vtd.png",
        inStock: true
    }
];
