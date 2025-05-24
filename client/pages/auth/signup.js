import { useState } from "react";
import axios from "axios";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        try{
        const response = await axios.post("/api/users/signup", { email, password })
        }
        catch (error) {
            setError(error.response.data.errors);
            // Handle error (e.g., show error message)
        }
        // You can also send the data to your backend API for further processing
    };

    return (
        <div className="container">
            <h1>Sign Up</h1>
            {error.length > 0 && (
                <div className="alert alert-danger">
                    <ul>
                        {error.map((err, index) => (
                            <li key={index}>{err.message}</li>
                        ))}
                    </ul>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}