import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageCircle, Mail, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

import supra from "@/assets/cars/supra.jpg";
import gtr from "@/assets/cars/gtr.jpg";
import bmwM4 from "@/assets/cars/bmw-m4.jpg";
import huracan from "@/assets/cars/huracan.jpg";
import rx7 from "@/assets/cars/rx7.jpg";
import mustang from "@/assets/cars/mustang.jpg";
import porsche from "@/assets/cars/porsche.jpg";
import challenger from "@/assets/cars/challenger.jpg";
import wrx from "@/assets/cars/wrx.jpg";
import mclaren from "@/assets/cars/mclaren.jpg";
import nsx from "@/assets/cars/nsx.jpg";
import rs6 from "@/assets/cars/rs6.jpg";

const cars = [
  { src: supra, name: "Toyota Supra MK4" },
  { src: gtr, name: "Nissan GT-R R35" },
  { src: bmwM4, name: "BMW M4" },
  { src: huracan, name: "Lamborghini Huracán" },
  { src: rx7, name: "Mazda RX-7 FD" },
  { src: mustang, name: "Ford Mustang GT500" },
  { src: porsche, name: "Porsche 911 GT3 RS" },
  { src: challenger, name: "Dodge Challenger Hellcat" },
  { src: wrx, name: "Subaru WRX STI" },
  { src: mclaren, name: "McLaren 720S" },
  { src: nsx, name: "Honda NSX" },
  { src: rs6, name: "Audi RS6 Avant" },
];

const ContactPage = () => {
  const whatsappNumber = "+255 693 711 597";
  const whatsappLink = `https://wa.me/255693711597`;
  const email = "donmariniddy@gmail.com";

  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % cars.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + cars.length) % cars.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              WHERE YOU CAN <span className="neon-text">GET US</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Reach out anytime — we're just a message away.
            </p>
          </div>

          {/* Car Slideshow */}
          <div className="relative max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden neon-box">
            <div className="relative aspect-video">
              {cars.map((car, i) => (
                <img
                  key={car.name}
                  src={car.src}
                  alt={car.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    i === current ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              {/* Car name */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="font-heading text-xl md:text-2xl font-bold neon-text">
                  {cars[current].name}
                </span>
              </div>
              {/* Nav buttons */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/60 backdrop-blur flex items-center justify-center text-foreground hover:bg-primary/20 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/60 backdrop-blur flex items-center justify-center text-foreground hover:bg-primary/20 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            {/* Dots */}
            <div className="flex justify-center gap-2 py-3 bg-card/80">
              {cars.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === current ? "bg-primary w-6" : "bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
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
