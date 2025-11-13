import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { storageUtils } from "@/utils/localStorage";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const settings = storageUtils.getSettings();
    const validUsername = settings.adminUsername || "Admin";
    const validPassword = settings.adminPassword || "admin123";
    
    if (username === validUsername && password === validPassword) {
      localStorage.setItem("isAdminLoggedIn", "true");
      toast({
        title: "Login berhasil",
        description: "Selamat datang, Admin!",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Login gagal",
        description: "Username atau password salah",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-primary p-4 rounded-full">
                <BookOpen className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Login Dashboard</CardTitle>
            <CardDescription className="text-center">
              Masukkan username dan password untuk mengakses dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
