"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface DataType {
  id: number;
  brand: string;
  thumbnail: string;
  title: string;
}

const Products = () => {
  const router = useRouter();
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    (async () => {
      const data = await fetch("https://dummyjson.com/products?limit=10");
      const result = await data.json();
      setData(result.products);
    })();
  }, []);

  return (
    <div className="w-screen h-screen bg-white px-2 py-6 flex flex-col items-start justify-start gap-4">
      <button onClick={() => router.back()} className="self-start">
        back
      </button>
      <div className="w-full overflow-auto flex flex-col items-center justify-start gap-3 grow">
        {data.map(({ id, brand, thumbnail, title }) => (
          <div
            className="flex items-center justify-start border border-solid border-black w-full h-24"
            key={id}
            onClick={() => router.push(`/product/${id}`)}
          >
            <Image
              src={thumbnail}
              width={100}
              height={100}
              alt={title}
              className="h-20"
            />
            <div className="flex flex-col items-start justify-start gap-2 ml-6">
              <p>{title}</p>
              <p>{brand}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
