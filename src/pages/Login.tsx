import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminService from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await AdminService.Login({
                email,
                password,
            });

            // Service handles token storage
            const token = localStorage.getItem("access_token");
            const refreshToken = localStorage.getItem("refresh_token");

            if (token) {
                login(token, refreshToken || "");
                toast.success("Login successful");
                navigate("/dashboard");
            } else {
                toast.error("Invalid response from server");
            }

        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.non_field_errors?.[0] ||
                error.response?.data?.detail ||
                "Failed to login. Please check your credentials.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex items-center justify-center  p-4">
            <div className="w-full max-w-md">


                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Address
                        </Label>
                        <div className="relative gap-3 flex  justify-start items-center">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 " />
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-11 h-11 border-none  outline-none focus-visible:ring-[1px]"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </Label>

                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pl-11 h-11 border-none  outline-none focus-visible:ring-[1px]"
                            />
                        </div>
                    </div>

                    <CardFooter className="flex flex-col space-y-4 pt-2">
                        <Button
                            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>

                        {/* <div className="text-center text-sm text-gray-600">
                            Don't have an account?{" "}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                Sign up
                            </a>
                        </div> */}
                    </CardFooter>
                </form>

            </div>
        </div>
    );
};

export default Login;