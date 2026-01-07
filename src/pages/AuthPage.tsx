import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Star, Phone, User, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

type AuthMode = "login" | "signup";
type Denomination = "sunni" | "shia" | "hanafi";

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [denomination, setDenomination] = useState<Denomination>("sunni");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  const formatPhoneAsEmail = (phoneNumber: string) => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    return `${cleanPhone}@muslimalmuslim.app`;
  };

  const handleLogin = async () => {
    if (!phone || !password) {
      toast({ title: language === "ur" ? "خرابی" : "Error", description: language === "ur" ? "فون نمبر اور پاس ورڈ درج کریں" : "Please enter phone number and password", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      const email = formatPhoneAsEmail(phone);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({ title: language === "ur" ? "خوش آمدید!" : "Welcome back!", description: language === "ur" ? "لاگ ان کامیاب" : "Login successful" });
      navigate("/");
    } catch (error: any) {
      toast({ title: language === "ur" ? "لاگ ان ناکام" : "Login failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!phone || !password || !fullName) {
      toast({ title: language === "ur" ? "خرابی" : "Error", description: language === "ur" ? "تمام خانے پر کریں" : "Please fill all fields", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      const email = formatPhoneAsEmail(phone);
      const cleanPhone = phone.replace(/\D/g, '');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName, phone_number: cleanPhone }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          user_id: data.user.id,
          phone_number: cleanPhone,
          full_name: fullName,
          denomination: denomination
        });
        
        if (profileError) console.error("Profile creation error:", profileError);
      }
      
      toast({ 
        title: language === "ur" ? "اکاؤنٹ بن گیا!" : "Account created!", 
        description: language === "ur" ? `آپ کا اکاؤنٹ نمبر: ${cleanPhone}` : `Your account number is: ${cleanPhone}` 
      });
      navigate("/");
    } catch (error: any) {
      toast({ title: language === "ur" ? "سائن اپ ناکام" : "Signup failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card border-border">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <LanguageToggle />
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <Moon className="w-10 h-10 fill-gold text-gold" />
            <Star className="w-4 h-4 text-gold absolute -top-1 -right-1 fill-gold" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Muslim al Muslim</h1>
            <p className="text-sm font-arabic text-gold">مسلم المسلم</p>
          </div>
        </div>

        {mode === "login" ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground">{t("auth.welcomeBack")}</h2>
              <p className="text-muted-foreground">{t("auth.loginSubtitle")}</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">{t("auth.accountNumber")}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={language === "ur" ? "پاس ورڈ درج کریں" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button onClick={handleLogin} disabled={loading} className="w-full bg-gold hover:bg-gold/90 text-gold-foreground">
                {loading ? t("auth.loggingIn") : t("auth.login")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            <p className="text-center text-muted-foreground">
              {t("auth.noAccount")}{" "}
              <button onClick={() => setMode("signup")} className="text-gold hover:underline">
                {t("auth.signup")}
              </button>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {step === 1 && (
              <>
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-foreground">{t("auth.createAccount")}</h2>
                  <p className="text-muted-foreground">{t("auth.signupSubtitle")}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">{t("auth.fullName")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        placeholder={language === "ur" ? "محمد عبداللہ" : "Muhammad Abdullah"}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signupPhone">{t("auth.phoneNumber")}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signupPhone"
                        type="tel"
                        placeholder="+92 300 1234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signupPassword">{t("auth.password")}</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      placeholder={language === "ur" ? "پاس ورڈ بنائیں" : "Create a password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <Button onClick={() => setStep(2)} className="w-full bg-gold hover:bg-gold/90 text-gold-foreground">
                    {t("auth.next")}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-foreground">{t("auth.selectDenomination")}</h2>
                  <p className="text-muted-foreground">{t("auth.denominationSubtitle")}</p>
                </div>

                <RadioGroup value={denomination} onValueChange={(v) => setDenomination(v as Denomination)} className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-gold transition-colors">
                    <RadioGroupItem value="sunni" id="sunni" />
                    <Label htmlFor="sunni" className="flex-1 cursor-pointer">
                      <span className="font-semibold">{language === "ur" ? "سنی" : "Sunni"}</span>
                      <p className="text-sm text-muted-foreground">أهل السنة والجماعة</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-gold transition-colors">
                    <RadioGroupItem value="shia" id="shia" />
                    <Label htmlFor="shia" className="flex-1 cursor-pointer">
                      <span className="font-semibold">{language === "ur" ? "شیعہ" : "Shia"}</span>
                      <p className="text-sm text-muted-foreground">الشيعة</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-gold transition-colors">
                    <RadioGroupItem value="hanafi" id="hanafi" />
                    <Label htmlFor="hanafi" className="flex-1 cursor-pointer">
                      <span className="font-semibold">{language === "ur" ? "حنفی" : "Hanafi"}</span>
                      <p className="text-sm text-muted-foreground">المذهب الحنفي</p>
                    </Label>
                  </div>
                </RadioGroup>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    {t("auth.back")}
                  </Button>
                  <Button onClick={handleSignup} disabled={loading} className="flex-1 bg-gold hover:bg-gold/90 text-gold-foreground">
                    {loading ? t("auth.creating") : t("auth.createAccountBtn")}
                  </Button>
                </div>
              </>
            )}

            <p className="text-center text-muted-foreground">
              {t("auth.hasAccount")}{" "}
              <button onClick={() => { setMode("login"); setStep(1); }} className="text-gold hover:underline">
                {t("auth.login")}
              </button>
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AuthPage;
