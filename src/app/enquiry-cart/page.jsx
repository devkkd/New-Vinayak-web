"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/adminApi";
import VisitOurStore from "../components/Visitourstore";
import ImageStrip from "../components/Imagestrip";

export default function EnquiryCartPage() {
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("enquiryCart")) || [];
    setCart(saved);
  }, []);

  const removeProduct = (id) => {
    const updated = cart.filter((item) => (item._id || item.id) !== id);
    setCart(updated);
    localStorage.setItem("enquiryCart", JSON.stringify(updated));
  };

  const sendEnquiry = async () => {
    if (!name.trim() || !phone.trim()) {
      alert("Please fill in your name and phone number.");
      return;
    }

    setSending(true);
    try {
      // Submit one enquiry per product to backend
      const endpoints = [
        `${API_BASE_URL}/api/enquiries`,
        `https://vinayakjewellersjaipur.com/api/enquiries`,
      ];

      for (const item of cart) {
        const productId = item._id || item.id;
        const productName = item.productName || item.title || "";
        const productImage =
          (item.images?.length > 0 ? item.images[0] : item.image) || "";

        const body = { name: name.trim(), phone: phone.trim(), productId, productName, productImage };

        for (const url of [...new Set(endpoints)]) {
          try {
            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
            if (res.ok) break;
          } catch (_) { /* try next */ }
        }
      }

      // Clear cart
      localStorage.removeItem("enquiryCart");
      setCart([]);
      setName("");
      setPhone("");
      setSuccessMsg("Your enquiry has been submitted! We'll contact you shortly.");
    } catch (e) {
      alert("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  function buildWhatsAppMessage() {
    let msg = `Hi, I'm interested in the following jewellery from Vinayak Jewellers:\n\n`;
    cart.forEach((item, i) => {
      const title = item.productName || item.title || "Product";
      const sku = item.sku || item._id || item.id || "";
      msg += `${i + 1}. ${title}`;
      if (sku) msg += ` (SKU: ${sku})`;
      msg += `\n`;
    });
    if (name.trim()) msg += `\nName: ${name.trim()}`;
    if (phone.trim()) msg += `\nPhone: ${phone.trim()}`;
    msg += `\n\nPlease share more details and pricing.`;
    return msg;
  }

  function handleWhatsApp() {
    if (cart.length === 0) return;
    const msg = buildWhatsAppMessage();
    window.open(
      `https://wa.me/919414156451?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  }

  return (
    <>
      <section className="cart-page">
        <div className="cart-container">
          <h1 className="cart-heading">Your Enquiry Cart</h1>

          {/* ── Success message ── */}
          {successMsg && (
            <div className="cart-success">
              <span>✓</span>
              <p>{successMsg}</p>
              <button onClick={() => router.push("/collections")}>Browse More →</button>
            </div>
          )}

          {!successMsg && (
            <>
              <div className="cart-products">
                {cart.length === 0 ? (
                  <div className="empty-cart">
                    <h3>Your enquiry cart is empty</h3>
                    <p>Please add products to continue.</p>
                  </div>
                ) : (
                  cart.map((item) => {
                    const id = item._id || item.id;
                    const title = item.productName || item.title || "Product";
                    const img = (item.images?.length > 0 ? item.images[0] : item.image) || "/home/logo.png";
                    const sku = item.sku || id;
                    return (
                      <div className="cart-item" key={id}>
                        <div className="cart-left">
                          <div className="cart-image">
                            <Image src={img} alt={title} fill onError={(e) => { e.currentTarget.src = "/home/logo.png"; }} />
                          </div>
                          <div className="cart-info">
                            <h3>{title}</h3>
                            <p>SKU: {sku}</p>
                          </div>
                        </div>
                        <button className="remove-btn" onClick={() => removeProduct(id)}>✕</button>
                      </div>
                    );
                  })
                )}
              </div>

              {cart.length > 0 && (
                <div className="contact-box">
                  <h2>Contact Information</h2>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <button className="send-btn" onClick={sendEnquiry} disabled={sending}>
                    {sending ? "Sending…" : "Send Enquiry →"}
                  </button>

                  <button type="button" className="whatsapp-btn" onClick={handleWhatsApp}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.6.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.1.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.5-.3Z"/>
                      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z" fillRule="evenodd" clipRule="evenodd"/>
                    </svg>
                    Send via WhatsApp
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <VisitOurStore />
      <ImageStrip />

      <style jsx>{`
   .cart-page{
  width:100%;
  background:#FFF4DC;
  padding:70px 20px 10px;
  box-sizing:border-box;

  min-height:auto;
  height:auto;
}

.cart-container{
  width:100%;
  max-width:880px;
  margin:0 auto;
  height:auto;
}

.cart-heading{
  margin:0 0 40px;
  text-align:center;
  font-family:"Cinzel",serif;
  font-size:30px;
  font-weight:600;
  color:#681f00;
}

.cart-products{
  display:flex;
  flex-direction:column;
  gap:24px;
  margin-bottom:50px;
}

.cart-item{
  display:flex;
  justify-content:space-between;
  align-items:center;
  background:#FFF8E7;
  border:1px solid #E8C87D;
  border-radius:22px;
  padding:26px;
}

.cart-left{
  display:flex;
  align-items:center;
  gap:22px;
  flex:1;
}

.cart-image{
  position:relative;
  width:78px;
  height:78px;
  border-radius:14px;
  overflow:hidden;
  flex-shrink:0;
}

.cart-image :global(img){
  object-fit:cover;
}

.cart-info{
  flex:1;
}

.cart-info h3{
  margin:0 0 10px;
  font-family:"Mona Sans",sans-serif;
  font-size:16px;
  line-height:1.45;
  font-weight:600;
  color:#681f00;
}

.cart-info p{
  margin:0;
  font-family:"Mona Sans",sans-serif;
  font-size:12px;
  color:#5e3a26;
}

.remove-btn{
  width:42px;
  height:42px;
  border:none;
  background:none;
  color:#d80000;
  font-size:24px;
  cursor:pointer;
  flex-shrink:0;
}

.contact-box{
  background:#fff4dc;
  border:1px solid #E8C87D;
  border-radius:24px;
  padding:38px;
  box-shadow:0 8px 22px rgba(0,0,0,.08);
}

.contact-box h2{
  margin:0 0 30px;
  text-align:center;
  font-family:"Mona Sans",sans-serif;
  font-size:26px;
  font-weight:600;
  color:#681f00;
}

.contact-box input{
  width:100%;
  height:62px;
  margin-bottom:22px;
  padding:0 24px;
  box-sizing:border-box;
  border:1px solid #E8C87D;
  border-radius:18px;
  background:#FFF8E7;
  outline:none;
  font-size:16px;
  font-family:"Mona Sans",sans-serif;
  color:#681f00;
}

.contact-box input::placeholder{
  color:#8a8a8a;
}

.send-btn{
  width:100%;
  height:62px;
  border:none;
  border-radius:999px;
  cursor:pointer;

  background:linear-gradient(
    90deg,
    #E8C87D 0%,
    #7B2D05 100%
  );

  color:#fff;
  font-size:16px;
  font-weight:500;
  font-family:"Mona Sans",sans-serif;

  transition:.25s;
}

.send-btn:hover{
  transform:translateY(-2px);
  box-shadow:0 10px 25px rgba(0,0,0,.18);
}
  .empty-cart{
  text-align:center;
  padding:60px 20px;
  border:1px dashed #E8C87D;
  border-radius:20px;
  color:#681f00;
}

.empty-cart h3{
  margin-bottom:10px;
  font-size:24px;
}

.empty-cart p{
  font-size:16px;
  opacity:.8;
}

.cart-success{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:16px;
  padding:60px 20px;
  border:1px solid #a8e6a0;
  border-radius:24px;
  background:#f0faf0;
  text-align:center;
}

.cart-success span{
  width:60px;
  height:60px;
  border-radius:50%;
  background:#2d6a00;
  color:#fff;
  font-size:28px;
  display:flex;
  align-items:center;
  justify-content:center;
}

.cart-success p{
  font-size:17px;
  font-weight:600;
  color:#2d6a00;
  margin:0;
}

.cart-success button{
  background:#681f00;
  color:#fff6de;
  border:none;
  border-radius:999px;
  padding:12px 28px;
  font-size:15px;
  font-weight:600;
  cursor:pointer;
  font-family:"Mona Sans",sans-serif;
}

.send-btn:disabled{
  opacity:0.65;
  cursor:not-allowed;
  transform:none;
}

.whatsapp-btn{
  width:100%;
  height:62px;
  border:none;
  border-radius:999px;
  cursor:pointer;
  background:#25D366;
  color:#fff;
  font-size:16px;
  font-weight:600;
  font-family:"Mona Sans",sans-serif;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  transition:.25s;
  margin-top:4px;
}

.whatsapp-btn:hover{
  background:#1aad52;
  transform:translateY(-2px);
  box-shadow:0 10px 25px rgba(37,211,102,.3);
}
  @media (max-width:900px){

  .cart-page{
    padding:40px 16px 70px;
  }

  .cart-heading{
    font-size:38px;
    margin-bottom:28px;
  }

  .cart-item{
    padding:18px;
  }

  .cart-left{
    gap:16px;
  }

  .cart-image{
    width:70px;
    height:70px;
  }

  .cart-info h3{
    font-size:18px;
  }

  .cart-info p{
    font-size:15px;
  }

  .contact-box{
    padding:24px;
  }

  .contact-box h2{
    font-size:28px;
  }

  .contact-box input{
    height:60px;
    font-size:18px;
  }

  .send-btn{
    height:60px;
    font-size:22px;
  }

}

@media (max-width:600px){

  .cart-heading{
    font-size:30px;
  }

  .cart-item{
    align-items:flex-start;
    padding:16px;
  }

  .cart-left{
    align-items:flex-start;
  }

  .cart-image{
    width:60px;
    height:60px;
  }

  .cart-info h3{
    font-size:16px;
    line-height:1.5;

    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    overflow:hidden;
  }

  .cart-info p{
    font-size:14px;
  }

  .remove-btn{
    font-size:28px;
    width:30px;
    height:30px;
  }

  .contact-box{
    padding:18px;
    border-radius:18px;
  }

  .contact-box h2{
    font-size:24px;
    margin-bottom:18px;
  }

  .contact-box input{
    height:54px;
    font-size:16px;
    margin-bottom:16px;
    border-radius:14px;
  }

  .send-btn{
    height:54px;
    font-size:18px;
  }

}

      `}</style>
    </>
  );
}