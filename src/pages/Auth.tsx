import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, signupSchema } from "@/lib/validations";
import { z } from "zod";

const Auth = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn, signUp } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      const validatedData = loginSchema.parse({
        email: loginEmail,
        password: loginPassword,
      });
      
      setIsLoading(true);
      const { error } = await signIn(validatedData.email, validatedData.password);
      
      if (error) {
        toast({
          title: "Login gagal",
          description: error.message === "Invalid login credentials" 
            ? "Email atau password salah"
            : error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login berhasil",
          description: "Selamat datang!",
        });
        navigate("/dashboard");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[`login_${error.path[0]}`] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      const validatedData = signupSchema.parse({
        email: signupEmail,
        password: signupPassword,
        confirmPassword: confirmPassword,
      });
      
      setIsLoading(true);
      const { error } = await signUp(validatedData.email, validatedData.password);
      
      if (error) {
        let errorMessage = error.message;
        if (error.message.includes("already registered")) {
          errorMessage = "Email sudah terdaftar. Silakan login atau gunakan email lain.";
        }
        toast({
          title: "Pendaftaran gagal",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Pendaftaran berhasil",
          description: "Akun berhasil dibuat. Silakan login.",
        });
        // Clear signup form and switch to login
        setSignupEmail("");
        setSignupPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[`signup_${error.path[0]}`] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-primary p-4 rounded-full">
                <BookOpen className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Dashboard Admin</CardTitle>
            <CardDescription className="text-center">
              Login atau daftar untuk mengakses dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Daftar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@example.com"
                      disabled={isLoading}
                      maxLength={255}
                    />
                    {errors.login_email && (
                      <p className="text-sm text-destructive">{errors.login_email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Masukkan password"
                      disabled={isLoading}
                      maxLength={128}
                    />
                    {errors.login_password && (
                      <p className="text-sm text-destructive">{errors.login_password}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1" size="lg" disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/")}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Kembali
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="email@example.com"
                      disabled={isLoading}
                      maxLength={255}
                    />
                    {errors.signup_email && (
                      <p className="text-sm text-destructive">{errors.signup_email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      disabled={isLoading}
                      maxLength={128}
                    />
                    {errors.signup_password && (
                      <p className="text-sm text-destructive">{errors.signup_password}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password"
                      disabled={isLoading}
                      maxLength={128}
                    />
                    {errors.signup_confirmPassword && (
                      <p className="text-sm text-destructive">{errors.signup_confirmPassword}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1" size="lg" disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Daftar"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/")}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Kembali
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
