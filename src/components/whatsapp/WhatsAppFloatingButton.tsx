import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { generateWhatsAppLink } from '../../utils/formatters.ts';

export const WhatsAppFloatingButton: React.FC = () => {
  const { settings } = useStore();
  const whatsappNum = settings?.contact.whatsappNumber || '923002710174';

  const defaultMessage = `Hello King Crockery Store! I am browsing your website and would like assistance with an inquiry or placing an order.`;
  const href = generateWhatsAppLink(whatsappNum, defaultMessage);

  return (
    <aside aria-label="Support and Quick Contact" className="fixed bottom-6 right-6 z-40">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white pl-4 pr-5 py-3 shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-xs tracking-wide cursor-pointer"
        aria-label="Chat with King Crockery Store on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white stroke-[#25D366] shrink-0" />
        <span className="font-semibold tracking-wider uppercase">WhatsApp Us</span>
      </a>
    </aside>
  );
};
