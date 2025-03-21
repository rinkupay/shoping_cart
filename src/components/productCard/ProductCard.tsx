import React from "react";
import { Button } from "../ui/button";
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
interface ProductProps {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  onAddToCart: () => void; 
}

const ProductCard: React.FC<ProductProps> = ({ title,image,price,category, description,rating, onAddToCart }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 transform transition hover:shadow-lg hover:border-s-amber-50">

      {/* Product Image */}
      <img src={image} alt={title} className="w-full h-40 object-cover rounded-md" />

      {/* Product Details */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">{title.slice(0,18)}</h3>
        <p className=" font-medium">Category: <span className="font-light ">{category}</span></p>
        <p className=" font-medium w-full flex  items-center">Ratings: <span className="font-light "> <Stack spacing={1}>
     
      <Rating name="half-rating-read" size="small" defaultValue={rating.rate} precision={0.5} readOnly />
    </Stack></span></p>
        <p className="text-gray-600 text-sm">{description.slice(0,45)}</p>

        {/* Price & Color */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-blue-600 font-bold">₹{price.toFixed(2)}</p>
          {/* <span className="text-sm px-2 py-1 rounded-full bg-gray-200">{color}</span> */}
        </div>

        {/* Add to Cart Button */}
        <Button onClick={onAddToCart} variant={"outline" } className= "w-full cursor-pointer mt-1 bg-blue-600 text-white hover:bg-blue-700 hover:text-white">Add to cart</Button>
      </div>
    </div>
  );
};

export default ProductCard;
