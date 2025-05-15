
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, ArrowLeft, MinusCircle, PlusCircle, Check, Truck, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
  quantity?: number;
}

interface ProductDetailViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  if (!product) return null;
  
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    
    // Simulating API call
    setTimeout(() => {
      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} added to your cart`,
        action: (
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-1" />
          </div>
        ),
      });
      
      setIsAddingToCart(false);
    }, 1000);
  };
  
  const increaseQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  
  const discountPercentage = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            <Button 
              variant="ghost" 
              className="p-0 h-auto mb-2" 
              onClick={onClose}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Product details
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="rounded-lg overflow-hidden border mb-4 aspect-square">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              <div className="border rounded-md overflow-hidden w-16 h-16 cursor-pointer hover:border-primary">
                <img 
                  src={product.image} 
                  alt={`${product.name} thumbnail`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="border rounded-md overflow-hidden w-16 h-16 cursor-pointer">
                <img 
                  src={product.image} 
                  alt={`${product.name} thumbnail`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="border rounded-md overflow-hidden w-16 h-16 cursor-pointer">
                <img 
                  src={product.image} 
                  alt={`${product.name} thumbnail`} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Badge className="mb-2">{product.category}</Badge>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              
              <div className="mt-1 mb-2">
                {/* Star rating */}
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < product.rating ? 'text-amber-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {product.rating}/5 ({Math.floor(Math.random() * 50) + 10} reviews)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-3">
                <span className="text-2xl font-bold">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      {discountPercentage}% off
                    </Badge>
                  </>
                )}
              </div>
            </div>
            
            <p className="text-muted-foreground">
              {product.description}
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Info className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm">GST included</span>
              </div>
              <div className="flex items-center">
                <Truck className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm">Delivery within 3-7 working days</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-none"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-none"
                  onClick={increaseQuantity}
                  disabled={quantity >= 10}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {product.inStock ? (
                  <span className="text-green-600">In Stock</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                className="flex-1" 
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-r-transparent animate-spin rounded-full mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button variant="outline">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-start">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailView;
