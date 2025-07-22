import useRequest from "../../hooks/use-request";
import { useState, useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import { useRouter } from "next/router";

function OrderShow({ order, currentUser }) {
    const router = useRouter();
    const { expiresAt } = order;
    const expirationDate = new Date(expiresAt);
    const formattedDate = expirationDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const [timeRemaining, setTimeRemaining] = useState();

    useEffect(() => {
        const timer = setInterval(() => {
            const timeLeft = Math.round((expirationDate.getTime() - Date.now()) / 1000);
            setTimeRemaining(timeLeft);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const { doRequest, errors } = useRequest({
        url: "/api/payments",
        method: "post",
        body: {
            orderId: order.id
        },
        onSuccess: () => {
            router.push("/orders");
        }
    });

    if (timeRemaining <= 0) {
        return <div>Order expired</div>;
    }

    return <div>
        <h1>Order {order.id}</h1>
        <h4>Time left: {timeRemaining} seconds to expire</h4>
        {errors}
        <StripeCheckout
            token={({ id }) => doRequest({ token: id })}
            stripeKey="pk_test_51Rla5LBBxR02IShlpF8iHld3DMq9NiUoFG5aLsNGAp2vPXDfwONOWrTNqURw7P0P4UnUzQGiO0AP41cvDzlzz83P00RloIE1zh"
            amount={order.ticket.price * 100}
            email={currentUser.email}
        />
    </div>;
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data };
};

export default OrderShow;