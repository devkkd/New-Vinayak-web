"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import VisitOurStore from "../components/Visitourstore";
import ImageStrip from "../components/Imagestrip";

export default function EnquiryCartPage() {
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("enquiryCart")) || [];
    setCart(saved);
  }, []);

  const removeProduct = (id) => {
    const updated = cart.filter((item) => item.id !== id);

    setCart(updated);

    localStorage.setItem(
      "enquiryCart",
      JSON.stringify(updated)
    );
  };

  const sendEnquiry = () => {
    if (!name || !phone) {
      alert("Please fill all details");
      return;
    }

    let message =
      `Name : ${name}\n` +
      `Phone : ${phone}\n\n`;

    message += "Interested Products:\n\n";

    cart.forEach((item, index) => {
      message +=
        `${index + 1}. ${item.title}\n` +
        `Model : ${item.id}\n\n`;
    });

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <>
      <section className="cart-page">

        <div className="cart-container">

          <h1 className="cart-heading">
            Your Enquiry Cart
          </h1>

        <div className="cart-products">

  {cart.length === 0 ? (

    <div className="empty-cart">
      <h3>Your enquiry cart is empty</h3>
      <p>Please add products to continue.</p>
    </div>

  ) : (

    cart.map((item) => (

      <div
        className="cart-item"
        key={item.id}
      >

        <div className="cart-left">

          <div className="cart-image">
            <Image
              src={item.images[0]}
              alt={item.title}
              fill
            />
          </div>

          <div className="cart-info">
            <h3>{item.title}</h3>
            <p>Model #{item.id}</p>
          </div>

        </div>

        <button
          className="remove-btn"
          onClick={() => removeProduct(item.id)}
        >
          ✕
        </button>

      </div>

    ))

  )}

</div>

        {cart.length > 0 && (
  <div className="contact-box">

    <h2>
      Contact Information
    </h2>

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

    <button
      className="send-btn"
      onClick={sendEnquiry}
    >
      Send Enquiry →
    </button>

  </div>
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