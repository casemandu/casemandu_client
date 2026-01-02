import React from "react";
import { Inspirecomponent } from "./Inspirecomponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

async function fetchData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pinterest`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

let categories = [
  {
    id: "art wallpaper",
    name: "Art",
    imageUrl:
      "https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=2070",
  },
  {
    id: "football wallpaper",
    name: "Football",
    imageUrl:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1935",
  },
  {
    id: "abstract wallpaper",
    name: "Abstract",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
  },
  {
    id: "anime wallpaper",
    name: "Anime",
    imageUrl:
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2071",
  },
  {
    id: "music wallpaper",
    name: "Music",
    imageUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070",
  },
  {
    id: "gaming wallpaper",
    name: "Gaming",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
  },
  {
    id: "cars wallpaper",
    name: "Cars",
    imageUrl:
      "https://images.unsplash.com/photo-1751362398745-8794c5ce2187?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3ODAyNDV8MHwxfHNlYXJjaHw2Nnx8Y2FycyUyMHdhbGxwYXBlcnxlbnwwfDF8MXx8MTc1MjkwOTMyMnww&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "movies wallpaper",
    name: "Movies",
    imageUrl:
      "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1974",
  },
];

async function page() {
  const data = await fetchData();

  return (
    <div>
      <div className="px-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Inspire</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Inspirecomponent categories={categories} data={data} />
    </div>
  );
}

export default page;
