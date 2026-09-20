import { MessageCircle } from "lucide-react";

export default function WhatsAppButton({ number, message }) {
  if (!number) return null;

  const cleanNumber = number.replace(/[^0-9]/g, "");
  const href = `https://wa.me/${cleanNumber}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat via WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-cyan text-void shadow-[0_0_0_1px_rgba(71,232,212,0.4),0_0_28px_-4px_rgba(71,232,212,0.9)] transition-transform hover:scale-110"
    >
      <MessageCircle size={26} fill="currentColor" className="text-void" />
    </a>
  );
}
