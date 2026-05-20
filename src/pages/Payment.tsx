import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  getPaymentSettings,
  getCurrencySymbol,
  Currency,
  getServiceById,
  getOrders,
} from "@/lib/localStorage";
import { addOrder } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/contexts/LocaleContext";
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  CreditCard,
  Smartphone,
  Copy,
} from "lucide-react";
import { fetchPaymentSettings, uploadPaymentScreenshot } from "@/lib/db";

interface OrderData {
  serviceId?: string;
  serviceName?: string;
  platform?: string;
  accountUrl?: string;
  quantity?: number;
  whatsappNumber?: string;
  price?: number;
  currency?: Currency;
  // optional cart
  cart?: Array<{
    packageId: string;
    serviceId: string;
    units: number;
    price: number;
  }>;
}

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLocale();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [noState, setNoState] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "stcpay" | "alrajhi" | "vodafone" | "instapay"
  >("stcpay");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [paymentSettings, setPaymentSettings] = useState(getPaymentSettings());

  useEffect(() => {
    fetchPaymentSettings()
      .then((s) => setPaymentSettings(s))
      .catch(() => setPaymentSettings(getPaymentSettings()));
    if (location.state) {
      const data = location.state as OrderData;
      // If cart exists and serviceName not provided, try to fetch name for first item
      if ((data as any).cart && Array.isArray((data as any).cart)) {
        const cart = (data as any).cart as Array<any>;
        if (!data.serviceName && cart.length > 0) {
          const svc = getServiceById(cart[0].serviceId);
          data.serviceName = svc ? svc.title : "Multiple Services";
        }
      }
      setOrderData(data);
      // Set default payment method based on currency
      if (data.currency === "EGP") {
        if (paymentSettings.vodafoneActive) setPaymentMethod("vodafone");
        else if (paymentSettings.instaPayActive) setPaymentMethod("instapay");
      } else {
        if (paymentSettings.stcPayActive) setPaymentMethod("stcpay");
        else if (paymentSettings.alRajhiActive) setPaymentMethod("alrajhi");
      }
    } else {
      // If user navigated directly, try to prefill using the last order in storage
      const orders = getOrders();
      const last = orders.length ? orders[orders.length - 1] : null;
      if (last) {
        setOrderData({
          serviceId: last.serviceId,
          serviceName: last.serviceName,
          platform: last.platform,
          accountUrl: last.accountUrl,
          quantity: last.quantity,
          whatsappNumber: last.whatsappNumber,
          price: last.price,
          currency: last.currency as Currency,
        });
        // set default payment method based on currency
        if (last.currency === "EGP") {
          if (paymentSettings.vodafoneActive) setPaymentMethod("vodafone");
          else if (paymentSettings.instaPayActive) setPaymentMethod("instapay");
        } else {
          if (paymentSettings.stcPayActive) setPaymentMethod("stcpay");
          else if (paymentSettings.alRajhiActive) setPaymentMethod("alrajhi");
        }
      } else {
        // No order context — render helpful page instead of redirecting
        setNoState(true);
      }
    }
  }, [location.state, navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = async () => {
    if (!orderData) return;

    if (!screenshot) {
      toast({
        title: t("screenshotRequired"),
        description: t("screenshotRequiredDesc"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    if (!screenshotFile) {
      toast({
        title: t("screenshotRequired"),
        description: t("screenshotRequiredDesc"),
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const url = await uploadPaymentScreenshot(screenshotFile);
      if (!url) {
        toast({
          title: t("uploadFailedTitle"),
          description: t("uploadFailedDesc"),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Create orders and collect their IDs so we can show a confirmation page
      // We intentionally persist orders and then redirect by IDs so that
      // the confirmation page can reliably fetch details even after refresh.
      const createdIds: string[] = [];

      if (orderData!.cart && orderData!.cart.length > 0) {
        const created = await Promise.all(
          orderData!.cart.map((ci) =>
            addOrder({
              serviceId: ci.serviceId,
              serviceName: orderData!.serviceName || "Service",
              platform: orderData!.platform || "",
              accountUrl: orderData!.accountUrl || "",
              quantity: ci.units,
              whatsappNumber: orderData!.whatsappNumber || "",
              price: ci.price,
              currency: orderData!.currency || "USD",
              paymentMethod: paymentMethod,
              paymentScreenshot: url,
              status: "pending",
            })
          )
        );
        created.forEach((c) => {
          if (c && (c as any).item && (c as any).item.id) createdIds.push((c as any).item.id);
        });
      } else {
        const c = await addOrder({
          serviceId: orderData!.serviceId || "",
          serviceName: orderData!.serviceName || "",
          platform: orderData!.platform || "",
          accountUrl: orderData!.accountUrl || "",
          quantity: orderData!.quantity || 0,
          whatsappNumber: orderData!.whatsappNumber || "",
          price: orderData!.price || 0,
          currency: orderData!.currency || "USD",
          paymentMethod: paymentMethod,
          paymentScreenshot: url,
          status: "pending",
        });
        if (c && (c as any).item && (c as any).item.id) createdIds.push((c as any).item.id);
      }

      setIsSubmitting(false);
      toast({ title: t("paymentSubmittedTitle"), description: t("paymentSubmittedDesc") });

      // Navigate to confirmation page with list of created ids so page can fetch them on refresh reliably
      if (createdIds.length > 0) {
        navigate(`/payment/confirmation?ids=${createdIds.join(",")}`);
      } else {
        // Fallback to homepage if creation failed unexpectedly
        navigate("/");
      }
    } catch (err) {
      toast({ title: t("uploadFailedTitle"), description: t("uploadFailedDesc"), variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  if (!orderData) {
    if (noState) {
      return (
        <div className="min-h-screen bg-background">
          <Navbar />
          <section className="py-24 px-4">
            <div className="container mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-heading font-bold mb-4">
                {t("noActiveOrderTitle")}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t("noActiveOrderMsg")}
              </p>
              <div className="flex gap-3 justify-center">
                <a
                  href="/"
                  className="inline-block px-4 py-2 rounded bg-primary text-primary-foreground"
                >
                  {t("goHome")}
                </a>
                <a
                  href="/"
                  className="inline-block px-4 py-2 rounded border border-border"
                >
                  {t("browseServices")}
                </a>
              </div>
            </div>
          </section>
        </div>
      );
    }
    return null;
  }

  const symbol = getCurrencySymbol(orderData.currency);

  // If this orderData contains a cart, compute display values
  const displayUnits =
    orderData.cart && orderData.cart.length > 0
      ? orderData.cart.reduce((s, it) => s + (it.units || 0), 0)
      : orderData.quantity || 0;

  const displayPrice =
    orderData.cart && orderData.cart.length > 0
      ? orderData.cart.reduce((s, it) => s + (it.price || 0), 0)
      : orderData.price || 0;

  return (
    <div className="min-h-screen metal-mesh-bg text-foreground pb-20">
      <Navbar />

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <button
            onClick={() => navigate(-1)}
            className="metal-btn px-5 py-2.5 text-xs font-black select-none shadow-md flex items-center justify-center gap-2 mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("back")}</span>
          </button>

          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-black font-heading metal-text-embossed-light mb-2">
              {t("completePayment")}
            </h1>
            <p className="text-sm font-semibold text-muted-foreground/80">{t("choosePaymentMethod")}</p>
          </div>

          {/* Order Summary */}
          <div className="chrome-bezel p-[6px] rounded-[24px] shadow-lg mb-8 animate-slide-up text-right">
            <div className="metal-brushed-dark p-6 rounded-[18px]">
              <h2 className="text-lg font-black font-heading metal-text-embossed-light border-b border-white/10 pb-3 mb-4">
                {t("orderSummary")}
              </h2>
              <div className="space-y-3 text-sm font-semibold text-muted-foreground/80">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{orderData.serviceName}</span>
                  <span className="text-muted-foreground/70">{t("serviceLabel")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{displayUnits.toLocaleString()}</span>
                  <span className="text-muted-foreground/70">{t("quantityLabel")}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <span className="text-xl font-black text-cyan-400 font-heading">
                    {symbol}{displayPrice.toFixed(2)}
                  </span>
                  <span className="font-black text-white">{t("totalAmount")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="chrome-bezel p-[6px] rounded-[24px] shadow-lg mb-8 animate-slide-up text-right" style={{ animationDelay: "0.1s" }}>
            <div className="metal-brushed p-6 rounded-[18px]">
              <h2 className="text-lg font-black font-heading metal-text-embossed flex items-center justify-end gap-2 border-b border-black/10 pb-3 mb-6">
                <span className="metal-text-embossed">{t("selectPaymentMethodTitle")}</span>
                <CreditCard className="w-5 h-5 text-black" />
              </h2>

              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) =>
                  setPaymentMethod(value as "stcpay" | "alrajhi" | "vodafone" | "instapay")
                }
                className="space-y-4"
              >
                {orderData.currency === "EGP" ? (
                  <>
                    {paymentSettings.vodafoneActive && (
                      <div
                        onClick={() => setPaymentMethod("vodafone")}
                        className={`flex items-center justify-end gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          paymentMethod === "vodafone"
                            ? "border-cyan-500 bg-black/15 shadow-inner"
                            : "border-black/10 bg-black/5 hover:border-black/25"
                        }`}
                      >
                        <Label
                          htmlFor="vodafone"
                          className="flex items-center justify-end gap-3 cursor-pointer flex-1 text-right"
                        >
                          <div>
                            <div className="font-black text-black text-base">Vodafone Cash</div>
                            <div className="text-xs font-bold text-black/60">
                              {t("mobileWalletPayment")}
                            </div>
                          </div>
                          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                            <Smartphone className="w-6 h-6 text-red-600" />
                          </div>
                        </Label>
                        <RadioGroupItem value="vodafone" id="vodafone" className="text-cyan-500" />
                      </div>
                    )}
                    {paymentSettings.instaPayActive && (
                      <div
                        onClick={() => setPaymentMethod("instapay")}
                        className={`flex items-center justify-end gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          paymentMethod === "instapay"
                            ? "border-cyan-500 bg-black/15 shadow-inner"
                            : "border-black/10 bg-black/5 hover:border-black/25"
                        }`}
                      >
                        <Label
                          htmlFor="instapay"
                          className="flex items-center justify-end gap-3 cursor-pointer flex-1 text-right"
                        >
                          <div>
                            <div className="font-black text-black text-base">InstaPay</div>
                            <div className="text-xs font-bold text-black/60">
                              Instant Bank Transfer
                            </div>
                          </div>
                          <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
                            <CreditCard className="w-6 h-6 text-purple-600" />
                          </div>
                        </Label>
                        <RadioGroupItem value="instapay" id="instapay" className="text-cyan-500" />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {paymentSettings.stcPayActive && (
                      <div
                        onClick={() => setPaymentMethod("stcpay")}
                        className={`flex items-center justify-end gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          paymentMethod === "stcpay"
                            ? "border-cyan-500 bg-black/15 shadow-inner"
                            : "border-black/10 bg-black/5 hover:border-black/25"
                        }`}
                      >
                        <Label
                          htmlFor="stcpay"
                          className="flex items-center justify-end gap-3 cursor-pointer flex-1 text-right"
                        >
                          <div>
                            <div className="font-black text-black text-base">STC Pay</div>
                            <div className="text-xs font-bold text-black/60">
                              {t("mobileWalletPayment")}
                            </div>
                          </div>
                          <div className="w-12 h-12 bg-zinc-900/10 rounded-full flex items-center justify-center border border-zinc-900/20">
                            <Smartphone className="w-6 h-6 text-zinc-800" />
                          </div>
                        </Label>
                        <RadioGroupItem value="stcpay" id="stcpay" className="text-cyan-500" />
                      </div>
                    )}

                    {paymentSettings.alRajhiActive && (
                      <div
                        onClick={() => setPaymentMethod("alrajhi")}
                        className={`flex items-center justify-end gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          paymentMethod === "alrajhi"
                            ? "border-cyan-500 bg-black/15 shadow-inner"
                            : "border-black/10 bg-black/5 hover:border-black/25"
                        }`}
                      >
                        <Label
                          htmlFor="alrajhi"
                          className="flex items-center justify-end gap-3 cursor-pointer flex-1 text-right"
                        >
                          <div>
                            <div className="font-black text-black text-base">Al Rajhi Bank</div>
                            <div className="text-xs font-bold text-black/60">
                              {t("bankTransfer")}
                            </div>
                          </div>
                          <div className="w-12 h-12 bg-zinc-900/10 rounded-full flex items-center justify-center border border-zinc-900/20">
                            <CreditCard className="w-6 h-6 text-zinc-800" />
                          </div>
                        </Label>
                        <RadioGroupItem value="alrajhi" id="alrajhi" className="text-cyan-500" />
                      </div>
                    )}
                  </>
                )}
              </RadioGroup>
            </div>
          </div>

          {/* Payment Details */}
          <div className="chrome-bezel p-[6px] rounded-[24px] shadow-lg animate-slide-up text-right" style={{ animationDelay: "0.2s" }}>
            <div className="metal-brushed p-6 md:p-8 rounded-[18px] space-y-6">
              <h2 className="text-lg font-black font-heading metal-text-embossed border-b border-black/10 pb-3">
                {t("paymentDetails")}
              </h2>
              
              <div className="p-4 bg-black/15 rounded-xl border border-black/10 shadow-inner space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {/* Copy button */}
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        const num = paymentMethod === "stcpay"
                          ? paymentSettings.stcPayNumber
                          : paymentMethod === "alrajhi"
                            ? paymentSettings.alRajhiAccount
                            : paymentMethod === "vodafone"
                              ? paymentSettings.vodafoneCash
                              : paymentSettings.instaPayAccount;
                        try {
                          await navigator.clipboard.writeText(num || "");
                          toast({ title: "Copied ✅", description: num });
                        } catch (err) {
                          toast({ title: "Copy failed", description: String(err) });
                        }
                      }}
                      className="bg-black/10 hover:bg-black/20 p-2 rounded-lg border border-black/10 select-none cursor-pointer"
                      aria-label={t("copyAccountNumber")}
                    >
                      <Copy className="w-4 h-4 text-black" />
                    </button>
                    
                    <span className="font-mono font-black text-base text-black" id="payment-account-number">
                      {paymentMethod === "stcpay"
                        ? paymentSettings.stcPayNumber
                        : paymentMethod === "alrajhi"
                          ? paymentSettings.alRajhiAccount
                          : paymentMethod === "vodafone"
                            ? paymentSettings.vodafoneCash
                            : paymentSettings.instaPayAccount}
                    </span>
                  </div>

                  <span className="text-xs font-black text-black/60">
                    {paymentMethod === "stcpay"
                      ? t("stcPayNumberLabel")
                      : paymentMethod === "alrajhi"
                        ? t("alRajhiAccountLabel")
                        : paymentMethod === "vodafone"
                          ? t("vodafoneCashNumberLabel")
                          : "InstaPay Account"}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-black/5">
                  <span className="font-black text-black text-xl font-heading">
                    {symbol}
                    {displayPrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-black text-black/60">
                    {t("amountToSendLabel")}
                  </span>
                </div>
              </div>

              {(() => {
                const qr =
                  paymentMethod === "stcpay"
                    ? paymentSettings.stcPayQr
                    : paymentMethod === "alrajhi"
                      ? paymentSettings.alRajhiQr
                      : null;
                if (qr) {
                  return (
                    <div className="p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-black/10 text-center shadow-inner">
                      <div className="text-xs font-black text-black/70 mb-2">
                        {t("scanQrToPay")}
                      </div>
                      <img
                        src={qr}
                        alt="Payment QR"
                        className="mx-auto max-h-48 rounded-lg border border-black/15 shadow-inner"
                      />
                    </div>
                  );
                }
                return null;
              })()}

              {/* Screenshot Upload */}
              <div className="space-y-2">
                <Label className="block text-xs font-black text-black/70 mb-1">{t("uploadScreenshot")} *</Label>
                <div className="border-2 border-dashed border-black/25 hover:border-cyan-500 rounded-2xl p-6 text-center bg-black/5 hover:bg-black/10 transition-colors shadow-inner">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label htmlFor="screenshot-upload" className="cursor-pointer block w-full h-full">
                    {screenshot ? (
                      <div className="space-y-2 select-none">
                        <CheckCircle className="w-12 h-12 mx-auto text-green-600" />
                        <p className="text-xs font-black text-black/75">
                          {t("screenshotUploaded")}
                        </p>
                        <img
                          src={screenshot}
                          alt="Payment screenshot"
                          className="max-h-32 mx-auto rounded-lg border border-black/15 shadow"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2 select-none">
                        <Upload className="w-12 h-12 mx-auto text-black/45" />
                        <p className="text-xs font-black text-black/60">
                          {t("uploadScreenshot")}
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="metal-btn-blue w-full h-12 text-sm font-black select-none shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? t("processing") : t("confirmPayment")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Payment;
