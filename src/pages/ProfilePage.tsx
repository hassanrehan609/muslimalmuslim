import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, Phone, Edit2, Save, LogOut, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

type Denomination = "sunni" | "shia" | "hanafi";

const ProfilePage = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [denomination, setDenomination] = useState<Denomination>("sunni");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setFullName(data.full_name || "");
          setPhoneNumber(data.phone_number);
          setDenomination(data.denomination);
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          denomination: denomination
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: language === "ur" ? "کامیابی" : "Success",
        description: language === "ur" ? "پروفائل اپ ڈیٹ ہو گئی" : "Profile updated successfully"
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: language === "ur" ? "خرابی" : "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: language === "ur" ? "خرابی" : "Error",
        description: language === "ur" ? "پاس ورڈ میچ نہیں کر رہے" : "Passwords do not match",
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

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: language === "ur" ? "کامیابی" : "Success",
        description: language === "ur" ? "پاس ورڈ تبدیل ہو گیا" : "Password changed successfully"
      });
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordSection(false);
    } catch (error: any) {
      toast({
        title: language === "ur" ? "خرابی" : "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t("profile.title")}</h1>
            <p className="text-xs text-muted-foreground font-arabic">الملف الشخصي</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        {/* Profile Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-gold" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{fullName || t("profile.noName")}</h2>
          <p className="text-muted-foreground">{phoneNumber}</p>
        </div>

        {/* Profile Details */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">{t("profile.details")}</h3>
            {!isEditing ? (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                {t("profile.edit")}
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? t("common.loading") : t("profile.save")}
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label>{t("auth.fullName")}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                  placeholder={language === "ur" ? "آپ کا نام" : "Your name"}
                />
              </div>
            </div>

            <div>
              <Label>{t("profile.accountNumber")}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={phoneNumber}
                  disabled
                  className="pl-10 bg-muted"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t("profile.cannotChangePhone")}
              </p>
            </div>

            <div>
              <Label>{t("profile.denomination")}</Label>
              <RadioGroup 
                value={denomination} 
                onValueChange={(v) => isEditing && setDenomination(v as Denomination)} 
                className="mt-2 space-y-2"
                disabled={!isEditing}
              >
                <div className={`flex items-center space-x-3 p-3 rounded-lg border ${!isEditing ? 'opacity-60' : 'hover:border-gold'} transition-colors`}>
                  <RadioGroupItem value="sunni" id="sunni" disabled={!isEditing} />
                  <Label htmlFor="sunni" className="flex-1 cursor-pointer">
                    <span className="font-semibold">{language === "ur" ? "سنی" : "Sunni"}</span>
                  </Label>
                </div>
                <div className={`flex items-center space-x-3 p-3 rounded-lg border ${!isEditing ? 'opacity-60' : 'hover:border-gold'} transition-colors`}>
                  <RadioGroupItem value="shia" id="shia" disabled={!isEditing} />
                  <Label htmlFor="shia" className="flex-1 cursor-pointer">
                    <span className="font-semibold">{language === "ur" ? "شیعہ" : "Shia"}</span>
                  </Label>
                </div>
                <div className={`flex items-center space-x-3 p-3 rounded-lg border ${!isEditing ? 'opacity-60' : 'hover:border-gold'} transition-colors`}>
                  <RadioGroupItem value="hanafi" id="hanafi" disabled={!isEditing} />
                  <Label htmlFor="hanafi" className="flex-1 cursor-pointer">
                    <span className="font-semibold">{language === "ur" ? "حنفی" : "Hanafi"}</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </Card>

        {/* Change Password Section */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gold" />
              <h3 className="text-lg font-semibold text-foreground">{t("profile.changePassword")}</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowPasswordSection(!showPasswordSection)}
            >
              {showPasswordSection ? t("common.back") : t("profile.edit")}
            </Button>
          </div>

          {showPasswordSection && (
            <div className="space-y-4">
              <div>
                <Label>{t("profile.newPassword")}</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={language === "ur" ? "نیا پاس ورڈ" : "New password"}
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
                <Label>{t("profile.confirmPassword")}</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={language === "ur" ? "پاس ورڈ کی تصدیق کریں" : "Confirm password"}
                    className="pr-10"
                  />
                </div>
              </div>

              <Button 
                onClick={handleChangePassword} 
                disabled={changingPassword || !newPassword || !confirmPassword}
                className="w-full bg-gold hover:bg-gold/90 text-gold-foreground"
              >
                {changingPassword ? t("common.loading") : t("profile.updatePassword")}
              </Button>
            </div>
          )}
        </Card>

        {/* Logout Button */}
        <Button 
          variant="outline" 
          className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {t("profile.logout")}
        </Button>
      </main>
    </div>
  );
};

export default ProfilePage;
