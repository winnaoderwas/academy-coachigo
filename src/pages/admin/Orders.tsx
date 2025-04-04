
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

// Define types for order data
interface OrderItem {
  id: string;
  course_id: string;
  price: number;
  course: {
    title: string;
  };
}

interface Order {
  id: string;
  user_id: string;
  order_date: string;
  total_amount: number;
  payment_status: string;
  payment_method: string | null;
  invoice_id: string | null;
  profile: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
  order_items: OrderItem[];
}

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'failed':
      return 'bg-purple-300 text-yellow-800 border-red-200';  
    case 'refunded':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const Orders = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          order_date,
          total_amount,
          payment_status,
          payment_method,
          invoice_id,
          profile:profiles!inner(first_name, last_name, email),
          order_items:order_items(id, course_id, price, course:courses!inner(title))
        `)
        .order('order_date', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        console.log('Orders data:', data);
        setOrders(data as unknown as Order[]);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setError(language === 'en' 
        ? 'Error loading orders' 
        : 'Fehler beim Laden der Bestellungen');
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: status })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, payment_status: status } : order
        )
      );
      
      toast({
        title: language === 'en' ? 'Success' : 'Erfolg',
        description: language === 'en' 
          ? 'Order status updated successfully' 
          : 'Bestellstatus erfolgreich aktualisiert',
      });
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: language === 'en' 
          ? 'Failed to update order status' 
          : 'Fehler beim Aktualisieren des Bestellstatus',
        variant: 'destructive',
      });
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 mr-1 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 mr-1 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 mr-1 text-red-600" />;
      case 'failed':
        return <Clock className="h-4 w-4 mr-1 text-yellow-300" />;  
      case 'refunded':
        return <Clock className="h-4 w-4 mr-1 text-red-300" />;  
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {language === 'en' ? 'Orders' : 'Bestellungen'}
          </h1>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border rounded-md p-4">
              <div className="grid grid-cols-5 gap-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {language === 'en' ? 'Orders' : 'Bestellungen'}
        </h1>
        <Button onClick={fetchOrders} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Refresh' : 'Aktualisieren'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{language === 'en' ? 'Order ID' : 'Bestell-ID'}</TableHead>
            <TableHead>{language === 'en' ? 'Customer' : 'Kunde'}</TableHead>
            <TableHead>{language === 'en' ? 'Date' : 'Datum'}</TableHead>
            <TableHead>{language === 'en' ? 'Amount' : 'Betrag'}</TableHead>
            <TableHead>{language === 'en' ? 'Status' : 'Status'}</TableHead>
            <TableHead>{language === 'en' ? 'Actions' : 'Aktionen'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <React.Fragment key={order.id}>
                <TableRow>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 font-mono text-xs"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      {order.id.substring(0, 8)}...
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {order.profile.first_name || ''} {order.profile.last_name || ''}
                    </div>
                    <div className="text-xs text-gray-500">{order.profile.email}</div>
                  </TableCell>
                  <TableCell>{formatDate(order.order_date)}</TableCell>
                  <TableCell>€{order.total_amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(order.payment_status)}>
                      {getStatusIcon(order.payment_status)}
                      {order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          {language === 'en' ? 'Actions' : 'Aktionen'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Completed')}>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          {language === 'en' ? 'Mark as Completed' : 'Als bezahlt markieren'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Pending')}>
                          <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                          {language === 'en' ? 'Mark as Pending' : 'Als ausstehend markieren'}
                        </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Failed')}>
                          <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                          {language === 'en' ? 'Mark as Failed' : 'Als unbezahlt markieren'}
                        </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Refunded')}>
                          <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                          {language === 'en' ? 'Mark as Refunded' : 'Als erstattet markieren'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Cancelled')}>
                          <XCircle className="h-4 w-4 mr-2 text-red-600" />
                          {language === 'en' ? 'Mark as Cancelled' : 'Als storniert markieren'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                {expandedOrder === order.id && (
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={6} className="p-4">
                      <Card className="p-4">
                        <h3 className="font-bold mb-2">
                          {language === 'en' ? 'Order Details' : 'Bestelldetails'}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              {language === 'en' ? 'Payment Method' : 'Zahlungsmethode'}
                            </p>
                            <p>{order.payment_method || '-'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              {language === 'en' ? 'Invoice ID' : 'Rechnungsnummer'}
                            </p>
                            <p>{order.invoice_id || '-'}</p>
                          </div>
                        </div>
                        
                        <h4 className="font-medium mb-2">
                          {language === 'en' ? 'Ordered Items' : 'Bestellte Artikel'}
                        </h4>
                        
                        {order.order_items && order.order_items.length > 0 ? (
                          <ul className="space-y-2">
                            {order.order_items.map((item) => (
                              <li key={item.id} className="flex justify-between border-b pb-2">
                                <span>{item.course.title}</span>
                                <span>€{item.price.toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">
                            {language === 'en' ? 'No items found' : 'Keine Artikel gefunden'}
                          </p>
                        )}
                      </Card>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                {language === 'en' 
                  ? 'No orders found. Orders will appear here when customers make purchases.' 
                  : 'Keine Bestellungen gefunden. Bestellungen werden hier angezeigt, wenn Kunden Einkäufe tätigen.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Orders;
