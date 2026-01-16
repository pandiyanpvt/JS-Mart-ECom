"use client";

export default function ContactForm() {
    return (
        <form className="space-y-6">
            <input
                type="text"
                placeholder="Subject"
                className="w-full border-b border-gray-300 focus:outline-none py-2"
            />

            <input
                type="text"
                placeholder="Name"
                className="w-full border-b border-gray-300 focus:outline-none py-2"
            />

            <input
                type="email"
                placeholder="Email"
                className="w-full border-b border-gray-300 focus:outline-none py-2"
            />

            <textarea
                placeholder="Enter your message here..."
                rows={4}
                className="w-full border border-gray-300 p-3 focus:outline-none"
            />

            {/* reCAPTCHA placeholder */}
            <div className="border border-gray-300 p-3 inline-flex items-center gap-3">
                <input type="checkbox" />
                <span className="text-sm">I'm not a robot</span>
            </div>

            <button
                type="submit"
                className="bg-gray-300 text-gray-700 px-10 py-3 text-sm uppercase"
            >
                Submit
            </button>
        </form>
    );
}
