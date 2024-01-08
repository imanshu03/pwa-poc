"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface DataType {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  thumbnail: string;
  brand: string;
}

const Products = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const router = useRouter();
  const [data, setData] = useState<DataType | null>(null);

  useEffect(() => {
    (async () => {
      const data = await fetch(`https://dummyjson.com/products/${slug}`);
      const result = await data.json();
      setData(result);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-screen h-screen bg-white px-2 py-6 flex flex-col items-start justify-start gap-4">
      <button onClick={() => router.back()} className="self-start">
        back
      </button>
      <div className="grow" />
      {data ? (
        <div className="flex flex-col items-start justify-start gap-3">
          <Image
            src={data.thumbnail}
            width={100}
            height={100}
            alt={data.title}
            className="h-20"
          />
          <p>Model: {data.title}</p>
          <p>Brand: {data.brand}</p>
          <p>Description: {data.description}</p>
          <p>Rating: {data.rating}</p>
          <p>Price: {data.price}</p>
          <p></p>
        </div>
      ) : null}
      <div className="grow" />
    </div>
  );
};

export default Products;
