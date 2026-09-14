import PaymentStatus from "@/components/payment/paymentStatus/PaymentStatus";

export default async function PaymentFailedPage({ searchParams }) {
  const { payment_id } = await searchParams;

  return (
    <PaymentStatus
      status="failed"
      title="Payment Failed"
      description="We couldn't complete your payment. Please try again."
      paymentId={payment_id}
    />
  );
}