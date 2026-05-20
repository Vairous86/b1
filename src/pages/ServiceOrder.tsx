import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Service } from "@/lib/localStorage";
import { getServices as fetchServices, getAllPackages as fetchAllPackages, addAnalytics, addOrder } from "@/lib/db";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Clock, Shield, CreditCard } from "lucide-react";
import { z } from "zod";

const urlOrderSchema = z.object({
  accountUrl: z.string().url({ message: "Please enter a valid URL" }),
  quantity: z
    .number()
    .min(100, { message: "Minimum quantity is 100" })
    .max(100000, { message: "Maximum quantity is 100,000" }),
  whatsappNumber: z
    .string()
    .min(10, { message: "Please enter a valid WhatsApp number" })
    .max(15, { message: "Phone number too long" }),
});
const textOrderSchema = z.object({
  serviceText: z.string().min(5, { message: "Please enter valid text" }),
  whatsappNumber: z
    .string()
    .min(10, { message: "Please enter a valid WhatsApp number" })
    .max(15, { message: "Phone number too long" }),
});

const ServiceOrder = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currency, symbol } = useCurrency();
  const { t, locale } = useLocale();
  const [service, setService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    accountUrl: "",
    serviceText: "",
    quantity: 1000,
    whatsappNumber: "",
  });
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      if (!serviceId) return navigate("/");
      try {
        const svcRes = await fetchServices();
        const svcArr = Array.isArray(svcRes?.data) ? (svcRes.data as Service[]) : [];
        const s = svcArr.find((x) => x.id === serviceId);
        if (!s) return navigate("/");
        setService(s);
        const pkgRes = await fetchAllPackages();
        const pkgArr = Array.isArray(pkgRes?.data) ? (pkgRes.data as any[]) : [];
        // Sort packages by units (ascending) so smallest packages appear first
        const list = pkgArr
          .filter((p) => p.serviceId === s.id)
          .sort((a, b) => (Number(a.units || 0) - Number(b.units || 0)));
        setPackages(list);
        const pk = list[0];
        if (pk) setSelectedPackageId(pk.id);
      } catch {
        navigate("/");
      }
    };
    load();
  }, [serviceId, navigate]);

  useEffect(() => {
    if (!service) return;
    document.title =
      locale === "ar"
        ? `${service.title} | bedo elmasry`
        : `${service.title} | bedo elmasry`;
  }, [service, locale]);

  if (!service) return null;

  const pricePerThousand = service?.prices?.[currency] ?? 0;
  const selectedPackage = packages.find((p) => p.id === selectedPackageId);
  const selectedPrice = selectedPackage
    ? selectedPackage.price?.[currency] ?? ((selectedPackage.units || 0) / 1000) * pricePerThousand
    : (formData.quantity / 1000) * pricePerThousand;
  const totalPrice = selectedPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      if (service.submissionType === "text") {
        textOrderSchema.parse({
          serviceText: formData.serviceText,
          whatsappNumber: formData.whatsappNumber,
        });
      } else {
        urlOrderSchema.parse({
          accountUrl: formData.accountUrl,
          quantity: formData.quantity,
          whatsappNumber: formData.whatsappNumber,
        });
      }

      const isText = service.submissionType === "text";
      const isFree = isText || service.requiresPayment === false;

      if (isFree) {
        const quantity = 0;
        const price = 0;
        const accountOrText = isText ? `TEXT:${formData.serviceText}` : formData.accountUrl;

        if (isText) {
          toast({
            title: t("requestSubmitted") || "تم استلام طلبك",
            description: t("whatsappReplyMsg") || "تم الطلب وسوف يتم الرد عليك من خلال واتس اب",
          });
        }

        addAnalytics({ type: "purchase", serviceId: service.id, meta: { quantity, price, free: true } } as any);
        addOrder({
          serviceId: service.id,
          serviceName: service.title,
          platform: service.platform,
          accountUrl: accountOrText,
          quantity,
          whatsappNumber: formData.whatsappNumber,
          price,
          currency,
          paymentMethod: "stcpay" as any,
          paymentScreenshot: null as any,
          status: "pending",
        } as any);
        setTimeout(() => {
          navigate(`/platform/${service.platform}`);
        }, 300);
        return;
      }

      const packagesShown = !isText && service.requiresPayment !== false;
      if (packagesShown && !selectedPackage) {
        setErrors({ quantity: "Please select a package" });
        return;
      }
      if (packagesShown && selectedPackage) {
        const item = {
          packageId: selectedPackage.id,
          serviceId: service.id,
          units: selectedPackage.units,
          price:
            selectedPackage.price?.[currency] ??
            ((selectedPackage.units || 0) / 1000) * pricePerThousand,
        };
        addAnalytics({ type: "add_to_cart", serviceId: service.id, meta: item } as any);
        navigate("/payment", {
          state: {
            serviceId: service.id,
            serviceName: service.title,
            platform: service.platform,
            cart: [item],
            accountUrl: formData.accountUrl,
            whatsappNumber: formData.whatsappNumber,
            currency,
          },
        });
        return;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="min-h-screen metal-mesh-bg text-foreground pb-20">
      <Navbar />

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <button
            onClick={() => navigate(`/platform/${service.platform}`)}
            className="metal-btn px-5 py-2.5 text-xs font-black select-none shadow-md flex items-center justify-center gap-2 mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("backToServices")}</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Left Side - Service Image and Details */}
            <div className="animate-fade-in flex flex-col gap-6 text-right order-2 lg:order-1">
              <div className="chrome-bezel p-[6px] rounded-[24px] shadow-xl">
                <div className="aspect-video rounded-[18px] overflow-hidden border border-black/20 shadow-inner">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                </div>
              </div>

              <div className="chrome-bezel p-[6px] rounded-[24px] shadow-xl">
                <div className="metal-brushed-dark p-6 rounded-[18px] space-y-4">
                  <h2 className="text-2xl font-black font-heading metal-text-embossed-light border-b border-white/10 pb-3">
                    {service.title}
                  </h2>
                  <p className="text-sm font-semibold text-muted-foreground/80 leading-relaxed">
                    {service.fullDescription}
                  </p>

                  <div className="flex items-center justify-end gap-6 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground/85 font-black">
                        {service.guarantee}
                      </span>
                      <Shield className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground/85 font-black">
                        {service.deliveryTime}
                      </span>
                      <Clock className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Order Form */}
            <div className="animate-slide-up text-right order-1 lg:order-2">
              <div className="chrome-bezel p-[6px] rounded-[24px] shadow-2xl">
                <div className="metal-brushed p-6 md:p-8 rounded-[18px]">
                  <h2 className="text-2xl font-black font-heading metal-text-embossed flex items-center justify-end gap-2 border-b border-black/10 pb-4 mb-6">
                    <span className="metal-text-embossed">{t("placeYourOrder")}</span>
                    <CreditCard className="w-6 h-6 text-black" />
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      {service.submissionType !== "text" ? (
                        <>
                          <Label htmlFor="accountUrl" className="block text-xs font-black text-black/75 mb-2 mr-1">
                            {t("accountUrlLabel")}
                          </Label>
                          <input
                            id="accountUrl"
                            type="url"
                            placeholder="https://instagram.com/your-profile"
                            value={formData.accountUrl}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                accountUrl: e.target.value,
                              })
                            }
                            className={`w-full bg-black/10 border border-black/20 text-black font-bold placeholder-black/45 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-xl px-4 py-3 h-12 text-right select-all ${
                              errors.accountUrl ? "border-destructive focus:ring-destructive" : ""
                            }`}
                          />
                          {errors.accountUrl && (
                            <p className="text-destructive font-bold text-xs mt-1 mr-1">
                              {errors.accountUrl}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <Label htmlFor="serviceText" className="block text-xs font-black text-black/75 mb-2 mr-1">
                            {t("serviceTextLabel")}
                          </Label>
                          <textarea
                            id="serviceText"
                            rows={5}
                            placeholder={t("serviceTextPlaceholder")}
                            value={formData.serviceText}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                serviceText: e.target.value,
                              })
                            }
                            className={`w-full bg-black/10 border border-black/20 text-black font-bold placeholder-black/45 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-xl px-4 py-3 text-right ${
                              errors.serviceText ? "border-destructive focus:ring-destructive" : ""
                            }`}
                          />
                          {errors.serviceText && (
                            <p className="text-destructive font-bold text-xs mt-1 mr-1">
                              {errors.serviceText}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {service.submissionType !== "text" && service.requiresPayment !== false && (
                      <div className="space-y-2">
                        <Label htmlFor="package" className="block text-xs font-black text-black/75 mb-2 mr-1">
                          {t("choosePackage")}
                        </Label>
                        <select
                          id="package"
                          value={selectedPackageId || ""}
                          onChange={(e) => setSelectedPackageId(e.target.value)}
                          className={`w-full bg-black/10 border border-black/20 text-black font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-xl px-4 py-2 h-12 text-right cursor-pointer ${
                            errors.quantity ? "border-destructive focus:ring-destructive" : ""
                          }`}
                        >
                          {packages.map((p) => (
                            <option key={p.id} value={p.id} className="text-black bg-white">
                              {Number(p.units || 0).toLocaleString()} {service.serviceType} —{" "}
                              {symbol}
                              {Number(
                                p.price?.[currency] ??
                                  ((p.units || 0) / 1000) * pricePerThousand
                              ).toFixed(2)}
                              {p.label ? ` — ${p.label}` : ""}
                            </option>
                          ))}
                        </select>
                        {packages.length === 0 && (
                          <p className="text-xs font-bold text-black/60 mt-1 mr-1">
                            {t("noPackagesMsg")}
                          </p>
                        )}
                        <p className="text-[10px] font-bold text-black/55 mt-1 mr-1 leading-normal">
                          {t("priceNote")}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="whatsappNumber" className="block text-xs font-black text-black/75 mb-2 mr-1">
                        {t("whatsappLabel")}
                      </Label>
                      <input
                        id="whatsappNumber"
                        type="tel"
                        placeholder="+966 5XX XXX XXXX"
                        value={formData.whatsappNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            whatsappNumber: e.target.value,
                          })
                        }
                        className={`w-full bg-black/10 border border-black/20 text-black font-bold placeholder-black/45 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-xl px-4 py-3 h-12 text-right select-all ${
                          errors.whatsappNumber ? "border-destructive focus:ring-destructive" : ""
                        }`}
                      />
                      {errors.whatsappNumber && (
                        <p className="text-destructive font-bold text-xs mt-1 mr-1">
                          {errors.whatsappNumber}
                        </p>
                      )}
                    </div>

                    {/* Display Total Price in a Recessed Panel if applicable */}
                    {service.requiresPayment !== false && (
                      <div className="bg-black/15 border border-black/20 rounded-xl p-4 flex items-center justify-between shadow-inner mt-4">
                        <span className="text-xs font-black text-black/60">{t("totalAmount")}</span>
                        <span className="text-2xl font-black text-black font-heading">
                          {symbol}{totalPrice.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="metal-btn-blue w-full h-12 text-sm font-black select-none shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>
                          {service.requiresPayment === false ? t("submitOrder") : t("proceedPayment")}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceOrder;
