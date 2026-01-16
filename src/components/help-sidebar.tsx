const links = [
    "FAQs",
    "Ordering",
    "Shipping",
    "Returns + Exchanges",
    "International",
    "Sustainability",
    "Contact",
];

export default function HelpSidebar() {
    return (
        <div className="text-sm space-y-3">
            <h3 className="font-semibold mb-4">How Can We Help?</h3>
            {links.map((item) => (
                <p
                    key={item}
                    className={`cursor-pointer ${
                        item === "Contact" ? "font-semibold" : "text-gray-600"
                    }`}
                >
                    {item}
                </p>
            ))}
        </div>
    );
}
