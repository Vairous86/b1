import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/db";
import type { Order } from "@/lib/localStorage";
import { useLocale } from "@/contexts/LocaleContext";

const PaymentConfirmation = () => {
  const [params] = useSearchParams();
  const idsParam = params.get("ids") || "";
  const ids = idsParam ? idsParam.split(",") : [];
  const [orders, setOrders] = useState<Order[]>([]);
  const { t } = useLocale();

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (ids.length === 0) return;
      const results: Order[] = [];
      for (const id of ids) {
        try {
          const res = await getOrderById(id);
          if (res && (res as any).item) results.push((res as any).item);
        } catch (e) {
          // ignore
        }
      }
      if (mounted) setOrders(results);
    })();
    return () => { mounted = false; };
  }, [ids]);

  if (!ids.length) {
    return (
      <div className="min-h-screen metal-mesh-bg text-foreground pb-20">
        <Navbar />
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <div className="chrome-bezel p-[6px] rounded-[24px] shadow-2xl animate-fade-in max-w-md mx-auto">
              <div className="metal-brushed p-8 rounded-[18px] text-center">
                <h2 className="text-2xl font-black font-heading metal-text-embossed mb-4">
                  {t("paymentConfirmation")}
                </h2>
                <p className="text-sm font-bold text-black/70 mb-6">
                  {t("noPaymentFound")}
                </p>
                <Link to="/" className="inline-block w-full">
                  <button className="metal-btn-blue w-full h-11 text-xs font-black select-none shadow-md cursor-pointer">
                    {t("goHome")}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen metal-mesh-bg text-foreground pb-20">
      <Navbar />
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-black font-heading metal-text-embossed-light mb-8 text-right">
            {t("paymentConfirmation")}
          </h1>
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="chrome-bezel p-[6px] rounded-[24px] shadow-lg animate-slide-up text-right">
                <div className="metal-brushed-dark p-6 rounded-[18px]">
                  <p className="text-sm font-semibold text-muted-foreground/80">{t("loading")}</p>
                </div>
              </div>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="chrome-bezel p-[6px] rounded-[24px] shadow-lg animate-slide-up text-right">
                  <div className="metal-brushed p-6 rounded-[18px]">
                    <h2 className="text-xl font-black font-heading metal-text-embossed border-b border-black/10 pb-3 mb-4">
                      {o.serviceName || "Order"}
                    </h2>
                    
                    <div className="space-y-3 text-sm font-bold text-black/85">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-zinc-900">{o.paymentMethod}</span>
                        <span className="text-black/60">{t("paymentMethod")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-black text-zinc-900">{o.currency} {o.price.toFixed(2)}</span>
                        <span className="text-black/60">{t("amount")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-zinc-900 break-all select-all">{o.accountUrl || o.whatsappNumber || "-"}</span>
                        <span className="text-black/60">{t("reference")}</span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-black/5 mt-4">
                        <span className="text-xs font-black text-cyan-600 bg-black/10 border border-cyan-500/30 px-3 py-1 rounded-full shadow-[0_0_8px_rgba(0,191,255,0.15)]">
                          {o.status === "pending" ? t("paymentUnderReview") : t("paymentReceived")}
                        </span>
                        
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => window.location.reload()}
                            className="metal-btn px-4 py-2 text-xs font-black select-none shadow-sm cursor-pointer"
                          >
                            {t("refresh")}
                          </button>
                          <Link to="/" className="inline-block">
                            <button className="metal-btn-blue px-4 py-2 text-xs font-black select-none shadow-sm cursor-pointer">
                              {t("goHome")}
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentConfirmation;
