import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from 'next/router';

const NewTicket = () => {

    const [title,setTitle] = useState("");
    const [price,setPrice] = useState(0);
    const {doRequest, errors} = useRequest({url: "/api/tickets", method: "post", body: {title, price}, onSuccess: (data) => console.log(data) });

    const onBlur = () => {
        const value = parseFloat(price);

        if(isNaN(value)) {
            return;
        }

        setPrice(value.toFixed(2));
    }

    const handleTitle = (e) => {
        setTitle(e.target.value);
    }

    const handlePrice = (e) => {
        setPrice(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        doRequest();

        Router.push("/")

    }

    return (<div>
        <h1>Create Ticket</h1>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Title</label>
                <input value={title} onChange={handleTitle} className="form-control"></input>
            </div>
            <div className="form-group">
                <label>Price</label>
                <input value={price} onChange={handlePrice} className="form-control"></input>
            </div>
            {errors}
            <button className="btn btn-primary">Submit</button>
        </form>
    </div>)
}


export default NewTicket;