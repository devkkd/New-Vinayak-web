import mongoose from "mongoose";
import dotenv from "dotenv";
import Menu from "../models/Menu.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedMenus = async () => {
  try {
    await connectDB();

    // Clear existing menus
    await Menu.deleteMany({});
    console.log("✅ Cleared existing menus");

    // Seed menu data based on Header.jsx structure
    const menus = [
      {
        name: "Home",
        link: "/",
        icon: "/images/Icon/menu-icons/Essential/home.png",
        order: 0,
        hasNestedStructure: false,
        sub: [],
        nestedSub: [],
      },
      {
        name: "Collections",
        link: "/alljewellery",
        icon: "/images/Icon/menu-icons/Group 16.png",
        order: 1,
        hasNestedStructure: false,
        sub: [
          { name: "Gold Wedding", link: "/wedding-collection/traditional-gold" },
          { name: "Gold Traditional", link: "/gold" },
          { name: "Gold rajasthani collection", link: "/gold/rajasthani" },
          { name: "Rose gold collection", link: "/gold/rose-gold" },
          { name: "Diamond Wedding collection", link: "/wedding-collection/traditional-gold" },
          { name: "Diamond Solitaire", link: "/diamond/solitaire" },
          { name: "Silver Utensils", link: "/silver/utensils" },
          { name: "Silver traditional jewellery", link: "/silver/traditional" },
          { name: "Silver fancy jewellery", link: "/silver/fancy" },
          { name: "Gift Collection", link: "/gifting" },
        ],
        nestedSub: [],
      },
      {
        name: "Gold",
        link: "/gold",
        icon: "/images/Icon/menu-icons/Group 56251.png",
        order: 2,
        hasNestedStructure: false,
        sub: [
          { name: "Ring", link: "/gold/ring" },
          { name: "Earrings", link: "/gold/earrings" },
          { name: "Necklace - 22 karat - 18 karat", link: "/gold/necklace" },
          { name: "Bangles", link: "/gold/bangles" },
          { name: "Mangalsutra", link: "/gold/mangalsutra" },
          { name: "Chains", link: "/gold/chains" },
          { name: "Bracelet", link: "/gold/bracelet" },
          { name: "Pendal set", link: "/gold/pendal-set" },
          { name: "Pendant", link: "/gold/pendant" },
        ],
        nestedSub: [],
      },
      {
        name: "Diamond",
        link: "/diamond",
        icon: "/images/Icon/menu-icons/Vector.png",
        order: 3,
        hasNestedStructure: false,
        sub: [
          { name: "Ring", link: "/diamond/ring" },
          { name: "Earrings", link: "/diamond/earrings" },
          { name: "Necklace", link: "/diamond/necklace" },
          { name: "Bangles", link: "/diamond/bangles" },
          { name: "Mangalsutra", link: "/diamond/mangalsutra" },
          { name: "Pendal set", link: "/diamond/pendal-set" },
          { name: "Pendant", link: "/diamond/pendant" },
          { name: "Men's", link: "/diamond/mens" },
        ],
        nestedSub: [],
      },
      {
        name: "Silver",
        link: "/silver",
        icon: "/images/Icon/menu-icons/Group.png",
        order: 4,
        hasNestedStructure: false,
        sub: [
          { name: "Utensils", link: "/silver/utensils" },
          { name: "Anklets / payals", link: "/silver/anklets-payals" },
          { name: "Kamar belt or satka", link: "/silver/kamar-belt-satka" },
          { name: "Pooja articles", link: "/silver/pooja-articles" },
          { name: "Ring", link: "/silver/ring" },
          { name: "Earrings", link: "/silver/earrings" },
          { name: "Pendant", link: "/silver/pendant" },
          { name: "Chains", link: "/silver/chains" },
          { name: "Pendal set", link: "/silver/pendal-set" },
          { name: "Necklace", link: "/silver/necklace" },
          { name: "Bangles", link: "/silver/bangles" },
          { name: "Bracelet", link: "/silver/bracelet" },
          { name: "Mangalsutra", link: "/silver/mangalsutra" },
          { name: "Watches", link: "/silver/watches" },
        ],
        nestedSub: [],
      },
      {
        name: "Mens",
        link: "/mens",
        icon: "/public/images/Icon/menu-icons/Users/profile.png",
        order: 5,
        hasNestedStructure: true,
        sub: [],
        nestedSub: [
          {
            category: "Gold",
            items: [
              { name: "Gold Rings", link: "/mens/gold-rings" },
              { name: "Gold Chains", link: "/mens/gold-chains" },
              { name: "Gold Kadas/Bracelet", link: "/mens/gold-bracelet" },
            ],
          },
          {
            category: "Silver",
            items: [
              { name: "Silver Rings", link: "/mens/silver-rings" },
              { name: "Silver Chains", link: "/mens/silver-chains" },
              { name: "Silver Kadas/Bracelet", link: "/mens/silver-bracelet" },
              { name: "Others", link: "/mens/silver-watches" },
            ],
          },
          {
            category: "Diamond",
            items: [
              { name: "Diamond Rings", link: "/mens/diamond-rings" },
              { name: "Diamond Bracelet", link: "/mens/diamond-bracelet" },
              { name: "Others", link: "/mens/silver-watches" },
            ],
          },
        ],
      },
      {
        name: "Coins",
        link: "/coins",
        icon: "/images/Icon/menu-icons/Group 56253.png",
        order: 6,
        hasNestedStructure: false,
        sub: [
          { name: "Gold", link: "/coins/gold" },
          { name: "Silver", link: "/coins/silver" },
        ],
        nestedSub: [],
      },
      {
        name: "Gifting",
        link: "/gifting",
        icon: "/images/Icon/menu-icons/Group 15.png",
        order: 7,
        hasNestedStructure: false,
        sub: [
          { name: "Starting from 250-500", link: "/gifting/250-500" },
          { name: "500-1000", link: "/gifting/500-1000" },
          { name: "1k-2k", link: "/gifting/1k-2k" },
          { name: "2k-5k", link: "/gifting/2k-5k" },
          { name: "5k-10k", link: "/gifting/5k-10k" },
          { name: "10k-15k", link: "/gifting/10k-15k" },
          { name: "15k-20k", link: "/gifting/15k-20k" },
          { name: "20k or Above 20k", link: "/gifting/20k-above" },
          { name: "Exclusive", link: "/gifting/exclusive" },
        ],
        nestedSub: [],
      },
      {
        name: "Birth Stones",
        link: "/birthstones",
        icon: "/images/Icon/menu-icons/Group 56254.png",
        order: 8,
        hasNestedStructure: false,
        sub: [
          { name: "Rashi Ratan", link: "/birthstones/rashi-ratan" },
          { name: "Emerald", link: "/birthstones/emerald" },
          { name: "PukhRaj", link: "/birthstones/pukraj" },
        ],
        nestedSub: [],
      },
    ];

    await Menu.insertMany(menus);
    console.log(`✅ Seeded ${menus.length} menu items`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding menus:", error);
    process.exit(1);
  }
};

seedMenus();


