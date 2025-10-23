import { usePlaceOrderLogic } from '../components/Checkout/usePlaceOrderLogic';
import BillingForm from '../components/Checkout/billingForm';
import OrderSummary from '../components/Checkout/orderSummary';

const PlaceOrder = () => {
  const placeOrderState = usePlaceOrderLogic();
  const { handleSubmit, error } = placeOrderState;

  return (
    <div className="min-h-screen">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* The <form> tag wraps both components, and its onSubmit is handled by the hook */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <BillingForm {...placeOrderState} />
            <OrderSummary {...placeOrderState} />
          </div>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default PlaceOrder;