"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/lib/data";
import ContactCTA from "@/app/components/ContactCTA";
import VisitOurStore from "@/app/components/Visitourstore";
import ImageStrip from "@/app/components/Imagestrip";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);

  if (!product) {
    return <div className="pd-notfound">Product not found.</div>;
  }

  return (
    <>
      <main className="pd-root">
        <div className="pd-imgwrap">
          <Image
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.title}
            fill
            className="pd-img"
            priority
          />
        </div>

        <div className="pd-info">
          <h1 className="pd-title">{product.title}</h1>

          <p className="pd-sku">
            <strong>SKU:</strong> {product.sku}
          </p>

          <p className="pd-category">
            <strong>Category:</strong>{" "}
            <Link
              href={`/${product.category}`}
              className="pd-category-link"
            >
              {product.collectionTag ||
                product.subCategory ||
                product.category}
            </Link>
          </p>

          <p className="pd-desc">
            {product.description}
          </p>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Hi, I'm interested in ${product.title} (SKU: ${product.sku})`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="pd-enquiry-btn"
          >
            Enquiry Now →
          </a>
          
        </div>
        
      </main>
      <ContactCTA />
      <VisitOurStore />
      <ImageStrip />

      <style jsx>{`
        .pd-root {
  font-family: "Mona Sans", sans-serif;
  background: #fff6de;
  color: #681f00;
  width: 100%;
  min-height: 100vh;
  padding: 48px 72px;
  box-sizing: border-box;

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}

        .pd-imgwrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 16px;
          overflow: hidden;
          background: #fff;
        }

        .pd-img {
          object-fit: cover;
        }

        .pd-info {
          display: flex;
          flex-direction: column;
        }

        .pd-title {
          font-family: "Cinzel", serif;
          font-size: 34px;
          line-height: 1.25;
          margin-bottom: 20px;
        }

        .pd-sku {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .pd-category {
          font-size: 15px;
          margin-bottom: 24px;
        }

        .pd-category-link {
          color: #681f00;
          font-weight: 600;
          text-decoration: underline;
        }

        .pd-desc {
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 32px;
        }

        .pd-enquiry-btn {
          display: inline-block;
          width: fit-content;
          background: #681f00;
          color: #fff6de;
          font-weight: 600;
          font-size: 15px;
          padding: 14px 28px;
          border-radius: 999px;
          text-decoration: none;
          transition: 0.3s ease;
        }

        .pd-enquiry-btn:hover {
          background: #8a2b00;
        }

        .pd-notfound {
          padding: 80px;
          text-align: center;
          font-family: "Mona Sans", sans-serif;
          font-size: 22px;
        }

        @media (max-width: 900px) {
          .pd-root {
            grid-template-columns: 1fr;
            padding: 24px 16px;
            gap: 30px;
          }

          .pd-title {
            font-size: 28px;
          }

          .pd-desc {
            font-size: 15px;
          }

          .pd-enquiry-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}