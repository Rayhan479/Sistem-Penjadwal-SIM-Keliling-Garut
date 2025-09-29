"use client";
import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Phone,
  MessageCircle,
} from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}





export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(['Semua']);

  React.useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch('/api/faq');
        if (response.ok) {
          const data = await response.json();
          setFaqs(data);
          
          // Extract unique categories
          const uniqueCategories = ['Semua', ...new Set(data.map((faq: FAQ) => faq.category || 'Umum'))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const filteredFAQs = selectedCategory === 'Semua' 
    ? faqs 
    : faqs.filter(faq => (faq.category || 'Umum') === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">
            <HelpCircle className="mr-4" size={48} />
            Frequently Asked Questions
          </h1>
          <p className="text-xl opacity-90">
            Temukan jawaban atas pertanyaan yang sering diajukan tentang layanan SIM Keliling
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Filter Berdasarkan Kategori
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#2622FF] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-[#2622FF]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <p className="text-gray-600 text-center">
              {loading ? 'Memuat...' : `Menampilkan ${filteredFAQs.length} dari ${faqs.length} pertanyaan`}
            </p>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Memuat FAQ...</p>
              </div>
            ) : filteredFAQs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Tidak ada FAQ yang ditemukan.</p>
              </div>
            ) : (
              filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-xl"
                  >
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-[#2622FF] rounded-full mr-3">
                          {faq.category || 'Umum'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="ml-4">
                      {openFAQ === faq.id ? (
                        <ChevronUp className="text-[#2622FF]" size={24} />
                      ) : (
                        <ChevronDown className="text-gray-400" size={24} />
                      )}
                    </div>
                  </button>
                  
                  {openFAQ === faq.id && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Tidak Menemukan Jawaban yang Anda Cari?
          </h3>
          <p className="text-gray-600 mb-6">
            Hubungi kami langsung untuk mendapatkan bantuan lebih lanjut
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <a
              href="tel:(0262)1500000"
              className="flex items-center space-x-2 bg-[#2622FF] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors"
            >
              <Phone size={20} />
              <span>(0262) 1500-000</span>
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={20} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}