import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageCircle, Mail, Phone } from "lucide-react";

const ContactPage = () => {
  const whatsappNumber = "+255 693 711 597";
  const whatsappLink = `https://wa.me/255693711597`;
  const email = "donmariniddy@gmail.com";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              WHERE YOU CAN <span className="neon-text">GET US</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Reach out anytime — we're just a message away.
            </p>
          </div>

          <div className="max-w-2xl mx-auto grid gap-8 md:grid-cols-2">
            {/* WhatsApp */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-2xl p-10 neon-box flex flex-col items-center gap-4 hover:scale-105 transition-transform group"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">WhatsApp</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{whatsappNumber}</span>
              </div>
              <span className="text-primary text-sm font-medium mt-2">Tap to chat →</span>
            </a>

            {/* Gmail */}
            <a
              href={`mailto:${email}`}
              className="glass rounded-2xl p-10 neon-box flex flex-col items-center gap-4 hover:scale-105 transition-transform group"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">Gmail</h2>
              <span className="text-muted-foreground text-sm">{email}</span>
              <span className="text-primary text-sm font-medium mt-2">Send an email →</span>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
