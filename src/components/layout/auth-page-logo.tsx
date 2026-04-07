import Link from "next/link";
import Image from "next/image";

const LOGO_SRC = "/logo/Web_Logo_Mart-01%20(1).png";

/** Logo on the grocery photo panel (desktop). Parent must be `relative`. */
export function AuthHeroCornerLogo() {
    return (
        <Link
            href="/"
            className="absolute top-5 left-5 md:top-7 md:left-7 z-20 flex items-center p-1 transition-opacity hover:opacity-90"
        >
            <Image
                src={LOGO_SRC}
                alt="JS Mart Australia"
                width={180}
                height={54}
                className="h-8 md:h-10 w-auto max-w-[132px] md:max-w-[168px] object-contain object-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                priority
            />
        </Link>
    );
}

/** Logo on the form column when the photo is hidden (mobile). */
export function AuthFormCornerLogo() {
    return (
        <Link
            href="/"
            className="md:hidden absolute top-7 right-5 z-20 flex items-center p-1"
        >
            <Image
                src={LOGO_SRC}
                alt="JS Mart Australia"
                width={140}
                height={42}
                className="h-8 w-auto max-w-[118px] object-contain object-left drop-shadow-sm"
                priority
            />
        </Link>
    );
}
