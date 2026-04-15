import { useEffect, useMemo, useState } from "react";
import rawProducts from "./data/products.json";

type Promotion = {
  type?: string;
  minQty?: number;
  percent?: number;
  badge?: string;
  discountPercent?: number;
  discountedPrice?: number;
  regularPrice?: number;
  value?: number;
};

type Product = {
  id: string;
  name: string;
  description: string;
  usageGuide?: string;
  usdPrice: number;
  binancePrice: number;
  binanceCustomerPays: number;
  upiCustomerPays?: number;
  stock: number;
  totalStock?: number;
  sold: number;
  logo?: string;
  localImage: string;
  warrantyType?: string;
  warrantyDays?: number;
  promotions?: Promotion[];
  enriched?: {
    description?: string;
    warranty?: string;
    refund?: string;
    notes?: string[];
    useCases?: string[];
  };
  emoji?: string;
};

type CartItem = {
  productId: string;
  quantity: number;
};

type OrderStatus = "pending" | "paid" | "processing" | "delivered";
type PaymentMethod = "binance";

type Order = {
  id: string;
  code: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerTelegram: string;
  paymentMethod: PaymentMethod;
  paymentStatus: OrderStatus;
  deliveryStatus: OrderStatus;
  totalAmount: number;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
};

const products = (rawProducts as any[]).map(p => ({
  ...p,
  upiCustomerPays: p.upiCustomerPays || Math.round(p.usdPrice * 132) 
})) as Product[];

const CART_KEY = "t-shop-cart";
const ORDERS_KEY = "t-shop-orders";
const TELEGRAM_USERNAME = "tstoredigital2508";  // Channel for order checkout link
const SUPPORT_LINK = "https://t.me/tstoredigital250";  // Support & Questions

const currency = new Intl.NumberFormat("en-BD");

function loadJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function buildProductLink(productId: string) {
  return `${window.location.origin}/#product-${productId}`;
}

function getUnitPrice(product: Product, method: PaymentMethod) {
  return method === "binance" ? product.binanceCustomerPays : (product.upiCustomerPays || 0);
}

function buildOrderCode() {
  return `TSH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function buildTelegramCheckoutLink(order: Order) {
  const lines = [
    "🛒 New Order Request from T Shop",
    "",
    "👤 Customer Details",
    `• Name: ${order.customerName}`,
    `• Email: ${order.customerEmail}`,
    `• Telegram/WhatsApp: ${order.customerTelegram || "Not provided"}`,
    "",
    "📦 Order Summary",
    `• Order Code: ${order.code}`,
    `• Payment Method: ${order.paymentMethod === "binance" ? "Crypto (USDT)" : "Local (BDT)"}`,
    `• Total: ${order.paymentMethod === "binance" ? `$${order.totalAmount.toFixed(2)}` : `৳${currency.format(order.totalAmount)}`}`,
    "",
    "🧾 Products",
    ...order.items.flatMap((item, index) => {
      const unitPrice =
        order.paymentMethod === "binance"
          ? `$${item.unitPrice.toFixed(2)}`
          : `৳${currency.format(item.unitPrice)}`;

      return [
        `${index + 1}. ${item.productName}`,
        `   🔹 Quantity: ${item.quantity}`,
        `   🔹 Unit Price: ${unitPrice}`,
        `   🔗 Product Link: ${buildProductLink(item.productId)}`,
      ];
    }),
    "",
    "✅ Please confirm availability.",
  ];

  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(lines.join("\n"))}`;
}

async function sendOrderToBot(order: Order) {
  const botApiUrl = import.meta.env.VITE_BOT_API_URL;
  if (!botApiUrl) {
    return false;
  }

  const response = await fetch(`${botApiUrl.replace(/\/$/, "")}/send-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      storeName: "T Shop",
      supportUsername: TELEGRAM_USERNAME,
      order,
    }),
  });

  return response.ok;
}

const BoxIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const CartIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const LightningIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const ShieldIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const RefreshIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>;

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [cart, setCart] = useState<CartItem[]>(() => loadJson(CART_KEY, []));
  const [orders, setOrders] = useState<Order[]>(() => loadJson(ORDERS_KEY, []));
  const [checkoutMethod, setCheckoutMethod] = useState<PaymentMethod>("binance");
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: "",
    customerEmail: "",
    customerTelegram: "",
  });
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  function toggleExpand(id: string) {
    setExpandedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => saveJson(CART_KEY, cart), [cart]);
  useEffect(() => saveJson(ORDERS_KEY, orders), [orders]);

  const cartRows = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((entry) => entry.id === item.productId);
          return product ? { product, quantity: item.quantity } : null;
        })
        .filter(Boolean) as Array<{ product: Product; quantity: number }>,
    [cart],
  );

  const featuredProducts = useMemo(
    () => [...products].sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0) || b.sold - a.sold),
    [],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return featuredProducts.filter((product) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        (product.enriched?.description ?? product.description).toLowerCase().includes(normalizedQuery);

      const matchesCategory =
        activeCategory === "All" ||
        (activeCategory === "Veo 3" && (product.name.toLowerCase().includes("veo") || product.name.toLowerCase().includes("google"))) ||
        (activeCategory === "Kling" && product.name.toLowerCase().includes("kling")) ||
        (activeCategory === "Antigravity" && product.name.toLowerCase().includes("antigravity")) ||
        (activeCategory === "ChatGPT" && (product.name.toLowerCase().includes("chatgpt") || product.name.toLowerCase().includes("cdk"))) ||
        (activeCategory === "Grok" && (product.name.toLowerCase().includes("grok") || product.name.toLowerCase().includes("super grok"))) ||
        (activeCategory === "Github" && product.name.toLowerCase().includes("github")) ||
        (activeCategory === "Tools" &&
          ["capcut", "grammarly", "office", "ms365", "canva", "adobe"].some((keyword) =>
            product.name.toLowerCase().includes(keyword),
          )) ||
        (activeCategory === "Others" &&
          !["veo", "google", "kling", "antigravity", "chatgpt", "cdk", "grok", "github", "capcut", "grammarly", "office", "ms365", "canva", "adobe"].some((keyword) =>
            product.name.toLowerCase().includes(keyword),
          ));

      return matchesSearch && matchesCategory;
    });
  }, [featuredProducts, searchQuery, activeCategory]);

  const checkoutTotal = cartRows.reduce(
    (sum, row) => sum + getUnitPrice(row.product, checkoutMethod) * row.quantity,
    0,
  );
  const latestOrder = path.startsWith("/order/")
    ? orders.find((order) => order.code === decodeURIComponent(path.split("/order/")[1] ?? ""))
    : null;

  function updateCart(productId: string, quantity: number) {
    setCart((current) => {
      if (quantity <= 0) {
        return current.filter((item) => item.productId !== productId);
      }

      const existing = current.find((item) => item.productId === productId);
      if (!existing) {
        return [...current, { productId, quantity }];
      }

      return current.map((item) => (item.productId === productId ? { ...item, quantity } : item));
    });
  }

  async function submitOrder() {
    if (!checkoutForm.customerName || !checkoutForm.customerEmail || cartRows.length === 0) {
      return;
    }

    const order: Order = {
      id: crypto.randomUUID(),
      code: buildOrderCode(),
      createdAt: new Date().toISOString(),
      customerName: checkoutForm.customerName,
      customerEmail: checkoutForm.customerEmail,
      customerTelegram: checkoutForm.customerTelegram,
      paymentMethod: checkoutMethod,
      paymentStatus: "pending",
      deliveryStatus: "processing",
      totalAmount: checkoutTotal,
      items: cartRows.map(({ product, quantity }) => ({
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: getUnitPrice(product, checkoutMethod),
      })),
    };

    setOrders((current) => [order, ...current]);
    setCart([]);
    setCheckoutForm({ customerName: "", customerEmail: "", customerTelegram: "" });
    try {
      const delivered = await sendOrderToBot(order);
      if (!delivered) {
        window.open(buildTelegramCheckoutLink(order), "_blank", "noopener,noreferrer");
      }
    } catch {
      window.open(buildTelegramCheckoutLink(order), "_blank", "noopener,noreferrer");
    }
    navigate(`/order/${order.code}`);
  }

  return (
    <>
      {path === "/checkout" ? (
        <CheckoutPage
          cartRows={cartRows}
          checkoutMethod={checkoutMethod}
          checkoutTotal={checkoutTotal}
          form={checkoutForm}
          onBack={() => navigate("/")}
          onMethodChange={setCheckoutMethod}
          onFormChange={setCheckoutForm}
          onQuantityChange={updateCart}
          onSubmit={submitOrder}
        />
      ) : path === "/track" ? (
        <TrackOrderPage orders={orders} onBack={() => navigate("/")} onOpen={(code) => navigate(`/order/${code}`)} />
      ) : latestOrder ? (
        <OrderPage order={latestOrder} onBack={() => navigate("/")} onTrack={() => navigate("/track")} />
      ) : (
        <div className="page-shell">
          <header className="topbar">
            <button className="brand" onClick={() => navigate("/")}>
              T Store
            </button>
            <nav className="topbar-actions">
              <button className="ghost-button" onClick={() => navigate("/track")}>
                <BoxIcon /> Track Order
              </button>
              <button className="cart-button" onClick={() => navigate("/checkout")}>
                <CartIcon />
                {cartRows.length > 0 && <span className="cart-badge">{cartRows.reduce((sum, row) => sum + row.quantity, 0)}</span>}
              </button>
            </nav>
          </header>

          <main>
            <section className="hero">
              <div className="hero-pill">
                <LightningIcon /> 60 MIN DELIVERY
              </div>
              <h1>Premium Digital Products Store</h1>
              <p className="hero-sub">
                Get instant access to premium accounts and subscriptions. Lightning-fast delivery within 60 minutes, guaranteed.
              </p>
              <div className="hero-tags">
                <span className="hero-tag"><LightningIcon /> 60 Min Delivery</span>
                <span className="hero-tag"><ShieldIcon /> Warranty Included</span>
                <span className="hero-tag"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> Trusted Seller</span>
                <a
                  className="hero-tag solid"
                  href={SUPPORT_LINK}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Telegram Support
                </a>
              </div>
            </section>

            <section className="catalog" id="catalog">
              <div className="section-header">
                <div>
                  <h2>Available Products</h2>
                  <p>Choose your product and pay with Binance or local BDT payment.</p>
                </div>
                <div className="live-stock">
                  <span className="live-dot"></span> Live stock updates
                </div>
              </div>

              <div className="filters-container">
                <div className="search-bar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="category-filters">
                  {["All", "Veo 3", "Kling", "Antigravity", "ChatGPT", "Grok", "Github", "Tools", "Others"].map(cat => (
                    <button 
                      key={cat} 
                      className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <p>No products found matching your criteria.</p>
                  <button className="ghost-button" onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}>Clear Filters</button>
                </div>
              ) : (
                <div className="catalog-grid">
                  {filteredProducts.map((product) => {
                    const isExpanded = expandedProducts.has(product.id);
                    return (
                      <div className="product-card" key={product.id} id={`product-${product.id}`}>
                        <div className="product-header">
                        <img src={product.localImage} alt={product.name} className="product-icon" />
                        <div className="product-title-group">
                          <div className="product-title">{product.name}</div>
                          <div className="product-badges">
                            <span className="badge"><ShieldIcon /> Warranty</span>
                            <span className="badge"><RefreshIcon /> Refund Policy</span>
                            <span className="badge"><LightningIcon /> 60 min</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`product-desc ${isExpanded ? 'expanded' : ''}`}>
                        {product.enriched?.description ?? product.description}
                      </div>

                      {isExpanded && (
                        <div className="product-extended-details">
                          <div className="detail-row">
                            <strong>Warranty:</strong> {product.enriched?.warranty ?? product.warrantyType}
                          </div>
                          <div className="detail-row">
                            <strong>Refund:</strong> {product.enriched?.refund ?? "Replacement available where applicable."}
                          </div>
                          {(product.enriched?.notes ?? product.description.split("\n").filter(Boolean)).length > 0 && (
                            <div className="detail-row">
                              <strong>Notes:</strong>
                              <ul style={{ margin: "0.25rem 0", paddingLeft: "1.25rem" }}>
                                {(product.enriched?.notes ?? product.description.split("\n").filter(Boolean)).map((note, idx) => (
                                  <li key={idx}>{note}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      <button className="view-details" onClick={() => toggleExpand(product.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg> 
                        {isExpanded ? "Hide details" : "View details"}
                      </button>

                      <div className="product-stats">
                      <BoxIcon /> 
                      <span className="in-stock">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
                      <span>|</span>
                      <span>{product.sold} sold</span>
                    </div>

                    <div className="price-split">
                      <div className="price-block">
                        <span className="price-label">BINANCE</span>
                        <span className="price-value">${product.binanceCustomerPays.toFixed(2)}</span>
                        <span className="price-currency">USDT</span>
                      </div>
                      {product.upiCustomerPays && (
                      <div className="price-block">
                        <span className="price-label">LOCAL PRICE</span>
                        <span className="price-value">৳{currency.format(product.upiCustomerPays || 0)}</span>
                        <span className="price-currency">BDT</span>
                      </div>
                      )}
                    </div>

                    <button 
                      className="add-button" 
                      disabled={product.stock <= 0}
                      onClick={() => updateCart(product.id, (cart.find((item) => item.productId === product.id)?.quantity ?? 0) + 1)}>
                      <CartIcon /> Add to Cart
                    </button>
                  </div>
                );
              })}
                </div>
              )}
            </section>
          </main>
        </div>
      )}
    </>
  );
}

function CheckoutPage(props: {
  cartRows: Array<{ product: Product; quantity: number }>;
  checkoutMethod: PaymentMethod;
  checkoutTotal: number;
  form: { customerName: string; customerEmail: string; customerTelegram: string };
  onBack: () => void;
  onMethodChange: (method: PaymentMethod) => void;
  onFormChange: (form: { customerName: string; customerEmail: string; customerTelegram: string }) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="page-shell checkout-shell">
      <header className="topbar">
        <button className="brand" onClick={props.onBack}>
          T Store
        </button>
        <button className="ghost-button" onClick={props.onBack}>
          Return to Store
        </button>
      </header>
      <main className="checkout-layout">
        <section className="panel">
          <h2>Secure Checkout</h2>
          <div className="field-grid">
            <label>
              Full Name
              <input value={props.form.customerName} placeholder="John Doe" onChange={(event) => props.onFormChange({ ...props.form, customerName: event.target.value })} />
            </label>
            <label>
              Email Address
              <input value={props.form.customerEmail} placeholder="john@example.com" type="email" onChange={(event) => props.onFormChange({ ...props.form, customerEmail: event.target.value })} />
            </label>
            <label>
              Telegram / WhatsApp (Optional)
              <input value={props.form.customerTelegram} placeholder="@username" onChange={(event) => props.onFormChange({ ...props.form, customerTelegram: event.target.value })} />
            </label>
            </div>

            <div className="method-toggle">
              {(["binance"] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  className={props.checkoutMethod === method ? "is-selected" : ""}
                  onClick={() => props.onMethodChange(method)}
                >
                  {method === "binance" ? "Binance (USDT)" : "Binance (USDT)"}
                </button>
              ))}
            </div>

            <button className="add-button full-width" onClick={props.onSubmit} disabled={props.cartRows.length === 0 || !props.form.customerName || !props.form.customerEmail}>
            Confirm & Pay
            </button>
            </section>

        <section className="panel">
          <h3>Order Summary ({props.cartRows.length} Items)</h3>
          <div className="checkout-items">
            {props.cartRows.length === 0 && <p className="empty-copy">Your selection is empty.</p>}
            {props.cartRows.map(({ product, quantity }) => (
              <div className="checkout-item" key={product.id}>
                <img src={product.localImage} alt={product.name} />
                <div className="checkout-item-details">
                  <strong>{product.name}</strong>
                  <small>{props.checkoutMethod === "binance" ? "Binance Pay" : "Secure Local Pay"}</small>
                </div>Crypto Pay" : "Local BDT Payment
                <div className="qty-inline">
                  <button onClick={() => props.onQuantityChange(product.id, quantity - 1)}>-</button>
                  <span style={{ minWidth: "20px", textAlign: "center", fontWeight: "600" }}>{quantity}</span>
                  <button onClick={() => props.onQuantityChange(product.id, quantity + 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div className="total-box">
            <span>Total due</span>
            <strong>
              {props.checkoutMethod === "binance"
                ? `$${props.checkoutTotal.toFixed(2)} USDT`
                : `৳${new Intl.NumberFormat("en-IN").format(props.checkoutTotal)} BDT`}
            </strong>
          </div>currency
        </section>
      </main>
    </div>
  );
}

function TrackOrderPage({ orders, onBack, onOpen }: { orders: Order[]; onBack: () => void; onOpen: (code: string) => void }) {
  return (
    <div className="page-shell checkout-shell">
      <header className="topbar">
        <button className="brand" onClick={onBack}>
          T Store
        </button>
        <button className="ghost-button" onClick={onBack}>
          Back To Store
        </button>
      </header>
      <main>
        <div className="section-header">
          <div>
            <h2>Your Digital Orders</h2>
            <p>Track payment and delivery status</p>
          </div>
        </div>
        <div className="track-list">
          {orders.length === 0 && <p className="empty-copy" style={{ textAlign: "center" }}>No orders found on this device.</p>}
          {orders.map((order) => (
            <button key={order.id} className="track-card" onClick={() => onOpen(order.code)}>
              <div>
                <strong style={{ fontSize: "1.2rem" }}>{order.code}</strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-muted)" }}>{order.customerEmail}</p>
              </div>
              <div style={{ alignItems: "flex-end" }}>
                <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>{order.paymentStatus.toUpperCase()}</span>
                <small style={{ color: "var(--text-muted)" }}>{new Date(order.createdAt).toLocaleDateString()}</small>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

function OrderPage({ order, onBack, onTrack }: { order: Order; onBack: () => void; onTrack: () => void }) {
  return (
    <div className="page-shell checkout-shell">
      <header className="topbar">
        <button className="brand" onClick={onBack}>
          T Store
        </button>
        <button className="ghost-button" onClick={onTrack}>
          Order History
        </button>
      </header>
      <main>
        <div className="panel" style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
          <h2 style={{ margin: "0 0 0.5rem" }}>{order.code}</h2>
          <p style={{ color: "var(--text-muted)" }}>Your order has been securely saved. You can track payment and delivery status from this page anytime.</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", margin: "2rem 0" }}>
            <div style={{ padding: "1.5rem", background: "var(--price-bg)", borderRadius: "12px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Payment</span>
              <div style={{ fontSize: "1.2rem", fontWeight: "700", marginTop: "0.25rem" }}>{order.paymentMethod.toUpperCase()}</div>
              <small style={{ color: "var(--text-primary)", fontWeight: "600" }}>{order.paymentStatus}</small>
            </div>
            <div style={{ padding: "1.5rem", background: "var(--price-bg)", borderRadius: "12px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Total</span>
              <div style={{ fontSize: "1.2rem", fontWeight: "700", marginTop: "0.25rem" }}>
                ${order.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontSize: "1.1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>Order Items</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0 0" }}>
              {order.items.map((item) => (
                <li key={item.productId} style={{ padding: "0.75rem 0", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "500" }}>{item.productName}</span>
                  <span style={{ color: "var(--text-muted)", background: "var(--badge-bg)", padding: "0.2rem 0.6rem", borderRadius: "99px", fontSize: "0.8rem", fontWeight: "600" }}>x{item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
