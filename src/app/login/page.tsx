
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { sendPasswordResetEmailAction } from "@/app/actions";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordResetting, setIsPasswordResetting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    if (!auth) {
        toast({
            variant: "destructive",
            title: "Authentication not configured.",
            description: "Please contact support.",
        });
        setIsLoading(false);
        return;
    }
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: "Success!",
        description: "You've successfully logged in.",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "There was a problem with your request.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", { type: "manual", message: "Please enter your email to reset the password." })
      return;
    }
    if (!auth) return;
    setIsPasswordResetting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      // We call our custom email action as well to send a branded email.
      // Firebase handles sending the actual link separately.
      const result = await sendPasswordResetEmailAction({ email, resetLink: window.location.origin }); 
      
      if (result.success) {
          toast({
            title: "Password Reset Email Sent",
            description: "Check your inbox for a link to reset your password.",
          });
      } else {
          // If our custom email fails, we don't need to block the user,
          // as the Firebase email should have still been sent.
          console.warn("Custom password reset email failed to send:", result.error);
           toast({
            title: "Password Reset Email Sent",
            description: "Check your inbox for a link to reset your password. If you don't see it, check your spam folder.",
          });
      }
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Error sending reset email.",
        description: error.message,
      });
    } finally {
      setIsPasswordResetting(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Password</FormLabel>
                      <button 
                        type="button" 
                        onClick={handlePasswordReset} 
                        className="text-sm font-semibold text-accent hover:underline focus:outline-none"
                        disabled={isPasswordResetting}
                      >
                        {isPasswordResetting ? <Loader2 className="animate-spin h-4 w-4" /> : "Forgot Password?"}
                      </button>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading || !auth}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p>
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-accent hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
