import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Copy, CheckCircle2, Building2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPaymentModal() {
  const [copied, setCopied] = useState<string | null>(null);

  const companyEmail = "info@yetosol.com";
  const companyPhone = "+2347039171254"; // WhatsApp number without spaces or '+'
  const whatsappUrl = `https://wa.me/${companyPhone}?text=Hello%20Yetosol%2C%20I%20would%20like%20to%20make%20a%20payment%20for%20my%20project.`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(type);
    toast.success(`${type} copied to clipboard`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-light-blue-300 text-light-blue-700 hover:bg-light-blue-50"
        >
          Make a Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <div className="mx-auto mb-4 bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center">
            <Building2 className="h-6 w-6 text-yellow-600" />
          </div>
          <DialogTitle className="text-xl font-black text-black text-center">
            Contact Yetosol for Payment
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center pt-2">
            To complete your project payment, please reach out to our team via email or WhatsApp.
            We'll guide you through the process and confirm your payment promptly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Email Option */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-light-blue-100 p-2 rounded-lg">
                <Mail className="h-5 w-5 text-light-blue-600" />
              </div>
              <div>
                <p className="font-bold text-black">Email Us</p>
                <p className="text-sm text-gray-500">We'll respond within 2 hours</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
              <span className="font-medium text-black">{companyEmail}</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleCopy(companyEmail, "Email")}
                >
                  {copied === "Email" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href={`mailto:${companyEmail}?subject=Project%20Payment%20Inquiry`}>
                    <Mail className="h-4 w-4 mr-1" />
                    Open Mail
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* WhatsApp Option */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-black">WhatsApp</p>
                <p className="text-sm text-gray-500">Fast response via chat</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
              <span className="font-medium text-black">{companyPhone}</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleCopy(companyPhone, "WhatsApp")}
                >
                  {copied === "WhatsApp" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Open WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Our team is available, Monday to Friday, 8:00 AM to 6:00 PM.
        </p>
      </DialogContent>
    </Dialog>
  );
}