
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CartItem, Course } from '@/types';
import { useLanguage } from './LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface CartContextType {
  cart: CartItem[];
  cartItems: string[]; // Add this property for backward compatibility
  addToCart: (courseId: string, quantity?: number) => void;
  removeFromCart: (courseId: string) => void;
  updateQuantity: (courseId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number; // This remains a synchronous function
  getTotalPriceAsync: () => Promise<number>; // Add async version
}

const CartContext = createContext<CartContextType>({
  cart: [],
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getTotalItems: () => 0,
  getTotalPrice: () => 0,
  getTotalPriceAsync: async () => 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [cachedPrices, setCachedPrices] = useState<Record<string, number>>({});

  // Derive cartItems from cart for backward compatibility
  const cartItems = cart.map(item => item.courseId);
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Pre-fetch prices when cart changes
  useEffect(() => {
    if (cart.length > 0) {
      fetchCoursePrices(cart.map(item => item.courseId));
    }
  }, [cart]);

  const fetchCoursePrices = async (courseIds: string[]) => {
    if (courseIds.length === 0) return;
    
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, price')
        .in('id', courseIds);
        
      if (error) {
        console.error('Error fetching course prices:', error);
        return;
      }
      
      const newPrices: Record<string, number> = {};
      data.forEach(course => {
        newPrices[course.id] = course.price;
      });
      
      setCachedPrices(prev => ({...prev, ...newPrices}));
    } catch (error) {
      console.error('Error in fetchCoursePrices:', error);
    }
  };

  const addToCart = (courseId: string, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.courseId === courseId);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.courseId === courseId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        return [...prevCart, { courseId, quantity }];
      }
    });
    
    toast.success(language === 'en' ? 'Course added to cart' : 'Kurs zum Warenkorb hinzugefügt');
  };

  const removeFromCart = (courseId: string) => {
    setCart(prevCart => prevCart.filter(item => item.courseId !== courseId));
    toast.info(language === 'en' ? 'Course removed from cart' : 'Kurs aus dem Warenkorb entfernt');
  };

  const updateQuantity = (courseId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(courseId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.courseId === courseId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Synchronous version that uses cached prices
  const getTotalPrice = () => {
    if (cart.length === 0) return 0;
    
    return cart.reduce((total, item) => {
      const price = cachedPrices[item.courseId] || 0;
      return total + (price * item.quantity);
    }, 0);
  };
  
  // Asynchronous version that fetches from Supabase
  const getTotalPriceAsync = async () => {
    if (cart.length === 0) return 0;
    
    try {
      // Fetch prices for cart items directly from Supabase
      const courseIds = cart.map(item => item.courseId);
      const { data, error } = await supabase
        .from('courses')
        .select('id, price')
        .in('id', courseIds);
        
      if (error) {
        console.error('Error fetching course prices:', error);
        return 0;
      }
      
      // Update cache with fresh prices
      const newPrices: Record<string, number> = {};
      data.forEach(course => {
        newPrices[course.id] = course.price;
      });
      
      setCachedPrices(prev => ({...prev, ...newPrices}));
      
      return cart.reduce((total, item) => {
        const course = data.find(c => c.id === item.courseId);
        return total + (course ? course.price * item.quantity : 0);
      }, 0);
    } catch (error) {
      console.error('Error calculating total price:', error);
      return 0;
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartItems,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getTotalItems, 
      getTotalPrice,
      getTotalPriceAsync
    }}>
      {children}
    </CartContext.Provider>
  );
};
