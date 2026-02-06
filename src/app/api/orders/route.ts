import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            address,
            cartItems,
            shippingMethod,
            shippingPrice,
            subtotal,
            total,
        } = body;

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const itemsHTML = cartItems
            .map(
                (item: any) => `
        <li>
          ${item.name} — Qty: ${item.quantity} — Rs.${item.price}
        </li>
      `
            )
            .join("");

        const html = `
      <h2>🛒 New Checkout Started</h2>

      <h3>Shipping Address</h3>
      <p>
        ${address.name}<br/>
        ${address.street_address}<br/>
        ${address.district}, ${address.province}<br/>
        ${address.postal_code}
      </p>

      <h3>Shipping Method</h3>
      <p>${shippingMethod} - Rs.${shippingPrice}</p>

      <h3>Items</h3>
      <ul>${itemsHTML}</ul>

      <h3>Summary</h3>
      <p>Subtotal: Rs.${subtotal}</p>
      <p>Total: Rs.${total}</p>
    `;

        await transporter.sendMail({
            from: `"Checkout" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: "New Checkout Started",
            html,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Mail failed" },
            { status: 500 }
        );
    }
}
