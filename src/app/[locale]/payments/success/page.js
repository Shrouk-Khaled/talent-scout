import PaymentStatus from "@/components/payment/paymentStatus/PaymentStatus";

export default async function PaymentSuccessPage({ searchParams }) {
  const { payment_id } = await searchParams;

  return (
    <PaymentStatus
      status="success"
      title="Payment Successful"
      description="Your payment has been completed successfully. Thank you!"
      paymentId={payment_id}
    />
  );
}