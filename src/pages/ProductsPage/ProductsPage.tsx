import React, { useEffect, useState } from "react";
import ProductCard from "@/components/productCard/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { IoMdStar } from "react-icons/io";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import toast from "react-hot-toast";


const marks = [
  {
    value: 0,
    label: "",
  },
  {
    value: 30,
    label: "",
  },
  {
    value: 60,
    label: "",
  },
  {
    value: 90,
    label: "",
  },
  {
    value: 120,
    label: "",
  },
  {
    value: 150,
    label: "",
  },
  {
    value: 180,
    label: "",
  },
  {
    value: 210,
    label: "",
  },
];

const ProductsPage: React.FC = () => {
  // Define Product Type
  interface Product {
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
  }

  interface CartItem extends Product {
    quantity: number;
  }

  // Fetch Data from api
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch("https://fakestoreapi.com/products").then((res) => res.json()),
  });


  const allProducts: Product[] = data || [];



  // States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isSortPriceOpen, setIsSortPriceOpne] = useState(false);
  const [value, setValue] = useState<number[]>([0, 200]);
  const [cartItem, setCartItem] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    
    try {
      const saved = localStorage.getItem('cart');
      if (!saved) return [];
      
      const parsed = JSON.parse(saved);
      // Validate parsed data format with quantity check
      if (Array.isArray(parsed) && parsed.every(isCartItem)) {
        return parsed;
      }
      return [];
    } catch (e) {
      console.error('Cart initialization error:', e);
      return [];
    }
  });

  // Updated type guard for CartItem validation
function isCartItem(item: any): item is CartItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'title' in item &&
    'price' in item &&
    'quantity' in item &&
    typeof item.quantity === 'number'
  );
}
 
console.log(selectedRatings)

  // Pagination settings
  const productsPerPage = 12;

  // Handle price filter
  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  // Handle rating filter
  const toggleRating = (rating: number) => {
    setSelectedRatings((prevRatings) =>
      prevRatings.includes(rating)
        ? prevRatings.filter((r) => r !== rating)
        : [...prevRatings, rating]
    );
  };

  // Handle cart
  const handleAddToCart = (product: Product) => {
   setCartItem(prev => {
      // Check if product already exists in cart
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        // If exists, increase quantity
        toast.success("Item quantity updated!", { id: product.id.toString() });
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
       
      }
      toast.success(`${product.title.slice(0,20)} added to cart!`);
      // If new item, add with quantity 1
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Handle sorting toggle
  const toggleSortOrder = (order: string) => {
    setSortOrder(sortOrder === order ? null : order);
  };

  // Filter and sort products
  let filteredProducts = allProducts.filter((product) => {
    return (
      (!selectedCategory || product.category === selectedCategory) &&
      product.price >= value[0] &&
      product.price <= value[1] &&
      (selectedRatings.length === 0 ||
        // selectedRatings.includes(product.rating.rate))
        selectedRatings.some((rating) => {

          if(rating === 3){
            return product.rating.rate <= 3;
          }
          else if(rating === 4){
            return product.rating.rate <= 4;
          }
          else if(rating === 5){
            return product.rating.rate <= 5;
          }
          return product.rating.rate === rating;
        })
    )
  )
  });

  if (sortOrder === "asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // HANDLE RESET FILTER
  const handleResetFilter = ()=>{
    setSelectedCategory("");
    setSortOrder(null)
    setValue([0,200])
    setSelectedRatings([])

  }

useEffect(() => {
  if(cartItem.length){
    localStorage.setItem('cart', JSON.stringify(cartItem));
  }
},[cartItem]);

useEffect(()=>{
  if(error){
    toast.error(error.message)
  }
},[error]);



console.log(allProducts)

  return (
    <div className="container p-1 flex">
      {isPending && <Loader />}
      {/* Sidebar */}
      <div className="w-1/5">
      {/* FILTER */}
      <div className="w-full border p-2 font-medium">
          <ul>
            <li
              className="flex justify-between items-center cursor-pointer p-2"
             
            >
              <span>Filters</span><span onClick={handleResetFilter} className="font-light text-blue-600 cursor-pointer">Reset</span>
             
            </li>
          
          </ul>
        </div>

        {/* Category Filter */}
        <div className="w-full border p-2 font-medium">
          <ul>
            <li
              className="flex justify-between items-center cursor-pointer p-2"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <span>Categories</span>
              <span>
                {isCategoryOpen ? <AiOutlineUp /> : <AiOutlineDown />}
              </span>
            </li>
            {isCategoryOpen && (
              <ul className="ml-4 border-gray-300 transition-all duration-300">
                <li
                  className="text-center p-1 font-light cursor-pointer hover:bg-blue-50"
                  onClick={() => setSelectedCategory("men's clothing")}
                >
                  Men's clothing
                </li>
                <li
                  className="text-center p-1 font-light cursor-pointer hover:bg-blue-50"
                  onClick={() => setSelectedCategory("women's clothing")}
                >
                  Women's clothing
                </li>
                <li
                  className="text-center p-1 font-light cursor-pointer hover:bg-blue-50"
                  onClick={() => setSelectedCategory("electronics")}
                >
                  Electronics
                </li>
                <li
                  className="text-center p-1 font-light cursor-pointer hover:bg-blue-50"
                  onClick={() => setSelectedCategory("jewelery")}
                >
                  Jewelery
                </li>
                
              </ul>
            )}
          </ul>
        </div>

        {/* Price Filter */}
        <div className="w-full border p-2 font-medium">
          <ul>
            <li className="flex justify-between items-center p-2">Price</li>
            <li className="w-full p-2">
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>Min: ₹{value[0]}</span>
                <span>Max: ₹{value[1]}</span>
              </div>
              <Box>
                <Slider
                  value={value}
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  step={30}
                  min={0}
                  max={200}
                  size="small"
                  marks={marks}
                />
              </Box>
            </li>
          </ul>
        </div>

        {/* Rating Filter */}
        <div className="w-full border p-2 font-medium">
          <ul>
            <li
              className="flex justify-between items-center cursor-pointer p-2"
              onClick={() => setIsRatingOpen(!isRatingOpen)}
            >
              <span>Rating</span>
              <span>{isRatingOpen ? <AiOutlineUp /> : <AiOutlineDown />}</span>
            </li>
            {isRatingOpen && (
              <ul className="w-full space-y-1 border-gray-300 pl-2">
                {[3, 4, 5].map((rating) => (
                  <li
                    key={rating}
                    className="flex items-center justify-center space-x-2 cursor-pointer  p-1 rounded transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(rating)}
                      onChange={() => toggleRating(rating)}
                      className="cursor-pointer size-4"
                    />
                    <span className="flex items-center gap-1">
                      {rating} <IoMdStar className="text-yellow-500" />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </ul>
        </div>

        {/* Sort By Price */}
        <div className="w-full border p-2 font-medium">
          <ul>
            <li
              className="flex justify-between items-center cursor-pointer p-2"
              onClick={() => setIsSortPriceOpne(!isSortPriceOpen)}
            >
              <span>Sort By Price</span>
              <span>
                {isSortPriceOpen ? <AiOutlineUp /> : <AiOutlineDown />}
              </span>
            </li>
            {isSortPriceOpen && (
              <ul className="w-full space-y-1   border-gray-300 pl-2">
                <li className="flex justify-center items-center p-1 gap-1">
                  <input
                    type="radio"
                    onChange={() => toggleSortOrder("asc")}
                    checked={sortOrder === "asc"}
                  />
                  <span>Low to High</span>
                </li>
                <li className="flex justify-center items-center p-1 gap-1">
                  <input
                    type="radio"
                    onChange={() => toggleSortOrder("desc")}
                    checked={sortOrder === "desc"}
                  />
                  <span>High to Low</span>
                </li>
              </ul>
            )}
          </ul>
        </div>
      </div>

      {/* Product Grid */}
      <div className="w-3/4  ml-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product, index) => (
            <ProductCard
              key={index}
              {...product}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>

        {/* Pagination */}
       {filteredProducts.length > productsPerPage && <>
        <div className="flex justify-center mt-6 ">
          <Pagination>
            <PaginationContent>
              <PaginationItem className="cursor-pointer">
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem className="cursor-pointer" key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem className="cursor-pointer">
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        </> }
      </div>
    </div>
  );
};

export default ProductsPage;
