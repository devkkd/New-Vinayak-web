"use client";

import { useState } from "react";

export default function ContactCTA() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) return;

    const msg = `Hi, I'm looking for jewellery at Vinayak Jewellers.%0A%0AName: ${encodeURIComponent(name.trim())}%0AMobile: ${encodeURIComponent(mobile.trim())}%0A%0APlease help me find the perfect piece.`;
    window.open(`https://wa.me/919414156451?text=${msg}`, "_blank");
  }

  return (
    <>
      <section className="vj-section">
        <div className="vj-container">
          <div className="vj-cta-box">

            <h3 className="vj-cta-title">
              SEARCHING FOR ALL JEWELLERY?
            </h3>

            <p className="vj-cta-sub">
              Our specialists are here to help you select the perfect piece!
            </p>

            <p className="vj-cta-sub vj-space">
              Our expert will get in touch with you shortly!
            </p>

            <form
              className="vj-cta-form"
              onSubmit={handleSubmit}
            >
              <div className="vj-field">
                <label className="vj-field-label">
                  Name
                </label>

                <input
                  type="text"
                  className="vj-input"
                  placeholder="Enter Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="vj-field">
                <label className="vj-field-label">
                  Mobile/WhatsApp Number
                </label>

                <input
                  type="tel"
                  className="vj-input"
                  placeholder="Enter Your Mobile/WhatsApp Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="vj-cta-btn"
              >
                Get In Touch →
              </button>
            </form>
          </div>
        </div>
      </section>

      <style jsx>{`.vj-section {
  width: 100%;
  background: #fff4dc;
  padding: 60px 72px;
}

.vj-container {
  max-width: 1400px;
  margin: 0 auto;
}

.vj-cta-box {
  border-radius: 24px;
  padding: 78px 70px;
  text-align: center;
  background: linear-gradient(180deg, #61311e 0%, #2a150c 100%);
  box-shadow: 0 18px 40px rgba(42, 21, 12, 0.2);
}

.vj-cta-title {
  margin: 0 0 18px;
  font-family: "Cinzel", serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
  color: #fff;
  text-transform: uppercase;
}

.vj-cta-sub {
  margin: 0;
  font-family: "Mona Sans", sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255,255,255,.9);
}

.vj-space {
  margin-bottom: 48px;
}

.vj-cta-form {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 22px;
}

.vj-field {
  flex: 1;
  text-align: left;
}

.vj-field-label {
  display: block;
 margin-bottom: 10px;
margin-left: 20px;
  font-family: "Mona Sans", sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
}

.vj-input {
  width: 100%;
  height: 50px;
  border: none;
  outline: none;
  border-radius: 999px;
  padding: 0 28px;
  background: #fff;
  color: #5a2f18;
  font-family: "Mona Sans", sans-serif;
  font-size: 14px;
}

.vj-input::placeholder {
  color: #8c8c8c;
}

.vj-cta-btn {
  height: 50px;
  padding: 0 46px;
  border: none;
  border-radius: 999px;
  background: #fff;
  color: #61311e;
  font-family: "Mona Sans", sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: .3s;
  white-space: nowrap;
}

.vj-cta-btn:hover {
  background: #f7f7f7;
  transform: translateY(-2px);
}
  @media (max-width: 992px) {

  .vj-section {
    padding: 48px 20px;
  }

  .vj-cta-box {
    padding: 48px 32px;
    border-radius: 18px;
  }

  .vj-cta-title {
    font-size: 30px;
  }

  .vj-cta-sub {
    font-size: 16px;
  }

  .vj-space {
    margin-bottom: 32px;
  }

  .vj-cta-form {
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
  }

  .vj-field {
    width: 100%;
  }

  .vj-input {
    height: 56px;
    font-size: 16px;
    padding: 0 22px;
  }

  .vj-cta-btn {
    width: 100%;
    height: 56px;
    font-size: 16px;
  }

}

@media (max-width: 576px) {

  .vj-section {
    padding: 32px 16px;
  }

  .vj-cta-box {
    padding: 32px 20px;
    border-radius: 14px;
  }

  .vj-cta-title {
    font-size: 22px;
    line-height: 1.35;
    margin-bottom: 12px;
  }

  .vj-cta-sub {
    font-size: 14px;
    line-height: 1.6;
  }

  .vj-space {
    margin-bottom: 24px;
  }

  .vj-field-label {
    font-size: 13px;
    margin-bottom: 6px;
  }

  .vj-input {
    height: 50px;
    font-size: 14px;
    padding: 0 18px;
  }

  .vj-cta-btn {
    height: 50px;
    font-size: 14px;
  }

}
`}</style>
    </>
  );
}