import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Star, Phone, User, ArrowRight, ArrowLeft, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type AuthMode = "login" | "signup" | "forgot";
type Denomination = "sunni" | "shia" | "hanafi";
type ResetStep = "phone" | "otp" | "newPassword";

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [denomination, setDenomination] = useState<Denomination>("sunni");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Password reset states
  const [resetStep, setResetStep] = useState<ResetStep>("phone");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
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

  const handleSendOtp = async () => {
    if (!phone) {
      toast({ 
        title: language === "ur" ? "خرابی" : "Error", 
        description: language === "ur" ? "فون نمبر درج کریں" : "Please enter your phone number", 
        variant: "destructive" 
      });
      return;
    }
    
    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      
      const { data, error } = await supabase.functions.invoke('send-password-reset-otp', {
        body: { phone: cleanPhone }
      });

      if (error) throw error;
      
      if (data?.error) {
        toast({ 
          title: language === "ur" ? "خرابی" : "Error", 
          description: data.error, 
          variant: "destructive" 
        });
        return;
      }

      // Demo mode: show OTP from server response
      if (data?.demo_otp) {
        toast({ 
          title: language === "ur" ? "OTP بھیج دیا گیا" : "OTP Sent", 
          description: language === "ur" 
            ? `تصدیقی کوڈ: ${data.demo_otp} (5 منٹ کے لیے درست)` 
            : `Verification code: ${data.demo_otp} (valid for 5 minutes)`
        });
      } else {
        toast({ 
          title: language === "ur" ? "OTP بھیج دیا گیا" : "OTP Sent", 
          description: language === "ur" ? "تصدیقی کوڈ بھیج دیا گیا" : "Verification code sent"
        });
      }
      
      setResetStep("otp");
    } catch (error: any) {
      toast({ 
        title: language === "ur" ? "خرابی" : "Error", 
        description: language === "ur" ? "کوئی خرابی ہوئی۔ دوبارہ کوشش کریں" : "An error occurred. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length !== 6) {
      toast({ 
        title: language === "ur" ? "خرابی" : "Error", 
        description: language === "ur" ? "6 ہندسوں کا OTP درج کریں" : "Please enter 6-digit OTP", 
        variant: "destructive" 
      });
      return;
    }
    // OTP will be verified server-side when resetting password
    setResetStep("newPassword");
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({ 
        title: language === "ur" ? "خرابی" : "Error", 
        description: language === "ur" ? "تمام خانے پر کریں" : "Please fill all fields", 
        variant: "destructive" 
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ 
        title: language === "ur" ? "خرابی" : "Error", 
        description: language === "ur" ? "پاس ورڈ مماثل نہیں" : "Passwords do not match", 
        variant: "destructive" 
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({ 
        title: language === "ur" ? "خرابی" : "Error", 
        description: language === "ur" ? "پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے" : "Password must be at least 6 characters", 
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      
      const { data, error } = await supabase.functions.invoke('reset-password-with-otp', {
        body: { phone: cleanPhone, otp, newPassword }
      });

      if (error) throw error;
      
      if (data?.error) {
        toast({ 
          title: language === "ur" ? "خرابی" : "Error", 
          description: data.error, 
          variant: "destructive" 
        });
        return;
      }

      toast({ 
        title: language === "ur" ? "کامیاب" : "Success", 
        description: language === "ur" ? "پاس ورڈ تبدیل ہو گیا۔ نئے پاس ورڈ سے لاگ ان کریں۔" : "Password updated successfully. Please login with your new password." 
      });
      resetForgotState();
      setMode("login");
    } catch (error: any) {
      toast({ 
        title: language === "ur" ? "خرابی" : "Error", 
        description: language === "ur" ? "کوئی خرابی ہوئی۔ دوبارہ کوشش کریں" : "An error occurred. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForgotState = () => {
    setResetStep("phone");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setPhone("");
  };

  const handleResendOtp = () => {
    setOtp("");
    handleSendOtp();
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
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

        {mode === "forgot" ? (
          <div className="space-y-6">
            {resetStep === "phone" && (
              <>
                <div className="text-center">
                  <KeyRound className="w-12 h-12 text-gold mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-foreground">{t("auth.resetPassword")}</h2>
                  <p className="text-muted-foreground">{t("auth.resetSubtitle")}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="resetPhone">{t("auth.accountNumber")}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="resetPhone"
                        type="tel"
                        placeholder="+92 300 1234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <Button onClick={handleSendOtp} disabled={loading} className="w-full bg-gold hover:bg-gold/90 text-gold-foreground">
                    {loading ? (language === "ur" ? "بھیجا جا رہا ہے..." : "Sending...") : (language === "ur" ? "OTP بھیجیں" : "Send OTP")}
                  </Button>
                </div>
              </>
            )}

            {resetStep === "otp" && (
              <>
                <div className="text-center">
                  <ShieldCheck className="w-12 h-12 text-gold mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-foreground">
                    {language === "ur" ? "OTP تصدیق" : "Verify OTP"}
                  </h2>
                  <p className="text-muted-foreground">
                    {language === "ur" 
                      ? `${phone} پر بھیجا گیا 6 ہندسوں کا کوڈ درج کریں` 
                      : `Enter the 6-digit code sent to ${phone}`}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-center">
                    <InputOTP 
                      value={otp} 
                      onChange={(value) => setOtp(value)} 
                      maxLength={6}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button onClick={handleVerifyOtp} disabled={loading || otp.length !== 6} className="w-full bg-gold hover:bg-gold/90 text-gold-foreground">
                    {language === "ur" ? "تصدیق کریں" : "Verify OTP"}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    {language === "ur" ? "کوڈ نہیں ملا؟" : "Didn't receive code?"}{" "}
                    <button onClick={handleResendOtp} className="text-gold hover:underline">
                      {language === "ur" ? "دوبارہ بھیجیں" : "Resend"}
                    </button>
                  </p>

                  <Button variant="outline" onClick={() => setResetStep("phone")} className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {language === "ur" ? "نمبر تبدیل کریں" : "Change Number"}
                  </Button>
                </div>
              </>
            )}

            {resetStep === "newPassword" && (
              <>
                <div className="text-center">
                  <KeyRound className="w-12 h-12 text-gold mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-foreground">
                    {language === "ur" ? "نیا پاس ورڈ" : "New Password"}
                  </h2>
                  <p className="text-muted-foreground">
                    {language === "ur" ? "اپنا نیا پاس ورڈ درج کریں" : "Enter your new password"}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>{language === "ur" ? "نیا پاس ورڈ" : "New Password"}</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={language === "ur" ? "نیا پاس ورڈ" : "New password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label>{language === "ur" ? "پاس ورڈ کی تصدیق" : "Confirm Password"}</Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={language === "ur" ? "پاس ورڈ کی تصدیق" : "Confirm password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleResetPassword} disabled={loading} className="w-full bg-gold hover:bg-gold/90 text-gold-foreground">
                    {loading 
                      ? (language === "ur" ? "اپ ڈیٹ ہو رہا ہے..." : "Updating...") 
                      : (language === "ur" ? "پاس ورڈ تبدیل کریں" : "Update Password")}
                  </Button>
                </div>
              </>
            )}

            <p className="text-center">
              <button 
                onClick={() => { resetForgotState(); setMode("login"); }} 
                className="text-gold hover:underline"
              >
                {t("auth.backToLogin")}
              </button>
            </p>
          </div>
        ) : mode === "login" ? (
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
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="password">{t("auth.password")}</Label>
                  <button 
                    onClick={() => setMode("forgot")} 
                    className="text-xs text-gold hover:underline"
                  >
                    {t("auth.forgotPassword")}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={language === "ur" ? "پاس ورڈ درج کریں" : "Enter your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
                    <div className="relative">
                      <Input
                        id="signupPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder={language === "ur" ? "پاس ورڈ بنائیں" : "Create a password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
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
